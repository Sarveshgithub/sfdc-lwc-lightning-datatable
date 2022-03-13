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
  public static ListResults getRecords(String soql, String SObjectName, String iconName) {
      //autoretrieve of the icon name based on sobject name if no icon is specified
      if(String.isBlank(iconName) ) {
          iconName = IconUtils.getIconName(SObjectName);
      }  
      
      return new ListResults(Database.query(soql), iconName);
  }

  @AuraEnabled(cacheable=true)
  public static Integer countRecords(String objectName, String whereClause) {
    String formattedWhere = (String.isBlank(whereClause)) ? '' : ' '+whereClause; 

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