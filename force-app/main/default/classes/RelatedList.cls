public with sharing class RelatedList {
    private static Map<String, String> mapFieldToLwcDataType = new Map<String, String>{
        'datetime' => 'date',
        'date' => 'date-local',
        'percent' => 'percent-fixed'
    };
    /**
     * Purpose : This method is used for building the Column JSON for data table
     */
    @AuraEnabled
    public static ListResults buildFieldJSON(String soql, String objectName, String whereClause, String colsJson) {
        try {
            Map<String, ColumnJson> mapPreCols = (Map<String, ColumnJson>) Json.deserialize(colsJson, Map<String, ColumnJson>.class);
            SObjectType objType = Schema.getGlobalDescribe().get(objectName);
            Map<String, Schema.SObjectField> mfields = objType.getDescribe().fields.getMap();
            List<ColumnJson> lstOfColumns = new List<ColumnJson>();
            for (String fieldName : mapPreCols.keySet()) {
                //continue;
                if (fieldName.contains('.')) {
                    continue;
                }
                //Check if values predefined in LWC
                if (mapPreCols.containsKey(fieldName)) {
                    switch on mapPreCols.get(fieldName).type {
                        when 'lookup' {
                            mapPreCols.get(fieldName).typeAttributes = new TypeAttributes();
                        }
                        when 'picklist' {
                            //check if the field is of type picklist in custom json => if so allow edit
                            RelatedList.initPicklistColumn(mapPreCols, objectName, fieldName);
                        }
                        when 'textarea' {
                            mapPreCols.get(fieldName).typeAttributes = new TypeAttributeColumnTextarea(fieldName);
                        }
                    }

                    String type = mapPreCols.get(fieldName).type;
                    mapPreCols = checkOverride(mapPreCols, fieldName, mfields);
                    //picklist list are set to editable by default, non editable picklist field are defined in the readme
                    if (String.isBlank(type) && mapPreCols.get(fieldName).type == 'picklist') {
                        RelatedList.initPicklistColumn(mapPreCols, objectName, fieldName);
                    }
                }
            }
            return new ListResults(getRecords(soql), mapPreCols, countRecords(objectName, whereClause), IconUtils.getIconName(objectName));
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static void initPicklistColumn(Map<String, ColumnJson> mapPreCols, String objectName, String fieldName) {
        List<PicklistColumnUtils.PicklistValue> picklistValues = PicklistColumnUtils.getPicklistValues(objectName, fieldName);
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
    public static List<SObject> onSearch(String searchTerm, String objectApiName, String searchFields, String whereClause) {
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
        String formattedWhere = (String.isBlank(whereClause)) ? '' : ' ' + whereClause;

        if (String.isNotEmpty(objectName)) {
            return database.countQuery('SELECT count() FROM ' + objectName + formattedWhere + ' WITH SECURITY_ENFORCED');
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
                : String.valueOf(mfields.get(fieldName).getDescribe().getType()).toLowercase();
        Boolean editable = mapPreCols.get(fieldName).editable != null
                ? mapPreCols.get(fieldName).editable
                : mfields.get(fieldName).getDescribe().isUpdateable(),
            sortable = true;
        //Update Map Json
        mapPreCols.get(fieldName).label = label;
        mapPreCols.get(fieldName).type = mapFieldToLwcDataType.containskey(type) ? mapFieldToLwcDataType.get(type) : type;
        mapPreCols.get(fieldName).editable = editable;
        mapPreCols.get(fieldName).sortable = sortable;
        return mapPreCols;
    }

    /*******************************************************************
     * All Wrapper Classes
     *******************************************************************/
    public class ListResults {
        @AuraEnabled
        public List<SObject> records;
        @AuraEnabled
        public Map<String, ColumnJson> cols;
        @AuraEnabled
        public Integer count;
        @AuraEnabled
        public String iconName;
        public ListResults(List<SObject> records, Map<String, ColumnJson> cols, Integer count, String iconName) {
            this.records = records;
            this.cols = cols;
            this.count = count;
            this.iconName = iconName;
        }
    }

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
        public TypeAttributes typeAttributes;
    }

    public virtual class TypeAttributes {
        public String placeholder;
        public String objectApiName;
        public String fieldName;
        public String label;
        public TypeAttributeColumnLookupValue value;
        public TypeAttributeContext context;
        public String variant = 'label-hidden';
        public String name;
        public List<String> fields;
        public String target = '_self';
    }

    public class TypeAttributeColumnLookupValue {
        public String fieldName;
    }

    public class TypeAttributeContext {
        @AuraEnabled
        public string fieldName = 'Id';
    }

    public class TypeAttributeColumnLookup {
        public String placeholder;
        public String objectApiName;
        public String fieldName;
        public String label;
        public TypeAttributeColumnLookupValue value;
        public TypeAttributeContext context;
        public String variant = 'label-hidden';
        public String name;
        public List<String> fields;
        public String target = '_self';
    }

    public class TypeAttributeColumnJsonWithPicklist extends TypeAttributes {
        @AuraEnabled
        public List<PicklistColumnUtils.PicklistValue> options;
        @AuraEnabled
        public TypeAttributeContext context;
        @AuraEnabled
        public String fieldName;

        public TypeAttributeColumnJsonWithPicklist(List<PicklistColumnUtils.PicklistValue> options, String fieldName) {
            this.options = options;
            this.fieldName = fieldName;
        }
    }

    public class TypeAttributeColumnTextarea extends TypeAttributes {
        @AuraEnabled
        public TypeAttributeContext context;
        @AuraEnabled
        public String fieldName;

        public TypeAttributeColumnTextarea(String fieldName) {
            this.fieldName = fieldName;
        }
    }
}
