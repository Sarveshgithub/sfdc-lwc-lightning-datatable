const configLocal = (cmp, local) => {
	if (local) {
		cmp.title = "Contacts";
		// cmp.iconName = "standard:account";
		cmp.fields = "FirstName,LastName,AccountId,CreatedDate,Account.Name";
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
		cmp.predefinedCol = '{"Account.Name":{"label":"Account Name","type":"text"}}';
	}
};

const setPredefinedColumnJSON = (cmp) => {
	if (cmp.fields.includes(".") && !cmp.predefinedCol) {
		cmp.error = "You have not configured related field defination.";
		return;
	}
	const predefinedCol = JSON.parse(cmp.predefinedCol);
	// Object.defineProperty(Object, 'hasOwnPropertyCI', {
	// 	enumerable: false,
	// 	value: (keyName) => (
	// 		Object.keys(this).findIndex(
	// 			v => v.toUpperCase() === keyName.toUpperCase()
	// 		) > -1
	// 	});

	Object.keys(predefinedCol).forEach((i) => {
		predefinedCol[i.toLowerCase()] = predefinedCol[i];
		delete predefinedCol[i];
	});
	console.log("llll", predefinedCol);
	const setPredefinedCol = {};
	cmp.fields
		.toLowerCase()
		.split(",")
		.forEach((element) => {
			element = element.trim();
			if (Object.prototype.hasOwnProperty.call(predefinedCol, element)) {
				setPredefinedCol[element] = { ...predefinedCol[element], fieldName: element };
			} else {
				setPredefinedCol[element] = { fieldName: element };
			}
		});
	console.log("data:::", setPredefinedCol);
	cmp.colsJson = setPredefinedCol;
};

export { configLocal, setPredefinedColumnJSON };
