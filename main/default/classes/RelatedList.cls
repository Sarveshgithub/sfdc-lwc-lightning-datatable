public with sharing class RelatedList {
  @AuraEnabled
  public static List<SObject> getRecords(String soql) {
    return Database.query(soql);
  }

  @AuraEnabled(cacheable=true)
  public static Integer countRecords(String objectName) {
    if (String.isNotEmpty(objectName)) {
      return database.countQuery(
        'SELECT count() FROM ' +
        objectName +
        ' WITH SECURITY_ENFORCED'
      );
    }
    return 0;
  }
}
