/*
 * Author : Sarvesh
 * Description : The component to show records of custom/standard of Object as a table.
 * Production Ready : Yes
 */
import { LightningElement, wire, track, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { deleteRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getRecords from "@salesforce/apex/RelatedList.getRecords";
import countRecords from "@salesforce/apex/RelatedList.countRecords";

let cols;
const actions = [
  { label: "Show details", name: "show_details" },
  { label: "Edit", name: "edit" },
  { label: "Delete", name: "delete" },
];
export default class LightningDatatable extends NavigationMixin(
  LightningElement
) {
  // Public Property
  @api recordId;
  @api iconName;
  @api title;
  @api objectName;
  @api columns;
  @api relatedFieldAPI;
  @api whereClause;
  @api limit = 10;
  // Private Property
  @track data;
  @track soql;
  @track offSet = 0;
  @track totalRows = 0;
  @track error;

  // Do init funtion
  connectedCallback() {
    if (this.columns != null && this.columns != undefined) {
      cols = JSON.parse(this.columns);
    }
    cols.push({
      type: "action",
      typeAttributes: { rowActions: actions },
    });
    this.columns = cols;
    this.buildSOQL();
    countRecords({ objectName: this.objectName }).then((result) => {
      this.totalRows = result;
    });
    this.fetchRecords();
  }

  fetchRecords() {
    getRecords({ soql: this.soql })
      .then((data) => {
        if (data) {
          data.map((e) => {
            for (let key in e) {
              if (typeof e[key] === "object") {
                for (let onLevel in e[key]) {
                  e[key + "." + onLevel] = e[key][onLevel];
                }
              }
            }
          });
          this.data = data;
        }
      })
      .catch((error) => {
        if (error) {
          this.error = "Unknown error";
          if (Array.isArray(error.body)) {
            this.error = error.body.map((e) => e.message).join(", ");
          } else if (typeof error.body.message === "string") {
            this.error = error.body.message;
          }
          console.log("error", this.error);
        }
      });
  }

  newRecord() {
    this[NavigationMixin.Navigate]({
      type: "standard__objectPage",
      attributes: {
        objectApiName: this.objectName,
        actionName: "new",
      },
    });
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

  //Next button to get the next data
  next(event) {
    this.offSet = this.offSet + this.limit;
    this.buildSOQL();
    this.fetchRecords();
  }

  //Previous button to get the previous data
  previous(event) {
    this.offSet = this.offSet - this.limit;
    this.buildSOQL();
    this.fetchRecords();
  }

  firstPage(event) {
    this.offSet = 0;
    this.buildSOQL();
    this.fetchRecords();
  }

  lastPage(event) {
    this.offSet = Math.floor(this.totalRows / this.limit) * this.limit;
    this.buildSOQL();
    this.fetchRecords();
  }

  get isDisablePrev() {
    return this.offSet == 0 ? true : false;
  }

  get isDisableNext() {
    return this.offSet + this.limit >= this.totalRows
      ? true
      : this.totalRows <= this.limit
      ? false
      : false;
  }

  /*********************************************************************
   * All Helper Method's
   *********************************************************************/
  deleteRow(row) {
    let id = row["Id"],
      index = this.findRowIndexById(id);
    console.log(index);
    if (index !== -1) {
      deleteRecord(id)
        .then(() => {
          this.data = this.data
            .slice(0, index)
            .concat(this.data.slice(index + 1));
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
        recordId: row["Id"],
        objectApiName: this.objectName,
        actionName: "view",
      },
    });
  }

  editRecord(row) {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: row["Id"],
        objectApiName: this.objectName,
        actionName: "edit",
      },
    });
  }

  //Generic function to build soql
  buildSOQL() {
    let soql = this.appendField();
    soql += this.appendWhere();
    soql += this.appendLimit();
    soql += this.appendOffset();
    this.soql = soql;
  }

  appendField() {
    let soql = "SELECT Id,",
      col = [];
    if (cols) {
      cols.map((val) => {
        if (val.hasOwnProperty("fieldName")) {
          col.push(val["fieldName"]);
        }
      });
      soql = soql + `${col.join(",")} FROM ${this.objectName}`;
    }
    return soql;
  }

  appendWhere() {
    let where = " WHERE ";
    if (this.relatedFieldAPI)
      where += `${this.relatedFieldAPI} = '${this.recordId}'`;
    if (this.whereClause && this.relatedFieldAPI)
      where += ` AND ${this.whereClause}`;
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
        variant: variant,
      })
    );
  }
}