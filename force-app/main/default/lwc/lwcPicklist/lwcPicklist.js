import { LightningElement, api} from 'lwc';



export default class DatatablePicklist extends LightningElement {
    @api options;
    @api value;
    @api fieldName;

    handleChange(event) {
        this.value = event.detail.value;

        const context = { fieldName: 'Id' };

        let draftValue = {};
        draftValue[this.contextName] = typeof(this.context) == 'number' ? context.toString() : context;
        draftValue[this.fieldName] = this.value;
        let draftValues = [];
        draftValues.push(draftValue);

        this.dispatchEvent(new CustomEvent('cellchange', {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: {

                draftValues: draftValues

            }
        }));
    }
}