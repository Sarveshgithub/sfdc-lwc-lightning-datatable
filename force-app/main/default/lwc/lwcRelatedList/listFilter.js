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
const handleEdit = (index) => {
    console.log(operationList);
    //update listFilters filters key using operationList , open mockup and set UI values i.e fields, operator , value
    return listFilters[index];
};
const handleAddCondition = () => {
    //update filters and Condition__c
};
const handleDelete = () => {
    //Delete filter using recordUpdateUI LDS ( no Apex)
};
const handleSave = () => {
    //update filter Object using recordUpdateUI LDS ( no Apex)
};
const handleAppleFilter = () => {
    // Apply filter - this will append where clause and do fetchRecords()
};

export {
    handleEdit,
    handleAddCondition,
    handleSave,
    handleDelete,
    handleAppleFilter
};
