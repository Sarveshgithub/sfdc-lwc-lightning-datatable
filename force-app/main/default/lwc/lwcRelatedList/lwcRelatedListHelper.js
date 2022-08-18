const configLocal = (cmp, local) => {
	if (local) {
		cmp.title = "Contacts";
		// cmp.iconName = "standard:account";
		cmp.fields = "FirstName,LastName,AccountId";
		cmp.objectName = "Contact";
		cmp.limit = 5;
		// cmp.recordId = "recid";
		// cmp.relatedFieldAPI = "AccountId";
		// cmp.whereClause;
		cmp.isCounterDisplayed = true;
		cmp.actionButtons = '[{"name": "New","label": "New","variant": "neutral"}]'; //buttons for the list
		cmp.showCheckboxes = true;
		cmp.showViewAll = false;
		cmp.hasPagination = false;
	}
};

export { configLocal };
