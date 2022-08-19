public with sharing class RelatedList {
	private static Map<String, String> mapFieldToLwcDataType = new Map<String, String>{ 'datetime' => 'date' };
	//String a = '"typeAttributes":{"day":"numeric","month":"short","year":"numeric","hour":"2-digit","minute":"2-digit","second":"2-digit","hour12"';
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
	public static ListResults buildFieldJSON(
		String fields,
		String soql,
		String objectName,
		String whereClause,
		String colsJson
	) {
		try {
			fields = fields.toLowercase();
			Map<String, ColumnJson> mapOfPredefinedCols = (Map<String, ColumnJson>) Json.deserialize(
				colsJson,
				Map<String, ColumnJson>.class
			);
			System.debug('mapOfPredefinedCols:::' + mapOfPredefinedCols);
			SObjectType accountType = Schema.getGlobalDescribe().get(objectName);
			Map<String, Schema.SObjectField> mfields = accountType.getDescribe().fields.getMap();
			List<ColumnJson> lstOfColumns = new List<ColumnJson>();
			for (String fieldName : mapOfPredefinedCols.keySet()) {
				fieldName = fieldName.toLowercase();
				//continue;
				if (fieldName.contains('.')) {
					continue;
				}
				//Check if values predefined in LWC
				String label = mapOfPredefinedCols.get(fieldName).label != null
						? mapOfPredefinedCols.get(fieldName).label
						: mfields.get(fieldName).getDescribe().getLabel(),
					type = mapOfPredefinedCols.get(fieldName).type != null
						? mapOfPredefinedCols.get(fieldName).type.toLowercase()
						: String.valueOf(mfields.get(fieldName).getDescribe().getType()).toLowercase();
				Boolean editable = mapOfPredefinedCols.get(fieldName).editable != null
						? mapOfPredefinedCols.get(fieldName).editable
						: mfields.get(fieldName).getDescribe().isUpdateable(),
					sortable = mapOfPredefinedCols.get(fieldName).sortable != null
						? mapOfPredefinedCols.get(fieldName).sortable
						: mfields.get(fieldName).getDescribe().isSortable();
				//Update Map Json
				mapOfPredefinedCols.get(fieldName).label = label;
				mapOfPredefinedCols.get(fieldName).type = mapFieldToLwcDataType.containskey(type)
					? mapFieldToLwcDataType.get(type)
					: type;
				mapOfPredefinedCols.get(fieldName).editable = editable;
				mapOfPredefinedCols.get(fieldName).sortable = sortable;
			}
			return new ListResults(
				getRecords(soql),
				mapOfPredefinedCols.values(),
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
