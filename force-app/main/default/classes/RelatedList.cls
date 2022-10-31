public with sharing class RelatedList {
    private static Map<String, String> mapFieldToLwcDataType = new Map<String, String>{
        'datetime' => 'date',
        'date' => 'date-local',
        'picklist' => 'picklist'
    };
    public virtual class ColumnJson {
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
    }
    
    public class ContextTypeAttributeColumnJsonWithPicklist {
        @AuraEnabled public string fieldName = 'Id';
        
        public ContextTypeAttributeColumnJsonWithPicklist() {}
    }
    
    public class TypeAttributeColumnJsonWithPicklist {
        @AuraEnabled public List<PicklistValue> options = new List<PicklistValue>();
        @AuraEnabled public ContextTypeAttributeColumnJsonWithPicklist context = new ContextTypeAttributeColumnJsonWithPicklist();
        @AuraEnabled public String fieldName;
        
        public TypeAttributeColumnJsonWithPicklist() {}
    }
    
    public class ColumnJsonWithPicklist extends ColumnJson {
        @AuraEnabled public TypeAttributeColumnJsonWithPicklist typeAttributes = new TypeAttributeColumnJsonWithPicklist();
        
        public ColumnJsonWithPicklist(ColumnJson oldColumn, List<PicklistValue> options) {
            this.fieldName = oldColumn.fieldName;
            this.label = oldColumn.label;
            this.type = oldColumn.type;
            this.editable = oldColumn.editable;
            this.sortable = oldColumn.sortable;
            this.wrapText = true;
            this.typeAttributes.options = options;
            this.typeAttributes.context = new ContextTypeAttributeColumnJsonWithPicklist();
            this.typeAttributes.fieldName = oldColumn.fieldName;
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
            System.debug(Schema.getGlobalDescribe());
            SObjectType objType = Schema.getGlobalDescribe().get(objectName);
            Map<String, Schema.SObjectField> mfields = objType.getDescribe()
                .fields.getMap();
            List<ColumnJson> lstOfColumns = new List<ColumnJson>();
            for (String fieldName : mapPreCols.keySet()) {
                //continue;
                if (fieldName.contains('.')) {
                    continue;
                }
                //Check if values predefined in LWC
                if (mapPreCols.containsKey(fieldName)) {
                    mapPreCols = checkOverride(mapPreCols, fieldName, mfields);
                }

                //get picklistValues
                if(mapPreCols.get(fieldName).type == 'picklist') {
                    List<PicklistValue> picklistValues = RelatedList.getPicklistValues(objectName, fieldName);
    				ColumnJsonWithPicklist col = new ColumnJsonWithPicklist(mapPreCols.get(fieldName), picklistValues);
                    mapPreCols.put(fieldName, col);
                }
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
        System.debug(String.valueOf(mfields.get(fieldName).getDescribe().getType()));
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
        System.debug(mapPreCols);
        return mapPreCols;
    }
    
    public class PicklistValue {
        @AuraEnabled public String label;
        @AuraEnabled public String value;
        
        public PicklistValue(String label, String value) {
            this.label = label;
            this.value = value;
        }
    }

    static List<PicklistValue> getPicklistValues(
        String objectName,
        String fieldName
    ) {
        List<Schema.PicklistEntry> entries = new List<Schema.PicklistEntry>();
        Schema.DescribeSobjectResult objDescription = Schema.describeSObjects(
            new List<String>{ objectName }
        )[0];
        Schema.SObjectField field = objDescription.fields.getMap()
            .get(fieldName);
        
        entries = field.getDescribe().getPickListValues();
        entries = getActivePicklistEntries(entries);
        
        List<PicklistValue> picklistValues = new List<PicklistValue>();
        
        for(Schema.PicklistEntry pvalue: entries) {
            picklistValues.add(new PicklistValue(pvalue.getLabel(), pvalue.getValue() ) );
        }
        
        
        return picklistValues;
    }

     private static List<Schema.PicklistEntry> getActivePicklistEntries(
        List<Schema.PicklistEntry> entries
    ) {
        List<Schema.PicklistEntry> activeEntries = new List<Schema.PicklistEntry>();
        for (Schema.PicklistEntry entry : entries) {
            if (entry.isActive()) {
                activeEntries.add(entry);
            }
        }
        return activeEntries;
    }
}