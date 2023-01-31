import LightningDatatable from 'lightning/datatable';

import picklistTemplate from './picklistTemplate.html';
import customLookup from './customLookup.html';
import textAreaTemplate from './textAreaTemplate.html';
import imageTemplate from './imageTemplate.html';

export default class ExtendedDatatable extends LightningDatatable {
    static customTypes = {
        picklist: {
            template: picklistTemplate,
            typeAttributes: ['options', 'fieldName', 'context']
        },
        //example JSON {"Account.Name":{"label":"Account Name","type":"lookup","typeAttributes":{"placeholder": "Choose Account","objectApiName": "Contact","fieldName": "AccountId","label": "Account","value": { "fieldName": "AccountId" },"context": { "fieldName": "Id" },"variant": "label-hidden","name": "Account","fields": ["Account.Name"],"target": "_self"} }}
        lookup: {
          template: customLookup,
          standardCellLayout: true,
          typeAttributes: ['label', 'value', 'placeholder', 'fieldName', 'objectApiName', 'context', 'variant', 'name', 'fields', 'target']
        },
        textarea: {
            template: textAreaTemplate,
            standardCellLayout: false,
            typeAttributes: ['fieldName', 'context']
        },
        image: {
            template: imageTemplate,
            standardCellLayout: false
        }
    };
}