[![Master](https://github.com/Sarveshgithub/sfdc-lwc-lightning-datatable/actions/workflows/master_push.yml/badge.svg?branch=master)](https://github.com/Sarveshgithub/sfdc-lwc-lightning-datatable/actions/workflows/master_push.yml)

# Salesforce Lightning Data table (LWC Version)

![datatable](https://user-images.githubusercontent.com/39730173/158892595-3e7c91a3-9259-4e13-914b-191504ca8a05.PNG)

## About

To deploy the component see [Deploy](#deploy)

This is generic lighting data table , which is build in lwc.
The customization are done by design attributes.

Main features
The data table has following features.

-   Show records for both custom and standard object.
-   Add cols as per the fields exist in object in JSON format.
-   Pagination as First,Previous,Next,Last buttons.
-   New record creation action
-   Row action, like : show detail, edit record, delete record
-   Hide/Unhide checkbox column
-   Configurable actions buttons (for developers, see [Buttons configuration](#buttons-configuration) )
-   Sorting by field.

## Steps to Customization through Design Attribute

### Design Attribute

| Label                                    | Required           | Type    | Value                                                                                                                                 | Example                                                            |
| ---------------------------------------- | ------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Enter Icon Name                          | :x:                | String  | provide slds icon name (if you wish to override the default icon of the object)                                                       | `standard:account`                                                 |
| Enter Title                              | :heavy_check_mark: | String  | provide table title                                                                                                                   | LWC Table                                                          |
| Enter Object API Name                    | :heavy_check_mark: | String  | provide object custom or standard API name                                                                                            | Contact                                                            |
| Enter Columns API Name by comma seprated | :heavy_check_mark: | String  | **Note** : for related field it should be concat with . i.e : Account.Name for contact, Inline Edit not support cross reference Field | FirstName,LastName,Email,Phone                                     |
| Enter Customized Field JSON ( This is Mandatory for Related Field )| :x: | String  | customized Column Label, Record Redirect, Data Type. **Note** : This is Mandatory for Related Fields i.e : Account.Name for contact| See below [**Customized Field JSON**](#customized-field-json)|
| Enter Related field API Name             | :x:                | String  | Enter related field api name                                                                                                          | Example AccountId for contact when component is on account layout. |
| Hide/Unhide checkbox column              | :x:                | Boolean | true/false                                                                                                                            | Hide/Unhide Checkbox                                               |
| Enter WHERE clause                       | :x:                | String  | provide aditional filters                                                                                                             | Example `LastName like '%s' AND Account.Name like '%t'`            |
| Enter limit                              | :x:                | Integer | limit the displayed number of records for the list                                                                                    | an integer                                                         |
| Show the number of record                | :x:                | Boolean | append the number of records in the title                                                                                             | checked(true) OR not checked(false)                                |
| Show the view all / collapse buttons     | :x:                | Boolean | display buttons to expand/collapse records                                                                                            | checked(true) OR not checked(false)                                |
| Enable/Disable pagination                | :x:                | Boolean | enable or disable pagination for the list                                                                                             | checked(true) OR not checked(false)                                |
| Buttons to display                       | :x:                | String  | buttons that we want to display                                                                                                       | See below [**Buttons configuration**](#buttons-configuration)      |

## Customized Field JSON
`label` : This key is for override column Name. ( [Example : Override Column Label](#example--override-column-label) )

`type`  : This key is for override column Type [supported_lwc_datatable_datatype](https://developer.salesforce.com/docs/component-library/bundle/lightning-datatable/documentation). ( Ex : `url` ). ( [Example : Related Field Customized](#example--related-field-customized) )

`typeAttributes` : This key is used for hyperlink to recordId. ( `recId` stored recordId Field ). ( [Example : Add Hyperlink for navigate to record](#example--add-hyperlink-for-navigate-to-record) )

### Example : Override Column Label
```yml
{ "AccountId":{"label":"Account Record Id"}} }
```
### Example : Related Field Customized
```yml
{ "Account.Name":{"label":"Account Name","type":"text" }} }
```

## Example : Add Hyperlink for navigate to record
```yml
{ "Account.Name":{"label":"Account Name","type":"url","typeAttributes":{"label":{"fieldName":"Account.Name","recId":"AccountId"}} }
```

## Buttons configuration

### Buttons JSON :

```yml
[{ "name": "New", "label": "New", "variant": "neutral" }]
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

## Q & A

Feel free to ask any Question, Suggestion, Issue [here](https://github.com/Sarveshgithub/sfdc-lwc-lightning-datatable/discussions/categories/q-a)

## Want to contribute? Great!
Create Pull Request to `dev` branch with your feature banch.
