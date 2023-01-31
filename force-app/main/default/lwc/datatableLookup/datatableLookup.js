/* eslint-disable @lwc/lwc/no-api-reassignments */
import { LightningElement, api, wire } from 'lwc';
import { getRecord } from "lightning/uiRecordApi";

export default class DatatableLookup extends LightningElement {
    @api label;
    @api value;
    @api placeholder;
    @api fieldName;
    @api object;
    @api context;
    @api variant;
    @api name;
    @api fields;
    @api target;
    showLookup = false;

    //get the sobject record info with fields to show as url navigation text
    @wire(getRecord, { recordId: '$value', fields: '$fields' })
    record;

    //capture the lookup change and fire a valuechange event with details payload.
    handleChange(event) {
        event.preventDefault();
        this.value = event.detail.value[0];
        this.showLookup = this.value != null ? false : true;
        this.dispatchEvent(
          new CustomEvent('lookupchanged', {
              composed: true,
              bubbles: true,
              cancelable: true,
              detail: {
                  data: {
                      context: this.context,
                      fieldName: this.fieldName,
                      value: this.value
                  }
              }
          })
        );
    }

    //loads the custom CSS for lookup custom type on lightning datatable
    renderedCallback() {
        if (!this.guid) {
            this.guid = this.template.querySelector('.lookupBlock').getAttribute('id');
            /* Register the event with this component as event payload. 
            Used to identify the window click event and if click is outside the current context of lookup, 
            set the dom to show the text and not the combobox */
            this.dispatchEvent(
                new CustomEvent('itemregister', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        callbacks: {
                            reset: this.reset
                        },
                        template: this.template,
                        guid: this.guid,
                        name: 'c-datatable-lookup'
                    }
                })
            );
        }
    }

    //show lookup if window click is on the same context, set to text view if outside the context
    reset = (context) => {
        if (this.context !== context) {
            this.showLookup = false;
        }
    }

    //Fire edit event on to allow to modify the lookup selection.
    handleClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.showLookup = true;
        this.dispatchCustomEvent('edit', this.context, this.value, this.label, this.name);
    }

    dispatchCustomEvent(eventName, context, value, label, name) {
        this.dispatchEvent(new CustomEvent(eventName, {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: {
                data: { context: context, value: value, label: label, name: name }
            }
        }));
    }

    onMouseLeaveLookup() {
        this.showLookup = false;
    }

    /*get the fieldname to display, in case if Name is autonumber, pass in different field to show as url text field
    default is like Account.Name, but so give the Name of account. But if for custom object the name field is 
    autonumber, pass the informative field reference eg. CustomObject__c.CustomField__c*/
    getFieldName() {
        let fieldName = this.fields[0];
        fieldName = fieldName.substring(fieldName.lastIndexOf('.') + 1, fieldName.length);
        return fieldName;
    }

    //label of formatted url
    get lookupName() {
        return (this.record.data != null) ?  this.record.data.fields[this.getFieldName()].value : '';
    }

    //value of formatted url
    get lookupValue() {
        if(!this.value) return '';

        return (this.record.data != null && this.record.data.fields[this.getFieldName()].value) ? '/' + this.value : '';
    }
}