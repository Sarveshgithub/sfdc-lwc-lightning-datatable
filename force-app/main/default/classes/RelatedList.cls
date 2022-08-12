public with sharing class RelatedList {
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
		public ColumnJson(String fieldName, String lable, String type, Boolean editable, Boolean sortable) {
			this.fieldName = fieldName;
			this.label = lable;
			this.type = type;
			this.editable = editable;
			this.sortable = sortable;
		}
	}

	public class ListResults {
		@AuraEnabled
		public List<SObject> records;
		@AuraEnabled
		public List<ColumnJson> cols;
		public ListResults(List<SObject> records, List<ColumnJson> cols) {
			this.records = records;
			this.cols = cols;
		}
	}

	/**
	 * Purpose : This method is used for building the Column JSON for data table
	 */
	@AuraEnabled
	public static ListResults buildFieldJSON(String fields, String soql, String objectName) {
		try {
			soql = 'SELECT FirstName,LastName,AccountId,Id,Opportunity__c,createdDate FROM Contact';
			fields = 'FirstName,LastName,AccountId,Id,Opportunity__c,createdDate';
			//,Opportunity__r.name
			fields = fields.toLowercase();
			SObjectType accountType = Schema.getGlobalDescribe().get('Contact');
			Map<String, Schema.SObjectField> mfields = accountType.getDescribe().fields.getMap();
			List<ColumnJson> lstOfColumns = new List<ColumnJson>();
			for (String fieldName : fields.split(',')) {
				system.debug('fieldName->>' + mfields.get(fieldName).getDescribe().getLabel()); // This will give you the api name of the field name.
				system.debug('type->>' + mfields.get(fieldName).getDescribe().getType());
				lstOfColumns.add(
					new ColumnJson(
						mfields.get(fieldName).getDescribe().getName(),
						mfields.get(fieldName).getDescribe().getLabel(),
						String.valueOf(mfields.get(fieldName).getDescribe().getType()),
						mfields.get(fieldName).getDescribe().isUpdateable(),
						mfields.get(fieldName).getDescribe().isSortable()
					)
				);
			}
			System.debug('cols::::' + lstOfColumns);
			return new ListResults(getRecords(soql), lstOfColumns);
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

	// @AuraEnabled
	// public static ListResults getRecords(String soql, String SObjectName, String iconName) {
	// 	//autoretrieve of the icon name based on sobject name if no icon is specified
	// 	if (String.isBlank(iconName)) {
	// 		iconName = IconUtils.getIconName(SObjectName);
	// 	}

	// 	return new ListResults(Database.query(soql), iconName);
	// }

	@AuraEnabled(cacheable=true)
	public static Integer countRecords(String objectName, String whereClause) {
		String formattedWhere = (String.isBlank(whereClause)) ? '' : ' ' + whereClause;

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
