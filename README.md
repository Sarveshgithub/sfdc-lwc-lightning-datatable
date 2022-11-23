[![master](https://github.com/Sarveshgithub/sfdc-lwc-lightning-datatable/actions/workflows/master_push.yml/badge.svg)](https://github.com/Sarveshgithub/sfdc-lwc-lightning-datatable/actions/workflows/master_push.yml) Give a ⭐️ to this repository, Starring a repository will motivate contributors.

# Salesforce Lightning Data table (LWC Version)

![datatable](https://user-images.githubusercontent.com/39730173/158892595-3e7c91a3-9259-4e13-914b-191504ca8a05.PNG)

## About

To deploy the component see [Deploy](#deploy)

This is generic lighting data table , which is build in lwc.
The customization are done by design attributes.

Main features

-   Show records for both custom and standard object.
-   Add cols as per the fields exist in object in JSON format.
-   Pagination as First,Previous,Next,Last buttons.
-   New record creation action
-   Row action, like : show detail, edit record, delete record
-   Hide/Unhide checkbox column
-   Configurable actions buttons (for developers, see [Buttons configuration](#buttons-configuration) )
-   Sorting by field (Note: sort will not work on search).

Custom Data types (the component extendedDatatable extends lightning:datatable) :

-   picklist

## Steps to Customization through Design Attribute

### Design Attribute

| Label                                                               | Required           | Type    | Value                                                                                                                                 | Example                                                            |
| ------------------------------------------------------------------- | ------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Enter Icon Name                                                     | :x:                | String  | provide slds icon name (if you wish to override the default icon of the object)                                                       | `standard:account`                                                 |
| Enter Title                                                         | :heavy_check_mark: | String  | provide table title                                                                                                                   | LWC Table                                                          |
| Enter Object API Name                                               | :heavy_check_mark: | String  | provide object custom or standard API name                                                                                            | Contact                                                            |
| Enter Columns API Name by comma seprated                            | :heavy_check_mark: | String  | **Note** : for related field it should be concat with . i.e : Account.Name for contact, Inline Edit not support cross reference Field | FirstName,LastName,Email,Phone                                     |
| Enter Customized Field JSON ( This is Mandatory for Related Field ) | :x:                | String  | customized Column Label, Record Redirect, Data Type. **Note** : This is Mandatory for Related Fields i.e : Account.Name for contact   | See below [**Customized Field JSON**](#customized-field-json)      |
| Enter Related field API Name                                        | :x:                | String  | Enter related field api name                                                                                                          | Example AccountId for contact when component is on account layout. |
| Hide/Unhide checkbox column                                         | :x:                | Boolean | true/false                                                                                                                            | Hide/Unhide Checkbox                                               |
| Enter WHERE clause                                                  | :x:                | String  | provide aditional filters                                                                                                             | Example `LastName like '%s' AND Account.Name like '%t'`            |
| Order by                                                            | :x:                | String  | set the order by clause                                                                                                               | Example `LastName, Account.Name DESC`                              |
| Enter limit                                                         | :x:                | Integer | limit the displayed number of records for the list                                                                                    | an integer                                                         |
| Show the number of record                                           | :x:                | Boolean | append the number of records in the title                                                                                             | checked(true) OR not checked(false)                                |
| Show the view all / collapse buttons                                | :x:                | Boolean | display buttons to expand/collapse records                                                                                            | checked(true) OR not checked(false)                                |
| Enable/Disable pagination                                           | :x:                | Boolean | enable or disable pagination for the list                                                                                             | checked(true) OR not checked(false)                                |
| Buttons to display                                                  | :x:                | String  | buttons that we want to display                                                                                                       | See below [**Buttons configuration**](#buttons-configuration)      |
| Enable/Disable search                                               | :x:                | Boolean | enable or disable search bar                                                                                                          | checked(true) OR not checked                                       |

## Customized Field JSON

`label` : This key is for override column Name. ( [Example : Override Column Label](#example--override-column-label) )

`type` : This key is for override column Type [supported_lwc_datatable_datatype](https://developer.salesforce.com/docs/component-library/bundle/lightning-datatable/documentation). ( Ex : `url` ). ( [Example : Related Field Customized](#example--related-field-customized) )

`typeAttributes` : This key is used for hyperlink to recordId. ( `recId` stored recordId Field ). ( [Example : Add Hyperlink for navigate to record](#example--add-hyperlink-for-navigate-to-record) )

### Example : Override Column Label

#### Single override

```yml
{ 'AccountId': { 'label': 'Account Record Id', 'type': 'Id' } }
```

#### Multiple override

```yml
{
    'LastName': { 'label': 'Surname', 'type': 'text' },
    'AccountId': { 'label': 'Account Record Id', 'type': 'Id' }
}
```

#### Related Field Customized

```yml
{ 'Account.Name': { 'label': 'Account Name', 'type': 'text' } }
```

#### Add a hyperlink to navigate to the record

The example enables redirection to the account when we click on the account name of a contact (the field Account.Name is included in columns api name in the example).

```yml
{
    'Account.Name':
        {
            'label': 'Account Name',
            'type': 'url',
            'typeAttributes':
                {
                    'label':
                        { 'fieldName': 'Account.Name', 'recId': 'AccountId' }
                }
        }
}
```

## Buttons configuration

To configure buttons(variant are the style of a button) see the documentation here :
[buttons documentation](https://developer.salesforce.com/docs/component-library/bundle/lightning-button/example)

#### Single button

```yml
[{ 'name': 'New', 'label': 'New', 'variant': 'neutral' }]
```

#### Multiple buttons

```yml
[
    { 'name': 'New', 'label': 'New', 'variant': 'neutral' },
    { 'name': 'DeleteAll', 'label': 'Delete all', 'variant': 'destructive' }
]
```

### Default displayed buttons

The "New" button is displayed by default

### Button logic definition (fire an event, call a method in the javascript controller)

You can implement your own logic for your new buttons based on button JSON (new, delete-selected...).

```JS
  handleButtonAction(event) {
      //call desired javacript method or apex call, or throw an event based on the button key(new, delete-selected...)
      //you have selected rows in this.selectedRows
      const buttonLabel = event.target.dataset.name;
      switch (buttonLabel) {
          case 'New':
              this.newRecord();
              break;
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

Feel free to ask any Question, Suggestion, Issue [here](https://github.com/Sarveshgithub/sfdc-lwc-lightning-datatable/discussions)

## Want to contribute? Great!

Create Pull Request to `dev` branch with your feature banch. Read [Contribution Guidelines](https://quip.com/7OtsAy94piU7)
