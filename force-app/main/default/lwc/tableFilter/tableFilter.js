import { LightningElement } from 'lwc';
import fetchFilters from '@salesforce/apex/RelatedList.fetchFilters';
import getObjectFields from '@salesforce/apex/RelatedList.getObjectFields';
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
    openModal = false;
    operationList = [
        { label: 'equals', value: '=' },
        { label: 'not equal to', value: '!=' },
        { label: 'less than', value: '<' },
        { label: 'greater than', value: '>' },
        { label: 'less or equal', value: '<=' },
        { label: 'contain', value: 'contain' },
        { label: 'does not contain', value: 'not_contain' },
        { label: 'start with', value: 'start_with' },
        { label: 'end with', value: 'end_with' }
    ];
    connectedCallback() {
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
                console.log('sobject', data);
            })
            .catch((error) => {
                console.log('getObjectFields Error::', error);
            });
    }
    handleChange(event) {
        this.value = event.detail.value;
    }

    handleEdit = (index) => {
        this.openModal = true;
        console.log(operationList);
        //update listFilters filters key using operationList , open mockup and set UI values i.e fields, operator , value
        return listFilters[index];
    };
    handleAddCondition = () => {
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
