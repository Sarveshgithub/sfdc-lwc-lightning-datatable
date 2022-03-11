declare module "@salesforce/apex/RelatedList.getRecords" {
  export default function getRecords(param: {soql: any, SObjectName: any, iconName: any}): Promise<any>;
}
declare module "@salesforce/apex/RelatedList.countRecords" {
  export default function countRecords(param: {objectName: any}): Promise<any>;
}
