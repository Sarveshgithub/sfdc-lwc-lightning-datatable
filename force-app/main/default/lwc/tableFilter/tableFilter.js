import { LightningElement, track } from 'lwc';
import fetchFilters from '@salesforce/apex/RelatedList.fetchFilters';
import getObjectFields from '@salesforce/apex/RelatedList.getObjectFields';
import { mapOperatorType } from './helper';
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
    options;
    fields;
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
        console.log('this.fieldType', this.fieldType, this.fieldAPI);
    }
    handleChangeOperator(event) {
        console.log(event);
        this.operator = event.detail.value;
    }
    handleChangeFilter(event) {
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
        this.disableAdd = ![
            ...this.template.querySelectorAll('lightning-input')
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);
    }
    handleAddCondition = () => {
        let value = this.template.querySelector(
            '[data-element="filterVal"]'
        ).value;
        console.log('value', value);
        this.conditions.push({
            field: this.fieldAPI,
            operator: 'equals',
            value
        });
        //update filters and Condition__c
    };

    handleDelete = () => {
        //Delete filter using recordUpdateUI LDS ( no Apex)
    };
    handleSave = () => {
        //update filter Object using recordUpdateUI LDS ( no Apex)
    };
    handleAppleFilter = () => {
        // Apply filter - this will append where clause and do fetchRecords()
    };
    showHideModal() {
        this.openModal = !this.openModal;
        console.log('sfds', this.openModal);
    }
}
