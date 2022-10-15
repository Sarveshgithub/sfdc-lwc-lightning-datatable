import { LightningElement, track } from 'lwc';
import fetchFilters from '@salesforce/apex/RelatedList.fetchFilters';
import getObjectFields from '@salesforce/apex/RelatedList.getObjectFields';
import { mapOperatorType } from './helper';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import { updateRecord } from 'lightning/uiRecordApi';
//getObjectFields
const listFilters = [
    {
        Name: 'sdf',
        Public__c: true,
        Screen_Name__c: 'test',
        Condition__c: 'Name = sdfdsf',
        filters: [],
        CreatedById: 'Id',
        Id: 'test'
    }
];
export default class TableFilter extends LightningElement {
    //Public variable
    //Private variable
    @track options;
    @track fields;
    @track fieldSelected;
    mapOfFilters;
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
        console.log('sfsdfsdfsdf');
        fetchFilters({ cmpName: 'data' })
            .then((data) => {
                let copyData = JSON.parse(JSON.stringify(data));
                this.mapOfFilters = copyData;
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

        getObjectFields({ objName: 'Contact' })
            .then((data) => {
                const fields = [];
                // console.log('data::::')
                console.log('data-fields', data);
                for (const [key, value] of Object.entries(data)) {
                    fields.push({
                        label: key,
                        value: value[0] + '>' + value[1]
                    });
                }
                this.fields = fields;
                console.log('fields::', fields);
            })
            .catch((error) => {
                console.log('getObjectFields Error::', error);
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
        //this.filterName = event.detail.label;
    }
    handleEdit = (index) => {
        this.openModal = true;
        //update listFilters filters key using operationList , open mockup and set UI values i.e fields, operator , value
        return listFilters[index];
    };
    handleNewFilter(event) {
        console.log('event:::', event);
        this.openModal = true;
    }
    handleChangeValue(event) {
        this.fieldValue = event.detail.value;
        console.log('value', this.fieldValue, event);
    }
    handleAddCondition = () => {
        if (!this.validation()) {
            console.log(this.validation());
            return;
        }
        //debugger;
        let value = this.template.querySelector(
            '[data-element="filterVal"]'
        ).value;
        let fieldVal = this.template.querySelector(
            '[data-element="objField"]'
        ).value;
        let operator = this.template.querySelector(
            '[data-element="operator"]'
        ).value;
        console.log('value', value, fieldVal, operator);
        this.conditions.push({
            field: this.fieldAPI,
            operator,
            value
        });
        let f = this.fields;
        for (let i = 0; i < f.length; i++) {
            if (f[i].value === fieldVal) {
                f.splice(i, 1);
                // f[i].disable = true;
                break;
            }
        }
        this.fields = [...f];

        console.log('his.fields', this.conditions, NAME_FIELD);
        this.disableAdd = true;
        //update filters and Condition__c
    };

    handleDelete = () => {
        //Delete filter using recordUpdateUI LDS ( no Apex)
    };
    handleSave = () => {
        let condition = [];
        this.conditions.forEach((val) => {
            condition.push(`( ${val.field} ${val.operator} ${val.value} )`);
        });
        condition = condition.join(' AND ');
        console.log(condition);
        console.log('selected', this.mapOfFilters[this.selectedFilterId]);
        //update filter Object using recordUpdateUI LDS ( no Apex)
        updateRecord(this.mapOfFilters[this.selectedFilterId])
            .then((record) => {
                console.log(record);
            })
            .catch((error) => {
                console.log(error);
            });
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
}
