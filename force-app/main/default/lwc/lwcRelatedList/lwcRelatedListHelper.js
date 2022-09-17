const configLocal = (cmp, local) => {
	if (local) {
		// cmp.iconName = "standard:account";
		// cmp.recordId = "recid";
		// cmp.relatedFieldAPI = "AccountId";
		// cmp.whereClause;
		cmp.title = "Contacts";
		cmp.fields = "FirstName,LastName,AccountId,CreatedDate,Account.Name";
		cmp.objectName = "Contact";
		cmp.limit = 5;
		cmp.isCounterDisplayed = true;
		cmp.actionButtons = '[{"name": "New","label": "New","variant": "neutral"}]';
		cmp.showCheckboxes = true;
		cmp.showViewAll = false;
		cmp.hasPagination = true;
		cmp.hasSearchBar = true;
		cmp.predefinedCol =
			'{"Account.Name":{"label":"Account Name","type":"url","typeAttributes":{"label": { "fieldName": "Account.Name" ,"recId": "AccountId"}}},"AccountId":{"label":"Ac Id","type":"Id"}}';
	}
};
//Prepare Col JSON with predefined data
const setPredefinedColumnJSON = (cmp) => {
	if (cmp.fields.includes(".") && !cmp.predefinedCol) {
		cmp.error = "You have not configured related field defination.";
		throw new Error("error");
	}
	const predefinedCol = JSON.parse(cmp.predefinedCol);
	cmp.predefinedCol = predefinedCol;
	const setPredefinedCol = {};
	cmp.fields.split(",").forEach((element) => {
		element = element.trim();
		if (Object.prototype.hasOwnProperty.call(predefinedCol, element)) {
			if (
				predefinedCol[element].type === "url" &&
				Object.prototype.hasOwnProperty.call(predefinedCol[element], "typeAttributes")
			) {
				//because LWC datatable property for redirect ( so need to create different key)
				setPredefinedCol[element] = { ...predefinedCol[element], fieldName: element + "_url" };
			} else {
				setPredefinedCol[element] = { ...predefinedCol[element], fieldName: element };
			}
		} else {
			setPredefinedCol[element] = { fieldName: element };
		}
	});
	cmp.colsJson = setPredefinedCol;
};

//Helper function for formatData()
const _formatData = (cols, records) => {
	records.forEach((e) => {
		// eslint-disable-next-line guard-for-in
		for (let key in e) {
			if (typeof e[key] === "object") {
				for (let onLevel in e[key]) {
					if (Object.prototype.hasOwnProperty.call(e[key], onLevel)) {
						e[key + "." + onLevel] = e[key][onLevel];
						key = key + "." + onLevel;
					}
				}
			}
			if (
				Object.prototype.hasOwnProperty.call(cols, key) &&
				cols[key].type === "url" &&
				Object.prototype.hasOwnProperty.call(cols[key], "typeAttributes")
			) {
				e[key + "_url"] = "/" + e[cols[key].typeAttributes.label.recId];
			}
		}
	});
	return records;
};

/**
 *
 * @param {*} cmp
 * @param {*} data
 * @returns wrapper of records
 * Purpose:
 * 1. Check  Columns Property  against predefined values (setPredefinedCol)
 * 2. Update records key for Redirect Link
 */
const formatData = (cmp, data) => {
	let { records, cols } = data;
	Object.keys(cols).forEach((e) => {
		if (
			Object.prototype.hasOwnProperty.call(cmp.predefinedCol, e) &&
			Object.prototype.hasOwnProperty.call(cmp.predefinedCol[e], "typeAttributes")
		) {
			cols[e].typeAttributes = cmp.predefinedCol[e].typeAttributes;
		}
	});
	records = _formatData(cols, records);
	return { records, cols, ...data };
};

export { configLocal, setPredefinedColumnJSON, formatData, _formatData };
