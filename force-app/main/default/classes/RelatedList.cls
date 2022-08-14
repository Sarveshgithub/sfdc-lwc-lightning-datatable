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
		@AuraEnabled
		public Integer count;
		@AuraEnabled
		public String iconName;
		public ListResults(List<SObject> records, List<ColumnJson> cols, Integer count, String iconName) {
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
	public static ListResults buildFieldJSON(String fields, String soql, String objectName, String whereClause) {
		try {
			fields = fields.toLowercase();
			SObjectType accountType = Schema.getGlobalDescribe().get(objectName);
			Map<String, Schema.SObjectField> mfields = accountType.getDescribe().fields.getMap();
			List<ColumnJson> lstOfColumns = new List<ColumnJson>();
			for (String fieldName : fields.split(',')) {
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
			return new ListResults(
				getRecords(soql),
				lstOfColumns,
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
