public with sharing class RelatedList {
    //used for aggregate results without aliases
    private static Integer counterExpressionAggregate = 0;
    private static Map<String, String> mapFieldToLwcDataType = new Map<String, String>{
        'datetime' => 'date',
        'date' => 'date-local',
        'percent' => 'percent-fixed'
    };
    public class ColumnJson {
        @AuraEnabled
        public String fieldName;
        @AuraEnabled
        public String label;
        @AuraEnabled
        public String type;
        @AuraEnabled
        public Boolean editable;
        @AuraEnabled
        public Boolean sortable;
        @AuraEnabled
        public Boolean wrapText = false;
        @AuraEnabled
        public String iconName;
        @AuraEnabled
        public TypeAttributes typeAttributes = null;
    }

    public virtual class TypeAttributes {}

    public class TypeAttributeColumnJsonWithPicklist extends TypeAttributes {
        @AuraEnabled
        public List<PicklistColumnUtils.PicklistValue> options = new List<PicklistColumnUtils.PicklistValue>();
        @AuraEnabled
        public TypeAttributeContext context = new TypeAttributeContext();
        @AuraEnabled
        public String fieldName;

        public TypeAttributeColumnJsonWithPicklist(List<PicklistColumnUtils.PicklistValue> options, String fieldName) {
            this.options = options;
            this.fieldName = fieldName;
        }
    }

    public class TypeAttributeContext {
        @AuraEnabled
        public string fieldName = 'Id';
    }

    public class TypeAttributeColumnLookup extends TypeAttributes {
        public String placeholder;
        public String objectApiName;
        public String fieldName;
        public String label;
        public TypeAttributeColumnLookupValue value = new TypeAttributeColumnLookupValue();
        public TypeAttributeContext context = new TypeAttributeContext();
        public String variant = 'label-hidden';
        public String name;
        public List<String> fields;
        public String target = '_self';
        
    }

    public class TypeAttributeColumnLookupValue {
        public String fieldName;
    }

    public class TypeAttributeColumnTextarea extends TypeAttributes {
        @AuraEnabled
        public TypeAttributeContext context = new TypeAttributeContext();
        @AuraEnabled
        public String fieldName;

        public TypeAttributeColumnTextarea(String fieldName) {
            this.fieldName = fieldName;
        }
        
    }

    public class ListResults {
        @AuraEnabled
        public List<SObject> records;
        @AuraEnabled
        public Map<String, ColumnJson> cols;
        @AuraEnabled
        public Integer count;
        @AuraEnabled
        public String iconName;
        public ListResults(
            List<SObject> records,
            Map<String, ColumnJson> cols,
            Integer count,
            String iconName
        ) {
            this.records = records;
            this.cols = cols;
            this.count = count;
            this.iconName = iconName;
        }
    }

    /**
     * Purpose : This method is used for building the Column JSON for data table
     */
    @AuraEnabled
    public static ListResults buildFieldJSON(
        String soql,
        String objectName,
        String whereClause,
        String colsJson
    ) {
        try {
            Map<String, ColumnJson> mapPreCols = (Map<String, ColumnJson>) Json.deserialize(
                colsJson,
                Map<String, ColumnJson>.class
            );
            SObjectType objType = Schema.getGlobalDescribe().get(objectName);
            Map<String, Schema.SObjectField> mfields = objType.getDescribe()
                .fields.getMap();
            List<ColumnJson> lstOfColumns = new List<ColumnJson>();
            Boolean soqlHasAggregateFunctions = hasFieldAggregateFunctions(soql);

            for (String fieldName : mapPreCols.keySet()) {
                //remove alias if set
                if (fieldName.contains('.')) {
                    continue;
                }
                //Check if values predefined in LWC
                if (mapPreCols.containsKey(fieldName)) {
                    if(soqlHasAggregateFunctions ) {
                        if(hasFieldAggregateFunctions(fieldName)) {
                            handleAggregateFunctionsFields(mapPreCols, fieldName, mfields);
                        }

                        continue;
                    }

                    switch on mapPreCols.get(fieldName).type {
                        when 'lookup' {
                            mapPreCols.get(fieldName).typeAttributes = new TypeAttributeColumnLookup();
                        }
                        when 'picklist' {
                            //check if the field is of type picklist in custom json => if so allow edit
                            RelatedList.initPicklistColumn(
                                mapPreCols,
                                objectName,
                                fieldName
                            );
                        }
                        when 'textarea' {
                            mapPreCols.get(fieldName).typeAttributes = new TypeAttributeColumnTextarea(fieldName);
                        }
                    }

                    mapPreCols = checkOverride(mapPreCols, fieldName, mfields);

                    String type = mapPreCols.get(fieldName).type;
                    //picklist list are set to editable by default, non editable picklist field are defined in the readme
                    if(String.isBlank(type) && mapPreCols.get(fieldName).type == 'picklist') {
                        RelatedList.initPicklistColumn(
                            mapPreCols,
                            objectName,
                            fieldName
                        );
                    }
                }
            }

           if(soqlHasAggregateFunctions) {
                soql = soql.replace('SELECT Id, ', 'SELECT ');
                soql = soql.replace(' WITH SECURITY_ENFORCED ', ''); 
                mapPreCols.remove('Id');
                //rename fields that have an alias
                mapPreCols = handleAliasesForAggregateResult(mapPreCols);
           }
           
           return new ListResults(
                getRecords(soql),
                mapPreCols,
                countRecords(objectName, whereClause),
                IconUtils.getIconName(objectName)
            );
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static Map<String, ColumnJson> handleAliasesForAggregateResult(Map<String, ColumnJson> mapPreCols) {
        Map<String, ColumnJson> tempMapPreCols = new Map<String, ColumnJson>(); 
        for (String fieldName : mapPreCols.keySet()) {
            
            if (fieldName.split(' ')?.size() == 2) {
                String alias = fieldName.split(' ')[1];

                tempMapPreCols.put(alias, mapPreCols.get(fieldName));
                tempMapPreCols.get(alias).label = mapPreCols.get(fieldName).label+'';
                tempMapPreCols.get(alias).fieldName = alias + (mapPreCols.get(fieldName).fieldName.endsWith('_url') ? '_url' : '');
            } else {
                tempMapPreCols.put(fieldName, mapPreCols.get(fieldName));
            }
        }

        return tempMapPreCols;
    }

    public static void handleAggregateFunctionsFields(
        Map<String, ColumnJson> mapPreCols,
        String fieldName,
        Map<String, Schema.SObjectField> mfields
    ) {
        String[] fieldElements = fieldName.split('\\)');
        String alias = (fieldElements.size() == 2) ? fieldElements.get(1) : ('expr'+counterExpressionAggregate++);

        if(!mapPreCols.containsKey(alias) ) {
            mapPreCols.put(alias, new ColumnJson());
        }

        System.debug('mapPreCols.get(fieldName) '+mapPreCols.get(fieldName));

        //aggregate result are never editable
        mapPreCols.get(alias).type = 'text';
        mapPreCols.get(alias).label = (String.isNotEmpty(mapPreCols.get(fieldName).label) ) ? 
                                    mapPreCols.get(fieldName).label : 
                                    alias;
        mapPreCols.get(alias).fieldName = alias;
        mapPreCols.get(alias).editable = false;
        mapPreCols.get(alias).sortable = false;

        //remove the key containing the aggregate function, we only keep the key with the alias if there is one
        mapPreCols.remove(fieldName);
    }

    public static Boolean hasFieldAggregateFunctions(String input) {
         // Define a regular expression pattern for the desired formats
        input = input?.toLowercase();
        String regex = '(?i)\\b(count\\(|count_distinct\\(|max\\(|avg\\(|min\\(|sum\\()\\w+(__c)?\\s*\\).*?$';
        
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(input);
        
        return matcher.find();
    }

    public static void initPicklistColumn(
        Map<String, ColumnJson> mapPreCols,
        String objectName,
        String fieldName
    ) {
        List<PicklistColumnUtils.PicklistValue> picklistValues = PicklistColumnUtils.getPicklistValues(
            objectName,
            fieldName
        );
        mapPreCols.get(fieldName).wrapText = true;
        mapPreCols.get(fieldName).typeAttributes = new TypeAttributeColumnJsonWithPicklist(picklistValues, fieldName);
    }

    @AuraEnabled
    public static List<SObject> getRecords(String soql) {
        try {
            return Database.query(soql);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<SObject> onSearch(
        String searchTerm,
        String objectApiName,
        String searchFields,
        String whereClause
    ) {
        List<SObject> records = new List<SObject>();
        String sosl = 'FIND :searchTerm IN ALL FIELDS RETURNING {0}( {1} {2} ) ';
        List<String> condition = new List<String>{
            objectApiName,
            searchFields,
            String.isNotEmpty(whereClause) ? (' WHERE ' + whereClause) : ''
        };
        sosl = String.format(sosl, condition);
        List<List<SObject>> results = search.query(sosl);
        for (List<SObject> s : results) {
            records.addAll(s);
        }
        return records;
    }

    @AuraEnabled(cacheable=true)
    public static Integer countRecords(String objectName, String whereClause) {
        String formattedWhere = (String.isBlank(whereClause))
            ? ''
            : ' ' + whereClause;

        if (String.isNotEmpty(objectName)) {
            return database.countQuery(
                'SELECT count() FROM ' +
                objectName +
                formattedWhere +
                ' WITH SECURITY_ENFORCED'
            );
        }
        return 0;
    }

    private static Map<String, ColumnJson> checkOverride(
        Map<String, ColumnJson> mapPreCols,
        String fieldName,
        Map<String, Schema.SObjectField> mfields
    ) {
        String label = mapPreCols.get(fieldName).label != null
                ? mapPreCols.get(fieldName).label
                : mfields.get(fieldName).getDescribe().getLabel(),
            type = mapPreCols.get(fieldName).type != null
                ? mapPreCols.get(fieldName).type.toLowercase()
                : String.valueOf(mfields.get(fieldName).getDescribe().getType())
                      .toLowercase();
        Boolean editable = mapPreCols.get(fieldName).editable != null
                ? mapPreCols.get(fieldName).editable
                : mfields.get(fieldName).getDescribe().isUpdateable(),
            sortable = true;
        //Update Map Json
        mapPreCols.get(fieldName).label = label;
        mapPreCols.get(fieldName).type = mapFieldToLwcDataType.containskey(type)
            ? mapFieldToLwcDataType.get(type)
            : type;
        mapPreCols.get(fieldName).editable = editable;
        mapPreCols.get(fieldName).sortable = sortable;
        return mapPreCols;
    }
}