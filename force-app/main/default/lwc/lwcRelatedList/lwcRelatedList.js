/* eslint-disable @lwc/lwc/no-api-reassignments */
/*
 * Author : Sarvesh
 * Description : The component to show records of custom/standard of Object as a table.
 * Production Ready : Yes
 */
import { LightningElement, track, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getRecords from '@salesforce/apex/RelatedList.getRecords';
import onSearch from '@salesforce/apex/RelatedList.onSearch';
import buildFieldJSON from '@salesforce/apex/RelatedList.buildFieldJSON';
import { updateRecord } from 'lightning/uiRecordApi';
import {
    configLocal,
    setPredefinedColumnJSON,
    formatData,
    _formatData
} from './lwcRelatedListHelper';
import recordUpdatedSuccessMessage from '@salesforce/label/c.recordUpdatedSuccessMessage';
import recordDeletedSuccessMessage from '@salesforce/label/c.recordDeletedSuccessMessage';
const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' }
];

export default class LwcDatatable extends NavigationMixin(LightningElement) {
    // Public Property
    @api recordId;
    @api iconName;
    @api title;
    @api objectName;
    @api fields;
    @api relatedFieldAPI;
    @api formulaImageFields;
    @api whereClause;
    @api limit;
    @api isCounterDisplayed;
    @api actionButtons; //buttons for the list
    @api showCheckboxes;
    @api showViewAll;
    @api hasPagination;
    @api predefinedCol = '';
    @api hasSearchBar;
    @api orderBy;
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
    @track sortDirection = 'asc';
    @track columns;
    @track colsJson;
    @track searchTerm;

    draftValuesCustomDatatypes = [];
    labels = {
        recordUpdatedSuccessMessage,
        recordDeletedSuccessMessage
    };

