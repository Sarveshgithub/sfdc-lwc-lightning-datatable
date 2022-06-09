public with sharing class RelatedList {
  public class ListResults {
    @AuraEnabled
    public List<SObject> records;
    @AuraEnabled
    public String iconName;

    public ListResults(List<SObject> records, String iconName) {
      this.records = records;
      this.iconName = iconName;
    }
  }

  @AuraEnabled
  public static string buildFieldJSON() {
    try {
      String fields = 'FirstName,LastName,AccountId,Id,Opportunity__c,Opportunity__r.name';
      fields = fields.toLowercase();
      SObjectType accountType = Schema.getGlobalDescribe().get('Contact');
      Map<String, Schema.SObjectField> mfields = accountType.getDescribe()
        .fields.getMap();
      for (String fieldName : fields.split(',')) {
        // Schema.DescribeSObjectResult currentSObjectResult = mfields.get(
        //     fieldName
        //   )
        //   .getDescribe();
        if (fieldName.contains('.')) {
          List<String> relatedFields = fieldName.split('.');
          while(relatedFields.size() > 1){
            // if(relatedFields[1].endsWith('__r')){
            //   relatedFields.remove(0);
            //   continue;
            // }
            if (relatedFields[0].endsWith('__r')) {
              relatedFields[0] = relatedFields[0].removeEnd('__r') + '__c';
            }
            if (relatedFields[1].endsWith('__r')) {
              relatedFields[1] = relatedFields[1].removeEnd('__r') + '__c';
            }
            String relatedTo = mfields.get(relatedFields[0]).getDescribe().getReferenceTo();
            Map<String, Schema.SObjectField> objectChild = Schema.getGlobalDescribe().get(relatedTo).getDescribe().fields.getMap();
            System.debug('child Label::::'+ objectChild.get(relatedFields[1]).getDescribe().getLabel());
            System.debug('child Type::::'+ objectChild.get(relatedFields[1]).getDescribe().getType());
            relatedFields.remove(0);
          }
        }
        system.debug('fieldName->>' + mfields.get(fieldName).getDescribe().getLabel()); // This will give you the api name of the field name.
        system.debug('type->>' + mfields.get(fieldName).getDescribe().getType());
      }
      return null;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
  @AuraEnabled
  public static ListResults getRecords(
    String soql,
    String SObjectName,
    String iconName
  ) {
    //autoretrieve of the icon name based on sobject name if no icon is specified
    if (String.isBlank(iconName)) {
      iconName = IconUtils.getIconName(SObjectName);
    }

    return new ListResults(Database.query(soql), iconName);
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
}
