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
	/**
	 * Purpose : This method is used for building the Column JSON for data table
	 */
	@AuraEnabled
	public static string buildFieldJSON() {
		try {
			String fields = 'FirstName,LastName,AccountId,Id,Opportunity__c';
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
			System.debug('data::::' + lstOfColumns);
			return null;
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled
	public static ListResults getRecords(String soql, String SObjectName, String iconName) {
		//autoretrieve of the icon name based on sobject name if no icon is specified
		if (String.isBlank(iconName)) {
			iconName = IconUtils.getIconName(SObjectName);
		}

		return new ListResults(Database.query(soql), iconName);
	}

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
