import LightningDatatable from 'lightning/datatable';

import picklistTemplate from './picklistTemplate.html';


export default class ExtendedDatatable extends LightningDatatable {

    static customTypes = {

        picklist: {

            template: picklistTemplate,

            typeAttributes: ['options', 'fieldName']

        }

    };

}