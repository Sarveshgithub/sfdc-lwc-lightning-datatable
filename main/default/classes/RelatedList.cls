public with sharing class RelatedList {
	@AuraEnabled public static List<SObject> getRecords(String soql) {
		System.debug('soql::' + soql);
		return Database.query(soql);
	}

	@AuraEnabled(cacheable = true) public static Integer countRecords(String objectName) {
		if(String.isNotEmpty(objectName)) {
			return database.countQuery('SELECT count() FROM ' + objectName);
		}
		return 0;
	}
}