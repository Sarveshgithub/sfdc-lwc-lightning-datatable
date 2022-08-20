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
		cmp.predefinedCol =
			'{"Account.Name":{"label":"Account Name","type":"url","typeAttributes":{"label": { "fieldName": "AccountId"}}},"AccountId":{"label":"Ac Id","type":"Id"}}';
	}
};

const setPredefinedColumnJSON = (cmp) => {
	if (cmp.fields.includes(".") && !cmp.predefinedCol) {
		cmp.error = "You have not configured related field defination.";
		throw new Error("error");
	}
	const predefinedCol = JSON.parse(cmp.predefinedCol);
	const setPredefinedCol = {};
	cmp.fields.split(",").forEach((element) => {
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

const formatData = (records, cols) => {
	records.forEach((e) => {
		// eslint-disable-next-line guard-for-in
		for (let key in e) {
			// if (key === 'fieldName'){
			// 	let a = 3;
			//cols[e[key]].type = 'url'
			// }
			// if(Object.prototype.hasOwnProperty.call(cols, key)) {
			// 	//let a =
			// 	if(cols[key].type === 'url'){

			// 	}
			// }

			if (typeof e[key] === "object") {
				for (let onLevel in e[key]) {
					if (Object.prototype.hasOwnProperty.call(e[key], onLevel)) {
						e[key + "." + onLevel] = e[key][onLevel];
						key = key + "." + onLevel;
					}
				}
			}
			if (Object.prototype.hasOwnProperty.call(cols, key) && cols[key].type === "url") {
				console.log("fieed:::", cols[key]);
				//cols[key].typeAttributes.label.fieldName = cols[key].typeAttributes.label.fieldName + "URL";

				e[key + "URL"] = "/" + e.Id;
				//e[key + "URL"] = e[key];
			}
		}
	});
	return records;
};

export { configLocal, setPredefinedColumnJSON, formatData };
