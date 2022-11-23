import { LightningElement, track, api } from 'lwc';

export default class DatatablePicklist extends LightningElement {
    @api options;
    @api value;
    @api fieldName;
    @api context;
    @track showPicklist = false;

    handleChange(event) {
        //show the selected value on UI
        this.value = event.detail.value;

        //fire event to send context and selected value to the data table
        this.dispatchEvent(
            new CustomEvent('picklistchanged', {
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

        this.closePicklist();
    }

    editPicklist() {
        this.showPicklist = true;
    }

    closePicklist() {
        this.showPicklist = false;
    }
}
