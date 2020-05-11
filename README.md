# Salesforce Lightning Data table (LWC Version) 

![Image description](https://github.com/Sarveshgithub/sfdc-lwc-lightning-datatable/blob/master/lwc-datatable.PNG?raw=true)

## About

This is generic lighting data table , which is build in lwc.
The customization are done by design attributes.

Features
The data table has following features.
- Show records for both custom and standard object.
- Add cols as per the fields exist in object in JSON format.
- Pagination as First,Previous,Next,Last buttons.
- New record creation action
- Row action, like : show detail, edit record, delete record

## Steps to Customization through Design Attribute
Design Attribute

| Label           | Type       | Value                        | Example             |
|-----------------|------------|------------------------------|---------------------|
| Enter Icon Name  | String     | provide slds icon name  |  `standard:account` |
| Enter Title      | String     | provide table title |  LWC Table               |
| Enter Object API Name | String| provide object custom or standard API name|  Account |
| Enter Columns JSON | String | { `fieldName`:api name,`label`:col label,`type`:text,number,date }. **Note** : for related field it should be concat with . i.e : Account.Name for contact | See below **Column JSON Example**
Enter Related field API Name| String | Enter related field api name | Example AccountId for contact when component is on account layout.
Enter WHERE clause | String | provide aditional filters | Example `LastName like '%s' AND Account.Name like '%t'`

## Columns JSON Example
``` yaml 
    [{ 
       "fieldName": "FirstName",
        "label": "First Name",
        "type": "text"
    }, {
        "fieldName": "LastName",
        "label": "Last Name",
        "type": "text"
    }, {
        "fieldName": "Email",
        "label": "Email",
        "type": "email"
    }, {
        "fieldName": "Phone",
        "label": "Phone",
        "type": "phone"
    },{
        "fieldName": "Account.Name",
        "label": "Account Name",
        "type": "text"
    }]
```
If you like this then, please [donate](https://paypal.me/codemarshal?locale.x=en_GB)

<a href="https://githubsfdeploy.herokuapp.com">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>
