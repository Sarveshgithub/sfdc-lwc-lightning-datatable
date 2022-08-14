const configLocal = (cmp) => {
	cmp.title = "LWC Datatable";
	// cmp.iconName = "standard:account";
	cmp.fields = "FirstName,LastName,AccountId,Opportunity__c";
	cmp.objectName = "Contact";
	cmp.limit = 5;
	cmp.hasPagination = true;
};

export { configLocal };
