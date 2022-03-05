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
  public static ListResults getRecords(String soql, String SObjectName) {
    return new ListResults(Database.query(soql), getIconName(SObjectName));
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
    
  public static String getIconName(String sObjectName){
        String u;
        List<Schema.DescribeTabSetResult> tabSetDesc = Schema.describeTabs();
        List<Schema.DescribeTabResult> tabDesc = new List<Schema.DescribeTabResult>();
        List<Schema.DescribeIconResult> iconDesc = new List<Schema.DescribeIconResult>();

        for(Schema.DescribeTabSetResult tsr : tabSetDesc) { tabDesc.addAll(tsr.getTabs()); }

        for(Schema.DescribeTabResult tr : tabDesc) {
            if( sObjectName == tr.getSobjectName() ) {
                if( tr.isCustom() == true ) {
                    iconDesc.addAll(tr.getIcons());
                } else {
                    u = 'standard:' + sObjectName.toLowerCase();
                }
            }
        }
        for (Schema.DescribeIconResult ir : iconDesc) {
            if (ir.getContentType() == 'image/svg+xml'){
                u = 'custom:' + ir.getUrl().substringBetween('custom/','.svg').substringBefore('_');
                break;
            }
        }
        
        return u;
    }
}