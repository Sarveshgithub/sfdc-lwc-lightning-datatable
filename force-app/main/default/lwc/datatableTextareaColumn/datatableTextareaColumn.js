import { LightningElement, track, api } from 'lwc';

export default class DatatableTextarea extends LightningElement {
    @api value;
    @api fieldName;
    @api context;
    @track showTextarea = false;

    handleChange(event) {
        //show the selected value on UI
        this.value = event.target.value;
        //fire event to send context and selected value to the data table
        this.dispatchEvent(
            new CustomEvent('textareachanged', {
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

        this.closeTextarea();
    }

    editTextarea() {
        this.showTextarea = true;
    }

    closeTextarea() {
        this.showTextarea = false;
    }
}
