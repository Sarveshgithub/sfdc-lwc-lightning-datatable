public with sharing class ListFilterController {
    /**
     * @description getObjectFields : Fetch fields of object name with field type, label and api name
     * @param  objName objName : Object Name
     * @return         return : return Map of label with fields( type, label)
     */
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
                listStrings.add(fieldType.toLowercase()); //Adding field type
                string fieldLabelName = fieldMap.get(fieldName)
                    .getDescribe()
                    .getLabel();
                retVal.put(fieldLabelName, listStrings);
            }
        }
        return retVal;
    }

    /**
     * @description fetchFilters : fetch filter that is created by user
     * @param  cmpName cmpName : component name of lwc with multiple screen
     * @return         return : Map<Id, List_Filter__c>
     */
    @AuraEnabled
    public static Map<Id, List_Filter__c> fetchFilters(String cmpName) {
        Id currentUser = userInfo.getUserId();
        return new Map<Id, List_Filter__c>(
            [
                SELECT
                    Id,
                    Name,
                    Condition__c,
                    Public__c,
                    Condition_JSON__c,
                    CreatedById,
                    CreatedBy.Name
                FROM List_Filter__c
                WHERE
                    (Screen_Name__c = :cmpName
                    AND CreatedById = :currentUser)
                    OR Public__c = TRUE
                WITH SECURITY_ENFORCED
            ]
        );
    }
    /**
     * @description insertFilter : insert list filter
     * @param  objFilter objFilter : List_Filter__c
     * @return           return : return inserted filter
     */
    @AuraEnabled
    public static List_Filter__c insertFilter(List_Filter__c objFilter) {
        try {
            insert objFilter;
            return objFilter;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
