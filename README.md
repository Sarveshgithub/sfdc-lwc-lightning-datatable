[![Master](https://github.com/Sarveshgithub/sfdc-lwc-lightning-datatable/actions/workflows/master_push.yml/badge.svg?branch=master)](https://github.com/Sarveshgithub/sfdc-lwc-lightning-datatable/actions/workflows/master_push.yml)

# Salesforce Lightning Data table (LWC Version) 

![datatable](https://user-images.githubusercontent.com/39730173/158892595-3e7c91a3-9259-4e13-914b-191504ca8a05.PNG)

## About

To deploy the component see [Deploy](#deploy)

This is generic lighting data table , which is build in lwc.
The customization are done by design attributes.

Main features
The data table has following features.
- Show records for both custom and standard object.
- Add cols as per the fields exist in object in JSON format.
- Pagination as First,Previous,Next,Last buttons.
- New record creation action
- Row action, like : show detail, edit record, delete record
- Hide/Unhide checkbox column
- Configurable actions buttons (for developers, see [Buttons configuration](#buttons-configuration) )

## Steps to Customization through Design Attribute

**Icon name :** <br/>
Only specify the icon name if you wish to override the default icon of the object.
<br/><br/>
Design Attribute

| Label                        |  Required          | Type   | Value                                                    | Example             |
|------------------------------|--------------------|--------|----------------------------------------------------------|---------------------|
| Enter Icon Name              | :x:                | String | provide slds icon name                                   |  `standard:account` |
| Enter Title                  | :heavy_check_mark: | String | provide table title                                      |  LWC Table    |
| Enter Object API Name        | :heavy_check_mark: | String | provide object custom or standard API name               |  Account |
| Enter Columns JSON           | :heavy_check_mark: | String | { `fieldName`:api name,`label`:col label,`type`:text,number,date }. **Note** : for related field it should be concat with . i.e : Account.Name for contact | See below [**Column JSON Example**](#columns-json-example) |
| Enter Related field API Name | :x:                | String | Enter related field api name | Example AccountId for contact when component is on account layout. |
| Hide/Unhide checkbox column  | :x:                | Boolean | true/false               |  Hide/Unhide Checkbox |
| Enter WHERE clause           | :x:                | String | provide aditional filters | Example `LastName like '%s' AND Account.Name like '%t'` |
| Show the number of record    | :x:                | Boolean| append the number of records in the title  |  checked(true) OR not checked(false) |
| Buttons to display           | :x:                | String | buttons that we want to display  | See below [**Buttons configuration**](#buttons-configuration) |

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
## Buttons configuration

### Buttons JSON :
```yml
[{
        "name": "New",
        "label": "New",
        "variant": "neutral"
    }
]
```
### Default displayed buttons
The "New" button is displayed by default


### Button logic definition (fire an event, call a method in the javascript controller)
You can implement your own logic for your new buttons based on button JSON (new, delete-selected...).

```JS
  handleButtonAction(event) {
    //call desired javacript method or apex call, or throw an event based on the button key(new, delete-selected...)
    //if button has needSelectedRows set to true, have selected rows using this.selectedRows
    const buttonLabel = event.target.dataset.name;
    switch (buttonLabel) {
      case "New":
        this.newRecord();
        break;
      /* TODO
      case "delete-selected":
        const eventDeleteSelected = new CustomEvent('deleteselected', { detail: JSON.stringify(this.selectedRows) });
        this.dispatchEvent(eventDeleteSelected);
        break;*/
      default:
    }
  }
```

## Deploy
Click Button to deploy source in Developer/Sandbox

<a href="https://githubsfdeploy.herokuapp.com/app/githubdeploy/Sarveshgithub/sfdc-lwc-lightning-datatable">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>

