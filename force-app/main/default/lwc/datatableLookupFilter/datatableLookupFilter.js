import { LightningElement, api } from 'lwc';
import getRecords from '@salesforce/apex/RelatedList.getRecords';
// const lookUpJson = {
//     label: 'Asset Filter',
//     soql: 'Select id ,Name from Asset',
//     labelField: 'Name',
//     valueField: 'Id',
//     relatedField: 'Asset__c'
// };

export default class DatatableLookupFilter extends LightningElement {
    @api config;
    lookUpJson;
    data;
    label;
    soql;
    labelField;
    valueField;
    relatedField;
    value = 'inProgress';
    connectedCallback() {
        this.lookUpJson = JSON.parse(this.config);
        this.label = this.lookUpJson.label;
        this.soql = this.lookUpJson.soql;
        this.labelField = this.lookUpJson.labelField;
        this.valueField = this.lookUpJson.valueField;
        this.relatedField = this.lookUpJson.relatedField;
        getRecords({ soql: this.soql })
            .then((data) => {
                if (data) {
                    console.log('asset data', data);
                    this.data = data;
                }
            })
            .catch((error) => {
                if (error) {
                    console.log('Error');
                }
            });
    }
    get options() {
        let ops = [{ label: '--Select--', value: 'none' }];

        if (this.data) {
            this.data.forEach((val) => {
                ops.push({
                    label: val[this.labelField],
                    value: val[this.valueField]
                });
            });
        }
        return ops;
    }

    handleChange(event) {
        this.value = event.detail.value;
        let cond = this.value !== 'none' ? `${this.relatedField} = '${this.value}'` : null;
        console.log(cond);
        this.dispatchEvent(
            new CustomEvent('lookupfilter', {
                detail: {
                    condition: cond
                }
            })
        );
    }
}
