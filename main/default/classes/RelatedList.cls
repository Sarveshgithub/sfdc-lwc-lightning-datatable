public with sharing class RelatedList {
	@AuraEnabled public static List<SObject> getRecords(String soql) {
		System.debug('soql::' + soql);
		return Database.query(soql);
	}

	@AuraEnabled(cacheable=true) public static Integer countRecords(String countSOQL) {
		if (String.isNotEmpty(countSOQL)) {
			return database.countQuery(countSOQL);
		}
		return 0;
  	}	
}