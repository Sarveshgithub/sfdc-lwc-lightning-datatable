/* eslint-disable @lwc/lwc/no-api-reassignments */
/*
 * Author : Sarvesh
 * Description : The component to show records of custom/standard of Object as a table.
 * Production Ready : Yes
 */
import { LightningElement, track, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { deleteRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getRecords from "@salesforce/apex/RelatedList.getRecords";
import buildFieldJSON from "@salesforce/apex/RelatedList.buildFieldJSON";
import { updateRecord } from "lightning/uiRecordApi";
import { configLocal } from "./lwcRelatedListHelper";
const actions = [
	{ label: "Show details", name: "show_details" },
	{ label: "Edit", name: "edit" },
	{ label: "Delete", name: "delete" }
];

export default class LightningDatatable extends NavigationMixin(LightningElement) {
	// Public Property
	@api recordId;
	@api iconName;
	@api title;
	@api objectName;
	@api fields;
	@api labelsOverride;
	@api relatedFieldAPI;
	@api whereClause;
	@api limit;
	@api isCounterDisplayed;
	@api actionButtons; //buttons for the list
	@api showCheckboxes;
	@api showViewAll;
	@api hasPagination;
	// Private Property
	@track data;
	@track soql;
	@track offSet = 0;
	@track totalRows = 0;
	@track error;
	@track selectedRows;
	@track initialLimit;
	@track showCollapse = false;
	@track sortBy;
	@track sortDirection;
	@track columns;
	draftValues = [];

	// Do init funtion
	connectedCallback() {
		//This function can used for local development config, pass 'true' for config
		configLocal(this, false);
		if (this.actionButtons && this.actionButtons !== undefined) {
			this.actionButtons = JSON.parse(this.actionButtons);
		}
		this.initialLimit = this.limit;
		this.buildSOQL();
		this.init();
	}

	init() {
		buildFieldJSON({
			soql: this.soql,
			fields: this.fields,
			objectName: this.objectName,
			whereClause: this.appendWhere()
		})
			.then((data) => {
				if (data) {
					this.data = data.records;
					if(this.labelsOverride) {
						this.initLabelsOverride(data);
					}
					this.iconName = this.iconName ? this.iconName : data.iconName;
					data.cols.push({
						type: "action",
						typeAttributes: { rowActions: actions }
					});
					this.columns = data.cols;
					this.totalRows = data.count;
				}
			})
			.catch((error) => {
				if (error) {
					this.formatError(error);
				}
			});
	}

	initLabelsOverride(data) {
		let columns = JSON.parse(JSON.stringify(data.cols) );

		let allLabelOverride = null;
		if(this.labelsOverride.includes(',') ) {
			allLabelOverride = this.labelsOverride.split(',');
		} else if(this.labelsOverride.includes('=')) {
			allLabelOverride = [this.labelsOverride];
		}
		
		if(allLabelOverride) {
			allLabelOverride.forEach(override => {
				const elements = override.split('=');
				if(elements) {
					const apiName = elements[0];
					const newLabel = elements[1];
				
					columns.forEach(column => {
						if(column.fieldName === apiName) {
							column.label = newLabel;
						}
					});
				}
			});
		}

		data.cols = columns;
	}

	fetchRecords() {
		getRecords({ soql: this.soql })
			.then((data) => {
				if (data) {
					let records = data;
					records.forEach((e) => {
						for (let key in e) {
							if (typeof e[key] === "object") {
								for (let onLevel in e[key]) {
									if (Object.prototype.hasOwnProperty.call(e[key], onLevel)) {
										e[key + "." + onLevel] = e[key][onLevel];
									}
								}
							}
						}
					});
					this.data = records;
				}
			})
			.catch((error) => {
				if (error) {
					this.formatError(error);
				}
			});
	}

	handleSave(event) {
		const recordInputs = event.detail.draftValues.slice().map((draft) => {
			const fields = Object.assign({}, draft);
			return { fields };
		});
		const promises = recordInputs.map((recordInput) => updateRecord(recordInput));
		Promise.all(promises)
			.then(() => {
				this.showToast("Success", "Record Updated", "success");
				this.draftValues = [];
				this.showRowDetails({ Id: this.recordId });
			})
			.catch((error) => {
				if (error) {
					this.formatError(error);
				}
			});
	}

	formatError(error) {
		if (error) {
			this.error = "Unknown error";
			if (Array.isArray(error.body)) {
				this.error = error.body.map((e) => e.message).join(", ");
			} else if (typeof error.body.message === "string") {
				this.error = error.body.message;
			}
		}
	}

	handleRowAction(event) {
		const actionName = event.detail.action.name;
		const row = event.detail.row;
		switch (actionName) {
			case "edit":
				this.editRecord(row);
				break;
			case "delete":
				this.deleteRow(row);
				break;
			case "show_details":
				this.showRowDetails(row);
				break;
			default:
		}
	}

	handleButtonAction(event) {
		//call desired javacript method or apex call, or throw an event based on the button key(new, delete-selected...)
		//if button has needSelectedRows set to true, have selected rows using this.selectedRows
		const buttonLabel = event.target.dataset.name;
		switch (buttonLabel) {
			case "New":
				this.newRecord();
				break;
			/*
      case "delete-selected":
        const eventDeleteSelected = new CustomEvent('deleteselected', { detail: JSON.stringify(this.selectedRows) });
        this.dispatchEvent(eventDeleteSelected);
        break;*/
			default:
		}
	}

	//Next button to get the next data
	next() {
		this.offSet = this.offSet + this.limit;
		this.buildSOQL();
		this.fetchRecords();
	}

	//Previous button to get the previous data
	previous() {
		this.offSet = this.offSet - this.limit;
		this.buildSOQL();
		this.fetchRecords();
	}

	firstPage() {
		this.offSet = 0;
		this.buildSOQL();
		this.fetchRecords();
	}

	lastPage() {
		this.offSet = Math.floor(this.totalRows / this.limit) * this.limit;
		this.buildSOQL();
		this.fetchRecords();
	}

	get isDisablePrev() {
		return this.offSet === 0 || this.totalRows === 0 ? true : false;
	}

	get isDisableNext() {
		return this.offSet + (this.hasPagination ? (this.limit > 10 ? this.limit : 10) : this.limit) >=
			this.totalRows || this.totalRows === 0
			? true
			: this.totalRows <= this.limit
			? false
			: false;
	}

	/*********************************************************************
	 * All Helper Method's
	 *********************************************************************/
	newRecord() {
		this[NavigationMixin.Navigate]({
			type: "standard__objectPage",
			attributes: {
				objectApiName: this.objectName,
				actionName: "new"
			}
		});
	}

	deleteRow(row) {
		let id = row.Id,
			index = this.findRowIndexById(id);
		if (index !== -1) {
			deleteRecord(id)
				.then(() => {
					this.data = this.data.slice(0, index).concat(this.data.slice(index + 1));
					this.showToast("Success", "Record deleted", "success");
				})
				.catch((error) => {
					this.showToast("Error deleting record", error.body.message, "error");
				});
		}
	}

	findRowIndexById(id) {
		let ret = -1;
		this.data.some((row, index) => {
			if (row.Id === id) {
				ret = index;
				return true;
			}
			return false;
		});
		return ret;
	}

	showRowDetails(row) {
		this[NavigationMixin.Navigate]({
			type: "standard__recordPage",
			attributes: {
				recordId: row.Id,
				objectApiName: this.objectName,
				actionName: "view"
			}
		});
	}

	editRecord(row) {
		this[NavigationMixin.Navigate]({
			type: "standard__recordPage",
			attributes: {
				recordId: row.Id,
				objectApiName: this.objectName,
				actionName: "edit"
			}
		});
	}

	//Generic function to build soql
	buildSOQL() {
		let soql;
		if (this.fields) soql = this.appendField();
		soql += this.appendWhere();
		soql += " WITH SECURITY_ENFORCED ";
		if (this.sortBy && this.sortDirection) soql += ` ORDER BY ${this.sortBy} ${this.sortDirection} `;
		if (this.limit && this.limit > 0) {
			soql += this.appendLimit();
			soql += this.appendOffset();
		}

		this.soql = soql;
	}

	appendField() {
		let soql = `SELECT Id, ${this.fields} FROM ${this.objectName}`;
		return soql;
	}

	appendWhere() {
		let where = " WHERE ";
		if (this.relatedFieldAPI) where += `${this.relatedFieldAPI} = '${this.recordId}'`;
		if (this.whereClause && this.relatedFieldAPI) where += ` AND ${this.whereClause}`;
		else if (this.whereClause) where += `${this.whereClause}`;
		return where === " WHERE " ? "" : where;
	}

	appendLimit() {
		return ` LIMIT ${this.limit}`;
	}

	appendOffset() {
		return ` OFFSET ${this.offSet}`;
	}

	showToast(title, message, variant) {
		this.dispatchEvent(
			new ShowToastEvent({
				title: title,
				message: message,
				variant: variant
			})
		);
	}

	get titleFormatted() {
		return this.isCounterDisplayed ? this.title + ` (${this.totalRows})` : this.title;
	}

	handleRowSelection(event) {
		this.selectedRows = JSON.parse(JSON.stringify(event.detail.selectedRows));
	}

	get hasToShowViewAll() {
		return this.limit < this.totalRows && this.limit > 0 && this.showViewAll;
	}

	showAllRecords() {
		this.limit = 0;
		this.buildSOQL();
		this.fetchRecords();
		this.showViewAll = false;
		this.showCollapse = true;
	}

	showInitialRecordsWithLimit() {
		this.limit = this.initialLimit;
		this.showViewAll = true;
		this.showCollapse = false;
		this.buildSOQL();
		this.fetchRecords();
	}
	handleSort(event) {
		this.sortBy = event.detail.fieldName;
		this.sortDirection = event.detail.sortDirection;
		this.buildSOQL();
		this.fetchRecords();
	}
}