    // Do init funtion
    connectedCallback() {
        //This function can used for local development config, pass 'true' for config
        configLocal(this, false);
        setPredefinedColumnJSON(this);
        if (this.actionButtons) {
            this.actionButtons = JSON.parse(this.actionButtons);
        }
        if (this.formulaImageFields) {
            this.formulaImageFields = JSON.parse(this.formulaImageFields);
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
                    const { records, cols, count, iconName } = formatData(
                        this,
                        data
                    );
                    this.colsJson = cols;
                    const colAc = Object.values(cols);
                    colAc.push({
                        type: 'action',
                        typeAttributes: { rowActions: actions }
                    });

                    this.columns = colAc;
                    this.data = records;
                    this.iconName = this.iconName ? this.iconName : iconName;
                    this.totalRows = count;

                    this.checkFormulaImageFields();
                }
            })
            .catch((error) => {
                if (error) {
                    this.formatError(error);
                }
            });
    }

    // Formula fields with images (e.g. traffic lights) are of type 'string'
    // Change the type to 'image' to use custom data type to correctly display actual images
    checkFormulaImageFields() {
        if (this.formulaImageFields) {
            this.columns.forEach((col) => {
                if (this.formulaImageFields.indexOf(col.fieldName) != -1) {
                    col.type = 'image';
                }
            });
        }
    }

    customTypeChanged(event) {
        event.stopPropagation();
        let dataReceived = event.detail.data;
        this.updateDraftValues(
            {
                Id: dataReceived.context,
                [dataReceived.fieldName]: dataReceived.value
            },
            dataReceived.fieldName
        );
    }

    updateDraftValues(updateItem, fieldName) {
        let draftValueChanged = false;
        let copyDraftValues = [...this.draftValuesCustomDatatypes];
        //store changed value to do operations
        //on save. This will enable inline editing &
        //show standard cancel & save button
        copyDraftValues.forEach((item) => {
            if (item.Id === updateItem.Id) {
                item[fieldName] = updateItem[fieldName];

                draftValueChanged = true;
            }
        });

        if (draftValueChanged) {
            this.draftValuesCustomDatatypes = [...copyDraftValues];
        } else {
            this.draftValuesCustomDatatypes = [...copyDraftValues, updateItem];
        }
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
        const mergedValues = [...event.detail.draftValues, ...this.draftValuesCustomDatatypes].reduce((merged, current) => {
            let found = merged.find(val => val.Id === current.Id);
            if(found) {
                // merge the current object with the existing object
                Object.assign(found, current);
            } else {
                // add the current object to the merged object
                merged.push(current);
            }
            return merged;
        }, []);        
        

        const recordInputs = mergedValues.slice().map((draft) => {
            const fields = Object.assign({}, draft);
            return { fields };
        });

        const promises = recordInputs.map((recordInput) =>
            updateRecord(recordInput)
        );
        Promise.all(promises)
            .then(() => {
                this.showToast(
                    'Success',
                    this.labels.recordUpdatedSuccessMessage,
                    'success'
                );
                this.draftValuesCustomDatatypes = [];
                this.fetchRecords();
            })
            .catch((error) => {
                if (error) {
                    this.formatError(error);
                }
            });
    }

    formatError(error) {
        if (error) {
            this.error = 'Unknown error';
            if (Array.isArray(error.body)) {
                this.error = error.body.map((e) => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                this.error = error.body.message;
            }
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'edit':
                this.editRecord(row);
                break;
            case 'delete':
                this.deleteRow(row);
                break;
            case 'show_details':
                this.showRowDetails(row);
                break;
            default:
        }
    }

    handleButtonAction(event) {
        //call desired javacript method or apex call, or throw an event based on the button key(new, delete-selected...)
        //you have selected rows in this.selectedRows
        const buttonLabel = event.target.dataset.name;
        switch (buttonLabel) {
            case 'New':
                this.newRecord();
                break;
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
        this.offSet = this.totalRows - this.limit;
        this.buildSOQL();
        this.fetchRecords();
    }

    get isDisablePrev() {
        return this.offSet === 0 || (this.totalRows === 0) | this.searchTerm
            ? true
            : false;
    }

    get isDisableNext() {
        return this.offSet + this.limit >= this.totalRows ||
            this.totalRows === 0 ||
            this.searchTerm ||
            !this.limit
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
            type: 'standard__objectPage',
            attributes: {
                objectApiName: this.objectName,
                actionName: 'new'
            },
            state: {
                useRecordTypeCheck: 1
            }
        });
    }

    deleteRow(row) {
        let id = row.Id,
            index = this.findRowIndexById(id);
        if (index !== -1) {
            deleteRecord(id)
                .then(() => {
                    this.data = this.data
                        .slice(0, index)
                        .concat(this.data.slice(index + 1));
                    this.showToast(
                        'Success',
                        this.labels.recordDeletedSuccessMessage,
                        'success'
                    );
                })
                .catch((error) => {
                    this.showToast(
                        'Error deleting record',
                        error.body.message,
                        'error'
                    );
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
            type: 'standard__recordPage',
            attributes: {
                recordId: row.Id,
                objectApiName: this.objectName,
                actionName: 'view'
            }
        });
    }

    editRecord(row) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: row.Id,
                objectApiName: this.objectName,
                actionName: 'edit'
            }
        });
    }

    //Generic function to build soql
    buildSOQL() {
        let soql;
        if (this.fields) soql = this.appendField();
        soql += this.appendWhere();
        soql += ' WITH SECURITY_ENFORCED ';

        //if we filter on a column then we ignore the ORDER BY defined in the configuration
        if (this.orderBy && !this.sortBy) {
            soql += ` ORDER BY ${this.orderBy}`;
        } else if (this.sortBy && this.sortDirection) {
            soql += ` ORDER BY ${this.sortBy} ${this.sortDirection} `;
        }

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
        let where = ' WHERE ';
        if (this.relatedFieldAPI)
            where += `${this.relatedFieldAPI} = '${this.recordId}'`;
        if (this.whereClause && this.relatedFieldAPI)
            where += ` AND ${this.whereClause}`;
        else if (this.whereClause) where += `${this.whereClause}`;
        return where === ' WHERE ' ? '' : where;
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
        return this.isCounterDisplayed
            ? this.title + ` (${this.totalRows})`
            : this.title;
    }

    handleRowSelection(event) {
        this.selectedRows = JSON.parse(
            JSON.stringify(event.detail.selectedRows)
        );
    }

    get hasToShowViewAll() {
        return (
            this.limit < this.totalRows && this.limit > 0 && this.showViewAll
        );
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
        if (this.searchTerm) {
            return;
        }
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.buildSOQL();
        this.fetchRecords();
    }

    onSearchChange(event) {
        this.searchTerm = event.target.value;
        if (!this.searchTerm || this.searchTerm === '') {
            this.fetchRecords();
        }

        //minimum two caracters required to search
        if (this.searchTerm && this.searchTerm.length > 1) {
            onSearch({
                searchTerm: this.searchTerm,
                objectApiName: this.objectName,
                searchFields: this.fields,
                whereClause: this.whereClause
            })
                .then((data) => {
                    this.data = _formatData(this.colsJson, data);
                })
                .catch((error) => {
                    this.showToast(
                        'Error on search ',
                        error.body.message,
                        'error'
                    );
                });
        }
    }
}