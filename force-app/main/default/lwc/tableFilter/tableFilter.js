import { LightningElement, track, api } from 'lwc';
import fetchFilters from '@salesforce/apex/ListFilterController.fetchFilters';
import getObjectFields from '@salesforce/apex/ListFilterController.getObjectFields';
import insertFilter from '@salesforce/apex/ListFilterController.insertFilter';
import { mapOperatorType, formatCondition } from './helper';
import { updateRecord, deleteRecord } from 'lightning/uiRecordApi';
export default class TableFilter extends LightningElement {
    //Public variable
    @api objectName;
    @api cmpName;
    //Private variable
    @track options;
    @track fields;
    @track fieldSelected;
    mapOfFilters;
    mapOfFields;
    selectedFilterId;
    openModal = false;
    fieldType = 'text';
    filterName;
    fieldAPI;
    operator;
    @track conditions = [];
    operationList;
    disableAdd = true;
    connectedCallback() {
        this.getFilters();
        getObjectFields({ objName: this.objectName })
            .then((data) => {
                const fieldJSON = {};
                // console.log('data::::')
                console.log('data-fields', data);
                for (const [key, value] of Object.entries(data)) {
                    fieldJSON[value[0]] = {
                        label: key,
                        value: value[0] + '>' + value[1]
                    };
                }
                this.fields = Object.values(fieldJSON);
                this.mapOfFields = fieldJSON;
                console.log(
                    'fields::',
                    fieldJSON,
                    this.fields,
                    this.mapOfFields
                );
            })
            .catch((error) => {
                console.log('getObjectFields Error::', error);
            });
    }
    getFilters() {
        console.log('sfsdfsdfsdf');
        fetchFilters({ cmpName: this.cmpName })
            .then((data) => {
                let copyData = data;
                this.mapOfFilters = data;
                console.log('this.mapOfFilters', this.mapOfFilters);
                let filters = Object.values(copyData);
                for (let i = 0; i < filters.length; i++) {
                    filters[i].label = filters[i].Name;
                    filters[i].value = filters[i].Id;
                }
                this.options = filters;
                console.log('sfdsfdsfs', this.options);
            })
            .catch((error) => {
                console.log('error::', error);
            });
    }
    handleChangeField(event) {
        this.disableAdd = false;
        console.log(event);
        let value = event.detail.value;
        const { type, operator } = mapOperatorType(value.split('>')[1]);
        console.log(
            '----',
            mapOperatorType(value.split('>')[1]),
            value.split('>')[1]
        );
        this.fieldType = type;
        this.operationList = operator;
        this.fieldAPI = value.split('>')[0];
        this.fieldSelected = value;
        console.log('this.fieldType', this.fieldType, this.fieldAPI);
    }
    handleChangeOperator(event) {
        console.log(event);
        this.operator = event.detail.value;
    }
    handleChangeFilter(event) {
        this.selectedFilterId = event.detail.value;
        this.filterName = this.options.find(
            (opt) => opt.value === event.detail.value
        ).label;
        if (this.mapOfFilters[this.selectedFilterId].Condition_JSON__c) {
            this.conditions = JSON.parse(
                this.mapOfFilters[this.selectedFilterId].Condition_JSON__c
            );
        }
    }
    handleEdit = () => {
        this.openModal = true;
    };
    handleNewFilter() {
        this.openModal = true;
    }
    handleDelete() {
        if (this.selectedFilterId) {
            deleteRecord(this.selectedFilterId)
                .then((response) => {
                    this.selectedFilterId = null;
                    this.getFilters();
                    console.log(response);
                })
                .catch((error) => {
                    console.log('error::', error);
                });
        }
    }
    handleChangeValue(event) {
        this.fieldValue = event.detail.value;
        console.log('value', this.fieldValue, event);
    }
    handleAddCondition = () => {
        //debugger;
        if (!this.validation()) {
            console.log(this.validation());
            return;
        }

        let value = this.template.querySelector('[data-element="filterVal"]')[
            this.fieldType === 'checkbox' ? 'checked' : 'value'
        ];
        let fieldVal = this.template.querySelector(
            '[data-element="objField"]'
        ).value;
        let operator = this.template.querySelector(
            '[data-element="operator"]'
        ).value;
        console.log('value', value, fieldVal, operator);
        let operatorLabel = this.operationList.find(
                (opt) => opt.value === operator
            ).label,
            label = this.mapOfFields[this.fieldAPI].label;
        this.conditions.push({
            field: this.fieldAPI,
            operator,
            value,
            type: this.fieldType,
            label,
            operatorLabel
        });
        let f = this.fields;
        for (let i = 0; i < f.length; i++) {
            if (f[i].value === fieldVal) {
                f.splice(i, 1);
                break;
            }
        }
        this.fields = [...f];
        this.disableAdd = true;
        //update filters and Condition__c
    };

    handleSave = () => {
        let condition = [];
        this.conditions.forEach((val) => {
            condition.push(formatCondition(val));
        });
        condition = condition.join(' AND ');
        console.log('conditionLLL', condition);
        let fields = {};
        fields.Name = this.template.querySelector(
            '[data-element="objFilterName"]'
        ).value;
        fields.Condition__c = condition;
        fields.Condition_JSON__c = JSON.stringify(this.conditions);
        console.log('record::', fields);
        if (this.selectedFilterId) {
            fields.Id = this.selectedFilterId;
            this.updateFilter(fields);
        } else {
            fields.Screen_Name__c = 'data';
            this.insertFilter(fields);
        }
    };
    handleAppleFilter = () => {
        // Apply filter - this will append where clause and do fetchRecords()
    };
    showHideModal() {
        this.openModal = !this.openModal;
        console.log('sfds', this.openModal);
    }

    validation() {
        return [...this.template.querySelectorAll('lightning-input')].reduce(
            (validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            },
            true
        );
    }

    insertFilter(obj) {
        insertFilter({ objFilter: obj })
            .then((response) => {
                console.log(response);
                this.fireEvent(response.Condition__c);
            })
            .catch((error) => {
                console.log('error', error);
            });
    }

    updateFilter(fields) {
        updateRecord({ fields })
            .then((res) => {
                console.log(res);
                this.fireEvent(res.fields.Condition__c.value);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    fireEvent(res) {
        const selectEvent = new CustomEvent('filterevent', {
            detail: res
        });
        this.dispatchEvent(selectEvent);
        this.showHideModal();
    }
}
