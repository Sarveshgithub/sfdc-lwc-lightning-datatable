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
import onSearch from "@salesforce/apex/RelatedList.onSearch";
import buildFieldJSON from "@salesforce/apex/RelatedList.buildFieldJSON";
import { updateRecord } from "lightning/uiRecordApi";
import { configLocal, setPredefinedColumnJSON, formatData, _formatData } from "./lwcRelatedListHelper";
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
	@api relatedFieldAPI;
	@api whereClause;
	@api limit;
	@api isCounterDisplayed;
	@api actionButtons; //buttons for the list
	@api showCheckboxes;
	@api showViewAll;
	@api hasPagination;
	@api predefinedCol = "";
	@api hasSearchBar;
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
	@track colsJson;
	@track searchTerm;
	draftValues = [];

	// Do init funtion
	connectedCallback() {
		//This function can used for local development config, pass 'true' for config
		configLocal(this, false);
		setPredefinedColumnJSON(this);
		if (this.actionButtons) {
			this.actionButtons = JSON.parse(this.actionButtons);
		}
		this.initialLimit = this.limit;
		this.buildSOQL();
		this.init();
	}

	init() {
		buildFieldJSON({
			soql: this.soql,
			objectName: this.objectName,
			whereClause: this.appendWhere(),
			colsJson: JSON.stringify(this.colsJson)
		})
			.then((data) => {
				if (data) {
					//console.log("return data:::", data);
					const { records, cols, count, iconName } = formatData(this, data);
					this.colsJson = cols;
					const colAc = Object.values(cols);
					colAc.push({
						type: "action",
						typeAttributes: { rowActions: actions }
					});
					this.columns = colAc;
					this.data = records;
					this.iconName = this.iconName ? this.iconName : iconName;
					this.totalRows = count;
				}
			})
			.catch((error) => {
				if (error) {
					this.formatError(error);
				}
			});
	}

	fetchRecords() {
		getRecords({ soql: this.soql })
			.then((data) => {
				if (data) {
					this.data = _formatData(this.colsJson, data);
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

	onSearchChange(event) {
		this.searchTerm = event.detail.value;
		if (!this.searchTerm || this.searchTerm === "") {
			this.fetchRecords();
		}

		//minimum two caracters required to search
		if (this.searchTerm && this.searchTerm.length > 1) {
			onSearch({ searchTerm: this.searchTerm, objectApiName: this.objectName, searchFields: this.fields })
				.then((data) => {
					this.data = _formatData(this.colsJson, data);
				})
				.catch((error) => {
					this.showToast("Error on search ", error.body.message, "error");
				});
		}
	}
}
