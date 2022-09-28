public with sharing class RelatedList {
    private static Map<String, String> mapFieldToLwcDataType = new Map<String, String>{
        'datetime' => 'date'
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
            for (String fieldName : mapPreCols.keySet()) {
                //continue;
                if (fieldName.contains('.')) {
                    continue;
                }
                //Check if values predefined in LWC
                if (mapPreCols.containsKey(fieldName)) {
                    mapPreCols = checkOverride(mapPreCols, fieldName, mfields);
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

    @AuraEnabled(cacheable=true)
    public static Map<Id, List_Filter__c> fetchFilters(String cmpName) {
        Id currentUser = userInfo.getUserId();
        return new Map<Id, List_Filter__c>(
            [
                SELECT
                    Id,
                    Name,
                    Condition__c,
                    Public__c,
                    CreatedById,
                    CreatedBy.Name
                FROM List_Filter__c
                WHERE
                    Screen_Name__c = :cmpName
                    AND CreatedById = :currentUser
                    AND Public__c = :true
                WITH SECURITY_ENFORCED
            ]
        );
    }
    @AuraEnabled(cacheable=true)
    public static map<string, list<object>> getObjectFields(String objName) {
        map<string, list<object>> retVal = new Map<string, list<object>>();
        Map<String, Schema.SObjectField> fieldMap = Schema.getGlobalDescribe()
            .get(objName)
            .getDescribe()
            .fields.getMap();
        for (String fieldName : fieldMap.keySet()) {
            string fieldType = String.ValueOf(
                fieldMap.get(fieldName).getDescribe().getType()
            );
            if (fieldType != 'TEXTAREA') {
                String fieldApi = fieldMap.get(fieldName)
                    .getDescribe()
                    .getName();
                List<String> listStrings = new List<String>();
                listStrings.add(fieldApi);
                listStrings.add(fieldType); //Adding field type
                string fieldLabelName = fieldMap.get(fieldName)
                    .getDescribe()
                    .getLabel();
                retVal.put(fieldLabelName, listStrings);
            }
        }
        return retVal;
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
            sortable = mapPreCols.get(fieldName).sortable != null
                ? mapPreCols.get(fieldName).sortable
                : mfields.get(fieldName).getDescribe().isSortable();
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
