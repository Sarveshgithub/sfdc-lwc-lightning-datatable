public with sharing class PicklistColumnUtils {
    public class PicklistValue {
        @AuraEnabled
        public String label;
        @AuraEnabled
        public String value;

        public PicklistValue(String label, String value) {
            this.label = label;
            this.value = value;
        }
    }

    public static List<PicklistValue> getPicklistValues(
        String objectName,
        String fieldName
    ) {
        List<Schema.PicklistEntry> entries = new List<Schema.PicklistEntry>();
        Schema.DescribeSobjectResult objDescription = Schema.describeSObjects(
            new List<String>{ objectName }
        )[0];
        Schema.SObjectField field = objDescription.fields.getMap()
            .get(fieldName);

        entries = field.getDescribe().getPickListValues();
        entries = getActivePicklistEntries(entries);

        List<PicklistValue> picklistValues = new List<PicklistValue>();

        for (Schema.PicklistEntry pvalue : entries) {
            picklistValues.add(
                new PicklistValue(pvalue.getLabel(), pvalue.getValue())
            );
        }

        return picklistValues;
    }

    private static List<Schema.PicklistEntry> getActivePicklistEntries(
        List<Schema.PicklistEntry> entries
    ) {
        List<Schema.PicklistEntry> activeEntries = new List<Schema.PicklistEntry>();
        for (Schema.PicklistEntry entry : entries) {
            if (entry.isActive()) {
                activeEntries.add(entry);
            }
        }
        return activeEntries;
    }
}
