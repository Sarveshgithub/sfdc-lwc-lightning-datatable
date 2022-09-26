import { LightningElement } from 'lwc';
import fetchFilters from '@salesforce/apex/RelatedList.fetchFilters';
const operationList = [
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
    connectedCallback() {
        fetchFilters({ cmpName: 'data' })
            .then((data) => {
                console.log('data::', data);
            })
            .catch((error) => {
                console.log('error::', error);
            });
        console.log('testsss');
    }
    value = 'inProgress';

    get options() {
        return [
            { label: 'New', value: 'new' },
            { label: 'In Progress', value: 'inProgress' },
            { label: 'Finished', value: 'finished' }
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }
    handleEdit = (index) => {
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
}
