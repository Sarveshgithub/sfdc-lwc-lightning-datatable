[![Master](https://github.com/Sarveshgithub/sfdc-lwc-lightning-datatable/actions/workflows/master_push.yml/badge.svg?branch=master)](https://github.com/Sarveshgithub/sfdc-lwc-lightning-datatable/actions/workflows/master_push.yml)

# Salesforce Lightning Data table (LWC Version) 

![Image description](https://github.com/Sarveshgithub/sfdc-lwc-lightning-datatable/blob/master/lwc-datatable.PNG?raw=true)

## About

This is generic lighting data table , which is build in lwc.
The customization are done by design attributes.

Main features
The data table has following features.
- Show records for both custom and standard object.
- Add cols as per the fields exist in object in JSON format.
- Pagination as First,Previous,Next,Last buttons.
- New record creation action
- Row action, like : show detail, edit record, delete record
- configurable buttons (for developers, see "Buttons configuration")

## Steps to Customization through Design Attribute

**Icon name :** <br/>
Only specify the icon name if you wish to override the default icon of the object.
<br/><br/>
Design Attribute

| Label           | Required | Type       | Value                        | Example             |
|-----------------|------------|------------|------------------------------|---------------------|
| Enter Icon Name | false      | String     | provide slds icon name  |  `standard:account` |
| Enter Title     | true      | String     | provide table title |  LWC Table               |
| Enter Object API Name | true     | String| provide object custom or standard API name|  Account |
| Enter Columns JSON | true  | String | { `fieldName`:api name,`label`:col label,`type`:text,number,date }. **Note** : for related field it should be concat with . i.e : Account.Name for contact | See below **Column JSON Example**
Enter Related field API Name | false | String | Enter related field api name | Example AccountId for contact when component is on account layout.
Enter WHERE clause | false | String | provide aditional filters | Example `LastName like '%s' AND Account.Name like '%t'`
| Show the number of record | false | Boolean | append the number of records in the title  |  checked(true) OR not checked(false) |

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
## Buttons configuration (for developers, accessible in the component and from parent component)

### Call apex or javascript method
callApexFromButton must be true

### Fire event to parent component
- callApex must be false
- needSelectedRows can be true if you need to send selected rows to parent component

### Example 
JSON :
```
[  
   { label : "delete all", variant: "destructive", needSelectedRows: true, callApex: true },
   { label : "action button", variant : "brand", needSelectedRows: false, callApex: false },
   { label : "another action button", variant : "brand", needSelectedRows: true, callApex: false }
];
```
Parent component (**you don't need parent component, you can define default buttons using actionButtonsList**) :
```
//in template
<c-lwc-related-list object-name="Contact"
        columns={columns}
        related-field-api="AccountId"
        is-counter-displayed=true
        action-buttons-list={actions}
        show-checkboxes=true
        onaction2={helloWorld}
        onaction3={helloWorld}

//in js controller
helloWorld(event) {
    console.log('hello world');
    console.log('event rows ', event.detail);
}
```

The first button "delete all" is not going to send event to parent it will call the javascript method callApexFromButton you must 
implement the desired javascript/apex call based on the button label.

The button "action button" fires the event action2
The button "another action button" fires the event action3

## Deploy
Click Button to deploy source in Developer/Sandbox

<a href="https://githubsfdeploy.herokuapp.com/app/githubdeploy/Sarveshgithub/sfdc-lwc-lightning-datatable">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>

