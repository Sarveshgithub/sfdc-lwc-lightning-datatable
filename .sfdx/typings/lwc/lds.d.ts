declare module 'lightning/uiListApi' {
    /**
     * Identifier for an object.
     */
    export interface ObjectId {
        /** The object's API name. */
        objectApiName: string;
    }

    /**
     * Identifier for an object's field.
     */
    export interface FieldId {
        /** The field's API name. */
        fieldApiName: string;
        /** The object's API name. */
        objectApiName: string;
    }

    /**
     * Gets the records and metadata for a list view.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_get_list_ui
     *
     * @param objectApiName API name of the list view's object (must be specified along with listViewApiName).
     * @param listViewApiName API name of the list view (must be specified with objectApiName).
     * @param listViewId ID of the list view (may be specified without objectApiName or listViewApiName).
     * @param pageToken A token that represents the page offset. To indicate where the page starts, use this value with the pageSize parameter.
     *                The maximum offset is 2000 and the default is 0.
     * @param pageSize The number of list records viewed at one time. The default value is 50. Value can be 1–2000.
     * @param sortBy The API name of the field the list view is sorted by. If the name is preceded with `-`, the sort order is descending.
     *                For example, Name sorts by name in ascending order. `-CreatedDate` sorts by created date in descending order.
     *                Accepts only one value per request.
     * @param fields Additional fields queried for the records returned. These fields don’t create visible columns.
     *                If the field is not available to the user, an error occurs.
     * @param optionalFields Additional fields queried for the records returned. These fields don’t create visible columns.
     *                       If the field is not available to the user, no error occurs and the field isn’t included in the records.
     * @returns {Observable} See description.
     */
    export function getListUi(
        objectApiName?: string | ObjectId,
        listViewApiName?: string | symbol,
        listViewId?: string,
        pageToken?: string,
        pageSize?: number,
        sortBy?: string | FieldId,
        fields?: Array<string | FieldId>,
        optionalFields?: Array<string | FieldId>,
    ): void;
}

declare module 'lightning/uiRelatedListApi' {
    /**
     * Identifier for an object.
     */
    export interface ObjectId {
        /** The object's API name. */
        objectApiName: string;
    }

    /**
     * Identifier for an object's field.
     */
    export interface FieldId {
        /** The field's API name. */
        fieldApiName: string;
        /** The object's API name. */
        objectApiName: string;
    }

    /**
     *  Gets the metadata for a specific Related List
     * @param parentObjectApiName The API name of the parent object for the related list (must be specified with relatedListId)
     * @param parentRecordId The record ID of the parent record for the related list (must be specified with relatedListId)
     * @param relatedListId The ID of the related list (can be specified with either parentObjectApiName or parentRecordId)
     */
    export function getRelatedListInfo(parentObjectApiName?: string | ObjectId, parentRecordId?: string, relatedListId?: string): void;

    /**
     *  Gets the metadata for a batch of related lists
     * @param parentObjectApiName The API name of the parent object for the related lists
     * @param relatedListIds Comma separated IDs of supported related lists for the specified parent object
     */
    export function getRelatedListInfoBatch(parentObjectApiName: string | ObjectId, relatedListIds: Array<string>): void;

    /** Gets a collection of metadata for all the related lists for a specific entity
     *
     * @param parentObjectApiName The API name of the parent object
     */
    export function getRelatedListsInfo(parentObjectApiName?: string | ObjectId): void;

    /**
     * Gets a colllection of records for a given record and related list
     * @param parentRecordId The record ID of the parent record for the related list
     * @param relatedListId The ID of the related list
     */
    export function getRelatedListRecords(parentRecordId: string, relatedListId: string): void;

    /**
     *  Gets record data for a batch of related lists
     * @param parentRecordId The ID of the parent record you want to get related lists for
     * @param relatedListIds Comma separated IDs of supported related lists for the specified parent record
     */
    export function getRelatedListRecordsBatch(parentRecordId: string, relatedListIds: Array<string>): void;

    /**
     * Gets the count of records for a related list on a specific given record
     * @param parentRecordId The record ID of the parent record for the related list
     * @param relatedListId The ID of the related list
     */
    export function getRelatedListCount(parentRecordId: string, relatedListId: string): void;
}

declare module 'lightning/uiObjectInfoApi' {
    /**
     * Identifier for an object.
     */
    export interface ObjectId {
        /** The object's API name. */
        objectApiName: string;
    }

    /**
     * Identifier for an object's field.
     */
    export interface FieldId {
        /** The field's API name. */
        fieldApiName: string;
        /** The object's API name. */
        objectApiName: string;
    }

    /**
     * Gets the metadata for a specific object.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_wire_adapters_object_info
     *
     * @param objectApiName The API name of the object to retrieve.
     */
    export function getObjectInfo(objectApiName: string | ObjectId): void;

    /**
     * Wire adapter for multiple object metadatas.
     *
     * @param objectApiNames The API names of the objects to retrieve.
     */
    export function getObjectInfos(objectApiNames: Array<string | ObjectId>): void;

    /**
     * Wire adapter for values for a picklist field.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_wire_adapters_picklist_values
     *
     * @param fieldApiName The picklist field's object-qualified API name.
     * @param recordTypeId The record type ID. Pass '012000000000000AAA' for the master record type.
     */
    export function getPicklistValues(fieldApiName: string | FieldId, recordTypeId: string): void;

    /**
     * Wire adapter for values for all picklist fields of a record type.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_wire_adapters_picklist_values_record
     *
     * @param objectApiName API name of the object.
     * @param recordTypeId Record type ID. Pass '012000000000000AAA' for the master record type.
     */
    export function getPicklistValuesByRecordType(objectApiName: string, recordTypeId: string): void;
}

/**
 * JavaScript API to Create and Update Records.
 */
declare module 'lightning/uiRecordApi' {
    /**
     * Identifier for an object.
     */
    export interface ObjectId {
        /** The object's API name. */
        objectApiName: string;
    }

    /**
     * Identifier for an object's field.
     */
    export interface FieldId {
        /** The field's API name. */
        fieldApiName: string;
        /** The object's API name. */
        objectApiName: string;
    }

    /**
     * Contains both the raw and displayable field values for a field in a Record.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_responses_field_value.htm
     *
     * Keys:
     *    (none)
     */
    export interface FieldValueRepresentation {
        displayValue: string | null;
        value: RecordRepresentation | boolean | number | string | null;
    }
    export type FieldValueRepresentationValue = FieldValueRepresentation['value'];

    /**
     * Record Collection Representation.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_responses_record_collection.htm
     *
     * Keys:
     *    (none)
     */
    export interface RecordCollectionRepresentation {
        count: number;
        currentPageToken: string | null;
        currentPageUrl: string;
        nextPageToken: string | null;
        nextPageUrl: string | null;
        previousPageToken: string | null;
        previousPageUrl: string | null;
        records: Array<RecordRepresentation>;
    }

    /**
     * Record type.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_responses_record_type_info.htm
     *
     * Keys:
     *    (none)
     */
    export interface RecordTypeInfoRepresentation {
        available: boolean;
        defaultRecordTypeMapping: boolean;
        master: boolean;
        name: string;
        recordTypeId: string;
    }

    /**
     * Record.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_responses_record.htm
     *
     * Keys:
     *    recordId (string): id
     */
    export interface RecordRepresentation {
        apiName: string;
        childRelationships: {
            [key: string]: RecordCollectionRepresentation;
        };
        eTag: string;
        fields: {
            [key: string]: FieldValueRepresentation;
        };
        id: string;
        lastModifiedById: string | null;
        lastModifiedDate: string | null;
        recordTypeId: string | null;
        recordTypeInfo: RecordTypeInfoRepresentation | null;
        systemModstamp: string | null;
        weakEtag: number;
    }

    /**
     * Description of a record input.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_requests_record_input.htm
     *
     * Keys:
     *    (none)
     */
    export interface RecordInputRepresentation {
        allowSaveOnDuplicate?: boolean;
        apiName?: string;
        fields: {
            [key: string]: string | number | null | boolean;
        };
    }

    export interface ClientOptions {
        ifUnmodifiedSince?: string;
    }

    /**
     * Child Relationship.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_responses_child_relationship.htm
     *
     * Keys:
     *    (none)
     */
    export interface ChildRelationshipRepresentation {
        childObjectApiName: string;
        fieldName: string;
        junctionIdListNames: Array<string>;
        junctionReferenceTo: Array<string>;
        relationshipName: string;
    }

    /**
     * Information about a reference field's referenced types and the name field names of those types.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_responses_reference_to_info.htm
     *
     * Keys:
     *    (none)
     */
    export interface ReferenceToInfoRepresentation {
        apiName: string;
        nameFields: Array<string>;
    }

    /**
     * Filtered lookup info.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_responses_filtered_lookup_info.htm
     *
     * Keys:
     *    (none)
     */
    export interface FilteredLookupInfoRepresentation {
        controllingFields: Array<string>;
        dependent: boolean;
        optionalFilter: boolean;
    }

    export const enum ExtraTypeInfo {
        ExternalLookup = 'ExternalLookup',
        ImageUrl = 'ImageUrl',
        IndirectLookup = 'IndirectLookup',
        PersonName = 'PersonName',
        PlainTextArea = 'PlainTextArea',
        RichTextArea = 'RichTextArea',
        SwitchablePersonName = 'SwitchablePersonName',
    }

    export const enum RecordFieldDataType {
        Address = 'Address',
        Base64 = 'Base64',
        Boolean = 'Boolean',
        ComboBox = 'ComboBox',
        ComplexValue = 'ComplexValue',
        Currency = 'Currency',
        Date = 'Date',
        DateTime = 'DateTime',
        Double = 'Double',
        Email = 'Email',
        EncryptedString = 'EncryptedString',
        Int = 'Int',
        Location = 'Location',
        MultiPicklist = 'MultiPicklist',
        Percent = 'Percent',
        Phone = 'Phone',
        Picklist = 'Picklist',
        Reference = 'Reference',
        String = 'String',
        TextArea = 'TextArea',
        Time = 'Time',
        Url = 'Url',
    }

    /**
     * Field metadata.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_responses_field.htm
     *
     * Keys:
     *    (none)
     */
    export interface FieldRepresentation {
        apiName: string;
        calculated: boolean;
        compound: boolean;
        compoundComponentName: string | null;
        compoundFieldName: string | null;
        controllerName: string | null;
        controllingFields: Array<string>;
        createable: boolean;
        custom: boolean;
        dataType: string;
        extraTypeInfo: string | null;
        filterable: boolean;
        filteredLookupInfo: FilteredLookupInfoRepresentation | null;
        highScaleNumber: boolean;
        htmlFormatted: boolean;
        inlineHelpText: string | null;
        label: string;
        length: number;
        nameField: boolean;
        polymorphicForeignKey: boolean;
        precision: number;
        reference: boolean;
        referenceTargetField: string | null;
        referenceToInfos: Array<ReferenceToInfoRepresentation>;
        relationshipName: string | null;
        required: boolean;
        scale: number;
        searchPrefilterable: boolean;
        sortable: boolean;
        unique: boolean;
        updateable: boolean;
    }

    /**
     * Theme info.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_responses_theme_info.htm
     *
     * Keys:
     *    (none)
     */
    export interface ThemeInfoRepresentation {
        color: string;
        iconUrl: string | null;
    }

    /**
     * Object metadata.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_responses_object_info.htm
     *
     * Keys:
     *    apiName (string): apiName
     */
    export interface ObjectInfoRepresentation {
        apiName: string;
        associateEntityType: string | null;
        associateParentEntity: string | null;
        childRelationships: Array<ChildRelationshipRepresentation>;
        createable: boolean;
        custom: boolean;
        defaultRecordTypeId: string | null;
        deletable: boolean;
        dependentFields: {
            [key: string]: {};
        };
        eTag: string;
        feedEnabled: boolean;
        fields: {
            [key: string]: FieldRepresentation;
        };
        keyPrefix: string | null;
        label: string;
        labelPlural: string;
        layoutable: boolean;
        mruEnabled: boolean;
        nameFields: Array<string>;
        queryable: boolean;
        recordTypeInfos: {
            [key: string]: RecordTypeInfoRepresentation;
        };
        searchable: boolean;
        themeInfo: ThemeInfoRepresentation | null;
        updateable: boolean;
    }

    /**
     * Wire adapter for a record.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_wire_adapters_record
     *
     * @param recordId ID of the record to retrieve.
     * @param fields Object-qualified field API names to retrieve. If a field isn’t accessible to the context user, it causes an error.
     *               If specified, don't specify layoutTypes.
     * @param layoutTypes Layouts defining the fields to retrieve. If specified, don't specify fields.
     * @param modes Layout modes defining the fields to retrieve.
     * @param optionalFields Object-qualified field API names to retrieve. If an optional field isn’t accessible to the context user,
     *                       it isn’t included in the response, but it doesn’t cause an error.
     * @returns An observable of the record.
     */
    export function getRecord(
        recordId: string,
        fields?: Array<string | FieldId>,
        layoutTypes?: string[],
        modes?: string[],
        optionalFields?: Array<string | FieldId>,
    ): void;

    /**
     * Wire adapter for default field values to create a record.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_wire_adapters_create_record_values
     *
     * @param objectApiName API name of the object.
     * @param formFactor Form factor. Possible values are 'Small', 'Medium', 'Large'. Large is default.
     * @param recordTypeId Record type id.
     * @param optionalFields Object-qualified field API names to retrieve. If an optional field isn’t accessible to the context user,
     *                       it isn’t included in the response, but it doesn’t cause an error.
     */
    export function getRecordCreateDefaults(
        objectApiName: string | ObjectId,
        formFactor?: string,
        recordTypeId?: string,
        optionalFields?: Array<string | FieldId>,
    ): void;

    /**
     * Wire adapter for record data, object metadata and layout metadata
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_wire_adapters_record_ui
     *
     * @param recordIds ID of the records to retrieve.
     * @param layoutTypes Layouts defining the fields to retrieve.
     * @param modes Layout modes defining the fields to retrieve.
     * @param optionalFields Object-qualified field API names to retrieve. If an optional field isn’t accessible to the context user,
     *                       it isn’t included in the response, but it doesn’t cause an error.
     */
    export function getRecordUi(
        recordIds: string | string[],
        layoutTypes: string | string[],
        modes: string | string[],
        optionalFields: Array<string | FieldId>,
    ): void;

    /**
     * Updates a record using the properties in recordInput. recordInput.fields.Id must be specified.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_update_record
     *
     * @param recordInput The record input representation to use to update the record.
     * @param clientOptions Controls the update behavior. Specify ifUnmodifiedSince to fail the save if the record has changed since the provided value.
     * @returns A promise that will resolve with the patched record.
     */
    export function updateRecord(recordInput: RecordInputRepresentation, clientOptions?: ClientOptions): Promise<RecordRepresentation>;

    /**
     * Creates a new record using the properties in recordInput.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_create_record
     *
     * @param recordInput The RecordInput object to use to create the record.
     * @returns A promise that will resolve with the newly created record.
     */
    export function createRecord(recordInput: RecordInputRepresentation): Promise<RecordRepresentation>;

    /**
     * Deletes a record with the specified recordId.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_delete_record
     *
     * @param recordId ID of the record to delete.
     * @returns A promise that will resolve to undefined.
     */
    export function deleteRecord(recordId: string): Promise<undefined>;

    /**
     * Returns an object with its data populated from the given record. All fields with values that aren't nested records will be assigned.
     * This object can be used to create a record with createRecord().
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_generate_record_input_create
     *
     * @param record The record that contains the source data.
     * @param objectInfo The ObjectInfo corresponding to the apiName on the record. If provided, only fields that are createable=true
     *        (excluding Id) are assigned to the object return value.
     * @returns RecordInput
     */
    export function generateRecordInputForCreate(record: RecordRepresentation, objectInfo?: ObjectInfoRepresentation): RecordInputRepresentation;

    /**
     * Returns an object with its data populated from the given record. All fields with values that aren't nested records will be assigned.
     * This object can be used to update a record.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_generate_record_input_update
     *
     * @param record The record that contains the source data.
     * @param objectInfo The ObjectInfo corresponding to the apiName on the record.
     *        If provided, only fields that are updateable=true (excluding Id) are assigned to the object return value.
     * @returns RecordInput.
     */
    export function generateRecordInputForUpdate(record: RecordRepresentation, objectInfo?: ObjectInfoRepresentation): RecordInputRepresentation;

    /**
     * Returns a new RecordInput containing a list of fields that have been edited from their original values. (Also contains the Id
     * field, which is always copied over.)
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_create_record_input_update
     *
     * @param recordInput The RecordInput object to filter.
     * @param originalRecord The Record object that contains the original field values.
     * @returns RecordInput.
     */
    export function createRecordInputFilteredByEditedFields(
        recordInput: RecordInputRepresentation,
        originalRecord: RecordRepresentation,
    ): RecordInputRepresentation;

    /**
     * Gets a field's value from a record.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_get_field_value
     *
     * @param record The record.
     * @param field Object-qualified API name of the field to return.
     * @returns The field's value (which may be a record in the case of spanning fields), or undefined if the field isn't found.
     */
    export function getFieldValue(record: RecordRepresentation, field: FieldId | string): FieldValueRepresentationValue | undefined;

    /**
     * Gets a field's display value from a record.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_get_field_display_value
     *
     * @param record The record.
     * @param field Object-qualified API name of the field to return.
     * @returns The field's display value, or undefined if the field isn't found.
     */
    export function getFieldDisplayValue(record: RecordRepresentation, field: FieldId | string): FieldValueRepresentationValue | undefined;
}

declare module 'lightning/platformScaleCenterApi' {
    /**
     * Wire adapter for a Scale Center observability metrics.
     *
     * @param request a serialized list of ScaleCenterRequests that define which metrics are to be queried
     * @returns a serialized list of the requested metric data
     */
    export function getMetrics(request: string): void;
}

declare module 'lightning/analyticsWaveApi' {
    /**
     * A Tableau CRM dataflow node.
     *
     * Keys:
     *    (none)
     */
    export interface AbstractDataflowNodeRepresentation {
        /** Node action */
        action: string;
        /** Node sources */
        sources: Array<string>;
    }

    /**
     * Base representation for fields in Tableau CRM.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#AbstractFieldRepresentation
     *
     * Keys:
     *    (none)
     */
    export interface AbstractFieldRepresentation {
        defaultValue?: string | number | null | boolean;
        description?: string;
        fieldType: string;
        format?: string;
        label: string;
        multiValue?: boolean;
        multiValueSeparator?: string;
        name: string;
        precision?: number;
        scale?: number;
        systemField?: boolean;
        uniqueId?: boolean;
    }

    /**
     * An advanced property Name and Value.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#AdvancedPropertyValueReprensentation
     *
     * Keys:
     *    (none)
     */
    export interface AdvancedPropertyValueRepresentation {
        name: string;
        value: string;
    }

    /**
     * Asset reference representation.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#AssetReferenceRepresentation
     *
     * Keys:
     *    (none)
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface AssetReferenceRepresentation extends BaseAssetReferenceRepresentation {}

    /**
     * Base Tableau CRM Asset input Representation
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#BaseAssetInputRepresentation
     *
     * Keys:
     *    (none)
     */
    export interface BaseAssetInputRepresentation {
        description?: string;
        label?: string;
        name?: string;
    }

    /**
     * Base asset reference representation.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#AssetReferenceRepresentation
     *
     * Keys:
     *    (none)
     */
    export interface BaseAssetReferenceRepresentation {
        /** The 18 character ID of the asset. */
        id: string;
        /** The asset label. */
        label?: string;
        /** The asset developer name. */
        name?: string;
        /** The namespace that qualifies the asset name */
        namespace?: string;
        /** The asset URL. */
        url?: string;
    }

    /**
     * Base Tableau CRM asset representation.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#BaseWaveAssetRepresentation
     * Keys:
     *    id (string): id
     */
    export interface BaseWaveAssetRepresentation {
        /** Sharing URL for the asset. */
        assetSharingUrl?: string | null;
        /** The user that created the asset. */
        createdBy?: WaveUserRepresentation;
        /** Time the asset was created. */
        createdDate?: string;
        /** Short description of the asset. */
        description?: string;
        /** The 18 character asset ID. */
        id: string;
        /** The label of the asset. */
        label?: string;
        /** Last time the asset was accessed. */
        lastAccessedDate?: string | null;
        /** The user that last updated the asset. */
        lastModifiedBy?: WaveUserRepresentation | null;
        /** Last time the asset was modified. */
        lastModifiedDate?: string | null;
        /** The name of the asset. */
        name?: string;
        /** The namespace of the Asset. */
        namespace?: string;
        /** Represents permissions for the present user. */
        permissions?: PermissionsRepresentation | null;
        /** The asset type. */
        type: string;
        /** URL to get the definition of the asset. */
        url: string;
    }

    /**
     * A Connection Property Name and Value.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_dataconnectors.htm#ConnectionPropertyValueRepresentation
     *
     * Keys:
     *    (none)
     */
    export interface ConnectionPropertyValueRepresentation {
        name: string;
        value: string | number | boolean;
    }

    /**
     * Daily schedule on which to execute some type of job.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#DailyScheduleInputRepresentation
     *
     * Keys:
     *    (none)
     */
    export interface DailyScheduleInputRepresentation extends ScheduleInputRepresentation {
        frequency: 'daily' | 'Daily';
    }

    /**
     * Daily schedule on which to execute some type of job.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#DailyScheduleRepresentation
     *
     * Keys:
     *    id (string): assetId
     */
    export interface DailyScheduleRepresentation extends ScheduleRepresentation {
        frequency: 'daily' | 'Daily';
    }

    /**
     * Tableau CRM Data Connector input representation
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_dataconnectors.htm#DataConnectorInputRepresentation
     *
     * Keys:
     *    (none)
     */
    export interface DataConnectorInputRepresentation extends BaseAssetInputRepresentation {
        /** Connection properties for the connector */
        connectionProperties?: Array<any>;
        /** Third party driver used for connection */
        connectorHandler?: string;
        /** The type of the Data Connector. */
        connectorType?: string;
        /** Folder for the Live connector */
        folder?: {
            [key: string]: string;
        };
        /** AssetReference containing ID or API name of target connector associated with the current source connector */
        targetConnector?: {
            [key: string]: string;
        };
    }

    /**
     * A Data Connector represents a connection.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_dataconnectors.htm#DataConnectorRepresentation
     *
     * Keys:
     *    id (string): id
     */
    export interface DataConnectorRepresentation extends BaseWaveAssetRepresentation {
        connectionProperties: Array<ConnectionPropertyValueRepresentation>;
        connectorHandler?: string;
        connectorType: string;
        folder?: AssetReferenceRepresentation;
        ingestionSchedule:
            | HourlyScheduleRepresentation
            | MonthlySpecificScheduleRepresentation
            | MinutelyScheduleRepresentation
            | EventDrivenScheduleRepresentation
            | WeeklyScheduleRepresentation
            | MonthlyRelativeScheduleRepresentation
            | DailyScheduleRepresentation
            | EmptyScheduleRepresentation;
        targetConnector?: AssetReferenceRepresentation;
        type: 'dataConnector';
    }

    /**
     * A collection of Dataflows.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_dataflows.htm#DataflowCollectionRepresentation
     *
     * Keys:
     *    (none)
     */
    export interface DataflowCollectionRepresentation {
        dataflows: Array<DataflowRepresentation>;
    }

    /**
     * A Tableau CRM dataflow definition.
     *
     * Keys:
     *    (none)
     */
    export interface DataflowDefinitionRepresentation {
        /** node definitions */
        nodes: {
            [key: string]: AbstractDataflowNodeRepresentation;
        };
    }

    /**
     * DataflowJob input representation
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_dataflowjobs_id.htm#DataflowJobInputRepresentation
     *
     * Keys:
     *    (none)
     */
    export interface DataflowJobInputRepresentation {
        /** Dataflow Job command */
        command: string;
        /** Dataflow ID */
        dataflowId?: string;
    }

    /**
     * Tableau CRM dataflow job representation.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_dataflowjobs_id.htm#DataflowJobRepresentation
     *
     * Keys:
     *    id (string): id
     */
    export interface DataflowJobRepresentation extends BaseWaveAssetRepresentation {
        /** The runtime in seconds of a dataflow job */
        duration?: number;
        /** The start date of a job's execution. */
        executedDate?: string | null;
        /** The type of a job */
        jobType: string;
        /** The analytics license type and other properties */
        licenseAttributes?: LicenseAttributesRepresentation | null;
        /** The error or informational message of a dataflow job */
        message?: string | null;
        /** The URL of job nodes */
        nodesUrl: string;
        /** The progress of a job */
        progress: number;
        /** The source of a job */
        source?: AssetReferenceRepresentation | null;
        /** The start date of a dataflow job */
        startDate?: string;
        /** The runtime status of a dataflow job */
        status: string;
        /** The dataflows to sync when the job is triggered. */
        syncDataflows: DataflowCollectionRepresentation;
        type: 'DataflowJob';
    }

    /**
     * Tableau CRM dataflow asset representation.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_dataflows_id.htm#DataflowRepresentation
     *
     * Keys:
     *    id (string): id
     */
    export interface DataflowRepresentation extends BaseWaveAssetRepresentation {
        /** Current version of dataflow. */
        current?: DataflowVersionRepresentation | null;
        /** The representation of the dataflow nodes */
        definition: {
            [key: string]: string;
        };
        /** Email notification level of dataflow. */
        emailNotificationLevel?: string | null;
        /** The URL for the dataflow histories associated with the dataflow. */
        historiesUrl?: string | null;
        /** Next scheduled run of dataflow. */
        nextScheduledDate?: string | null;
        /** Schedule attributes of dataflow. */
        scheduleAttributes?: string | null;
        type: 'Dataflow';
    }

    /**
     * A Tableau CRM dataflow version.
     *
     * Keys:
     *    (none)
     */
    export interface DataflowVersionRepresentation {
        /** The user that created the asset. */
        createdBy: WaveUserRepresentation;
        /** Time the asset was created. */
        createdDate: string;
        /** Dataflow definition */
        definition: DataflowDefinitionRepresentation;
        /** The 18 character asset ID. */
        id: string;
    }

    /**
     * Represents an empty schedule on an asset
     *
     * Keys:
     *    id (string): assetId
     */
    export interface EmptyScheduleRepresentation extends ScheduleRepresentation {
        frequency: 'none' | 'None';
    }

    /**
     * A schedule triggered by an event, e.g., the completion of a data sync job.
     *
     * Keys:
     *    (none)
     */
    export interface EventBasedScheduleInputRepresentation extends ScheduleInputRepresentation {
        frequency: 'eventdriven' | 'EventDriven';
        /** The expression defining the events that trigger the scheduling of the target asset. Currently, only accepting scheduling of Dataflows and Recipes as the target asset. */
        triggerRule?: string;
    }

    /**
     * A schedule triggered by an event, e.g., the completion of a data sync job.
     *
     * Keys:
     *    id (string): assetId
     */
    export interface EventDrivenScheduleRepresentation extends ScheduleRepresentation {
        frequency: 'eventdriven' | 'EventDriven';
    }

    /**
     * A schedule which can run multiple times a day.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#HourlyScheduleInputRepresentation
     *
     * Keys:
     *    (none)
     */
    export interface HourlyScheduleInputRepresentation extends ScheduleInputRepresentation {
        frequency: 'hourly' | 'Hourly';
        /** Days of the week on which the schedule will run. */
        daysOfWeek: Array<string>;
        /** Hours in between each queueing of task. */
        hourlyInterval: number;
        /** Hour at which schedule stops queueing. */
        lastHour?: number;
    }

    /**
     * A schedule which can run multiple times a day.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#HourlyScheduleRepresentation
     *
     * Keys:
     *    id (string): assetId
     */
    export interface HourlyScheduleRepresentation extends ScheduleRepresentation {
        frequency: 'hourly' | 'Hourly';
        /** Days of the week on which the schedule will run. */
        daysOfWeek: Array<string>;
        /** Hours in between each queueing of task. */
        hourlyInterval: number;
        /** Hour at which schedule stops queueing. */
        lastHour?: number;
    }

    /**
     * The analytics license type and other properties
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_limits.htm#LicenseAttributesRepresentation
     *
     * Keys:
     *    (none)
     */
    export interface LicenseAttributesRepresentation {
        /** The associated analytics license type */
        type: string;
    }

    /**
     * A schedule which can run multiple times an hour.
     *
     * Keys:
     *    (none)
     */
    export interface MinutelyScheduleInputRepresentation extends ScheduleInputRepresentation {
        frequency: 'minutely' | 'Minutely';
        /** Days of the week on which the schedule will run. */
        daysOfWeek: Array<string>;
        /** Hour at which schedule stops queueing. */
        lastHour?: number;
        /** Minutes in between each queueing of task. */
        minutelyInterval: number;
    }

    /**
     * A schedule which can run multiple times an hour.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#MinutelyScheduleRepresentation
     *
     * Keys:
     *    id (string): assetId
     */
    export interface MinutelyScheduleRepresentation extends ScheduleRepresentation {
        frequency: 'minutely' | 'Minutely';
        /** Days of the week on which the schedule will run. */
        daysOfWeek: Array<string>;
        /** Hour at which schedule stops queueing. */
        lastHour?: number;
        /** Minutes in between each queueing of task. */
        minutelyInterval: number;
    }

    /**
     * Schedule which runs monthly on a relative day within the month.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#MonthlyRelativeScheduleInputRepresentation
     *
     * Keys:
     *    (none)
     */
    export interface MonthlyRelativeScheduleInputRepresentation extends ScheduleInputRepresentation {
        frequency: 'monthlyrelative' | 'MonthlyRelative';
        /** Day within a week. */
        dayInWeek: string;
        /** Week within a month. */
        weekInMonth: string;
    }

    /**
     * Schedule which runs monthly on a relative day within the month.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#MonthlyRelativeScheduleRepresentation
     *
     * Keys:
     *    id (string): assetId
     */
    export interface MonthlyRelativeScheduleRepresentation extends ScheduleRepresentation {
        frequency: 'monthlyrelative' | 'MonthlyRelative';
        /** Day within a week. */
        dayInWeek: string;
        /** Week within a month. */
        weekInMonth: string;
    }

    /**
     * A schedule which runs once a month on specific (numerical) days of the month or on the 'last' day of the month.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#MonthlySpecificScheduleInputRepresentation
     *
     * Keys:
     *    (none)
     */
    export interface MonthlySpecificScheduleInputRepresentation extends ScheduleInputRepresentation {
        frequency: 'monthly' | 'Monthly';
        /** Days of the month on which the schedule will run (-1, 1-31). Note that months lacking specific days will skip the job. Can specify a single value of -1 to indicate the last day of the month (-1 cannot be used with additional days). */
        daysOfMonth: Array<number>;
    }

    /**
     * A schedule which runs once a month on specific (numerical) days of the month or on the 'last' day of the month.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#MonthlySpecificScheduleRepresentation
     *
     * Keys:
     *    id (string): assetId
     */
    export interface MonthlySpecificScheduleRepresentation extends ScheduleRepresentation {
        frequency: 'monthly' | 'Monthly';
        /** Days of the month on which the schedule will run (-1, 1-31). Note that months lacking specific days will skip the job. Can specify a single value of -1 to indicate the last day of the month (-1 cannot be used with additional days). */
        daysOfMonth: Array<number>;
    }

    /**
     * output source for output objects
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_replicateddatasets.htm#OutputSourceRepresentation
     *
     * Keys:
     *    (none)
     */
    export interface OutputSourceRepresentation {
        inputRows?: number;
        isSyncOut: boolean;
        name: string;
        nextScheduledDate?: string;
        outputRows?: number;
    }

    /**
     * Replicates data from an external source object into Tableau CRM as a dataset. Replicated Datasets are not intended to be visualized directly, but are used like a cache to speed up other workflows which refer to the same source object.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_replicateddatasets.htm#ReplicatedDatasetInputRepresentation
     *
     * Keys:
     *    (none)
     */
    export interface ReplicatedDatasetInputRepresentation {
        advancedProperties?: Array<{
            [key: string]: any;
        }>;
        connectionMode?: string;
        connectorId?: string;
        fullRefresh?: boolean;
        passThroughFilter?: string;
        rowLevelSharing?: boolean;
        sourceObjectName?: string;
    }

    /**
     * Replicates data from an external source object into Tableau CRM as a dataset. Replicated Datasets are not intended to be visualized directly, but are used like a cache to speed up other workflows which refer to the same source object.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_replicateddatasets.htm#ReplicatedDatasetRepresentation
     *
     * Keys:
     *    id (string): uuid
     */
    export interface ReplicatedDatasetRepresentation {
        assetSharingUrl?: string | null;
        createdBy?: WaveUserRepresentation;
        createdDate?: string;
        description?: string;
        id: string;
        label?: string;
        lastAccessedDate?: string | null;
        lastModifiedBy?: WaveUserRepresentation | null;
        lastModifiedDate?: string | null;
        name?: string;
        namespace?: string;
        permissions?: PermissionsRepresentation | null;
        type: string;
        url: string;
        advancedProperties: Array<AdvancedPropertyValueRepresentation>;
        connectionMode?: string;
        connector: DataConnectorRepresentation;
        datasetId?: string;
        fieldCount?: number;
        fieldsUrl: string;
        filterApplied: boolean;
        lastRefreshedDate?: string;
        outputSource?: OutputSourceRepresentation;
        passThroughFilter?: string;
        replicationDataflowId?: string;
        rowLevelSharing?: boolean;
        sourceObjectName: string;
        status?: string;
        supportedConnectionModes?: Array<string>;
        uuid: string;
    }

    /**
     * A list of configuration metadata that specifies how to replicate each field of a Replicated Dataset.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_replicateddatasets_id_fields.htm#ReplicatedFieldCollectionInputRepresentation
     *
     * Keys:
     *    (none)
     */
    export interface ReplicatedFieldCollectionInputRepresentation {
        fields: Array<{}>;
    }

    /**
     * A list of Replicated Fields.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_replicateddatasets_id_fields.htm#ReplicatedFieldCollectionInputRepresentation#ReplicatedFieldCollectionRepresentation
     *
     * Keys:
     *    id (string): replicatedDataset.id
     */
    export interface ReplicatedFieldCollectionRepresentation {
        fields: Array<ReplicatedFieldRepresentation>;
        replicatedDataset: AssetReferenceRepresentation;
        url: string;
    }

    /**
     * Metadata/configuration for a single field of a Replicated Dataset.
     *
     * Keys:
     *    (none)
     */
    export interface ReplicatedFieldRepresentation extends AbstractFieldRepresentation {
        skipped: boolean;
        fieldType: 'replicatedField';
    }

    /**
     * Permissions of the user on an asset.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#PermissionsRepresentation
     *
     * Keys:
     *    (none)
     */
    export interface PermissionsRepresentation {
        /** The value which indicates whether the user can create an asset */
        create?: boolean;
        /** The value which indicates whether the user can manage access control on an asset */
        manage?: boolean;
        /** The value which indicates whether the user can modify an asset */
        modify?: boolean;
        /** The value which indicates whether the user can view an asset. */
        view?: boolean;
    }

    /**
     * Representation of a dataset version restore.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_dataconnectors_connectorid_ingest.htm#RestoreDatasetVersionRepresentation
     *
     * Keys:
     *    id (string): url
     */
    export interface RestoreDatasetVersionRepresentation {
        message: string;
        url: string;
    }

    /**
     * Analtyics query specification.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_query.htm#SaqlQueryInputRepresentation
     *
     * Keys:
     *    (none)
     */
    export interface SaqlQueryInputRepresentation {
        metadata?: SaqlQueryMetadataInputRepresentation;
        /** The query name */
        name?: string;
        /** The query */
        query: string;
        /** The language in which the query is written: Saql, Sql. */
        queryLanguage?: string;
        /** The timezone requested. */
        timezone?: string;
    }

    /**
     * Query metadata contains query Id and query sequence Id used for performance tracking and monitoring purposes.
     *
     * Keys:
     *    (none)
     */
    export interface SaqlQueryMetadataInputRepresentation {
        [key: string]: any;
    }

    /**
     * Input representation for specifying a schedule on which to execute some type of job.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#ScheduleInputRepresentation
     *
     * Keys:
     *    (none)
     */
    export interface ScheduleInputRepresentation {
        /** Frequency on which this schedule is run. This is case-insensitive. */
        frequency: string;
        /** Level of subscription for the related job. */
        notificationLevel?: string;
        /** When the schedule should be run. */
        time?: {
            [key: string]: any;
        };
    }

    /**
     * Schedule on which to execute some type of job
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_schedule.htm#ScheduleRepresentation
     *
     * Keys:
     *    id (string): assetId
     */
    export interface ScheduleRepresentation {
        /** The 18 character ID of the asset. */
        assetId: string;
        frequency: string;
        /** Next scheduled time (in UTC) for this schedule. */
        nextScheduledDate?: string;
        /** Email notification level of dataflow associated with this schedule. */
        notificationLevel?: string;
        /** Hour and timezone in which this schedule is run. */
        time?: TimeRepresentation;
    }

    /**
     * Time at which something should happen
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#TimeRepresentation
     *
     * Keys:
     *    (none)
     */
    export interface TimeRepresentation {
        /** Hour at which this schedule is run (0-23). */
        hour: number;
        /** Minute at which this schedule is run (0-59). */
        minute: number;
        /** Time zone of the hour at which the schedule is run. */
        timeZone: TimeZoneRepresentation;
    }

    /**
     * Information about a time zone.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#TimeZoneRepresentation
     *
     * Keys:
     *    (none)
     */
    export interface TimeZoneRepresentation {
        /** The signed offset, in hours, from GMT. */
        gmtOffset: number;
        /** The display name of this time zone. */
        name: string;
        /** The zone ID of this time zone. */
        zoneId: string;
    }

    /**
     * Information about a user.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#WaveUserRepresentation
     *
     * Keys:
     *    (none)
     */
    export interface WaveUserRepresentation {
        /** The 18 character user ID. */
        id: string;
        /** The name of the user. */
        name?: string;
        /** The Chatter profile photo of the user. */
        profilePhotoUrl?: string | null;
    }

    /**
     * Weekly schedule on which to execute some type of job.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#WeeklyScheduleInputRepresentation
     *
     * Keys:
     *    (none)
     */
    export interface WeeklyScheduleInputRepresentation extends ScheduleInputRepresentation {
        frequency: 'weekly' | 'Weekly';
        /** Days of the week on which the schedule will run. */
        daysOfWeek: Array<string>;
    }

    /**
     * Weekly schedule on which to execute some type of job.
     *
     * https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#WeeklyScheduleRepresentation
     *
     * Keys:
     *    id (string): assetId
     */
    export interface WeeklyScheduleRepresentation extends ScheduleRepresentation {
        frequency: 'weekly' | 'Weekly';
        /** Days of the week on which the schedule will run. */
        daysOfWeek: Array<string>;
    }

    /**
     * Creates a Tableau CRM connector.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_analytics_create_data_connector
     *
     * @param dataConnector.connectionProperties Connection properties for the connector.
     * @param dataConnector.connectorHandler Third party driver used for connection.
     * @param dataConnector.connectorType The type of the Data Connector.
     * @param dataConnector.folder Folder for the Live connector.
     * @param dataConnector.targetConnector AssetReference containing ID or API name of target connector associated with the current source connector.
     * @return A promise that will resolve to the data connector response.
     */
    export function createDataConnector({ dataConnector }: { dataConnector: DataConnectorInputRepresentation }): Promise<DataConnectorRepresentation>;

    /**
     * Creates a Tableau CRM dataflow job, which is the equivalent of clicking Run Now for a data prep recipe, a data sync,
     * or a dataflow in the Tableau CRM Data Manager UI.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_analytics_create_dataflow_job
     *
     * @param dataflowJob.dataflowId The dataflow, data prep recipe, or data sync ID for the job.
     * @param dataflowJob.command The job command to execute. Must be `Start` to create a dataflow job.
     * @return A promise that will resolve to the dataflow job response.
     */
    export function createDataflowJob({ dataflowJob }: { dataflowJob: DataflowJobInputRepresentation }): Promise<DataflowJobRepresentation>;

    /**
     * Creates a Tableau CRM replicated dataset
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_analytics_create_replicated_dataset
     *
     * @param replicatedDataset.advancedProperties List of user-specified advanced properties associated with this.
     * @param replicatedDataset.connectionMode Connection mode for pulling the data from the replicated dataset.
     * @param replicatedDataset.connectorId The id of the connector object used to replicate.
     * @param replicatedDataset.fullRefresh Whether to perform a one-time full refresh (during the next run) as opposed to incremental.
     * @param replicatedDataset.passThroughFilter Passthrough filter for the replicated object.
     * @param replicatedDataset.rowLevelSharing Inherit row level sharing rules for this object.
     * @param replicatedDataset.sourceObjectName The name of the source object to be replicated.
     * @return A promise that will resolve to the replicated dataset response.
     */
    export function createReplicatedDataset({
        replicatedDataset,
    }: {
        replicatedDataset: ReplicatedDatasetInputRepresentation;
    }): Promise<ReplicatedDatasetRepresentation>;

    /**
     * Deletes a specific Tableau CRM dataset by ID or developer name.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_analytics_delete_dataset
     *
     * @param datasetIdOrApiName The ID or developer name of the dataset.
     * @return A promise that will resolve on completion.
     */
    export function deleteDataset({ datasetIdOrApiName }: { datasetIdOrApiName: string }): Promise<void>;

    /**
     * Deletes a specific Tableau CRM data prep recipe by ID.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_analytics_delete_recipe
     *
     * @param id The ID of the data prep recipe.
     * @return A promise that will resolve on completion.
     */
    export function deleteRecipe({ id }: { id: string }): Promise<void>;

    /**
     * Deletes a specific Tableau CRM replicated dataset by ID.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_analytics_delete_replicated_dataset
     *
     * @param id The ID of the replicated dataset.
     * @return A promise that will resolve on completion.
     */
    export function deleteReplicatedDataset({ id }: { id: string }): Promise<void>;

    /**
     * Wire adapter to execute a Tableau CRM query.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_analytics_execute_query
     *
     * @param query.query The query string to execute.
     * @param query.queryLanguage The query language. Valid values are `SAQL` or `SQL`. The default is `SAQL`.
     * @param query.timezone The timezone for the query.
     */
    export function executeQuery(query: SaqlQueryInputRepresentation): void;

    /**
     * Wire adapter to retrieve the Analytics limits for Tableau CRM.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_wire_adapters_get_analytics_limits
     *
     * @param licenseType The Tableau CRM license types. Valid values are `EinsteinAnalytics` or `Sonic`.
     * @param types The types of limits used in Tableau CRM.
     *              Valid values are `BatchTransformationHours`, `DatasetQueries`, `DatasetRowCount`,
     *              `MaxDailyRowsHighOutputCon`, `MaxDailyRowsLowOutputCon`, `MaxDailyRowsMedOutputCon`,
     *              `MaxDailySizeHighOutputCon`, `MaxDailySizeLowOutputCon`, `MaxDailySizeMedOutputCon`,
     *              or `OutputLocalConnectorVolume`.
     */
    export function getAnalyticsLimits(licenseType?: string, types?: string[]): void;

    /**
     * Wire adapter to retrieve the Connector for Tableau CRM.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_wire_adapters_get_data_connector
     *
     * @param connectorIdOrApiName The ID of the connector.
     */
    export function getDataConnector(connectorIdOrApiName: string): void;

    /**
     * Wire adapter to retrieve the collection of Connectors for Tableau CRM.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_wire_adapters_get_data_connectors
     *
     * @param category The categories that the data connector belongs to. Valid values are:
     *                 AdvancedPropertiesSupport, BatchRead, Direct, FileBased, FilterSupport, MuleSoft, Output
     * @param connectorType The type of Tableau CRM connector.
     * @param scope The type of scope to be applied to the returned collection. Valid values are:
     *              Created​By​Me, Mru (Most Recently Used), Shared​With​Me
     */
    export function getDataConnectors(category?: string, connectorType?: string, scope?: string): void;

    /**
     * Wire adapter to retrieve the collection of source fields for a particular source object.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_wire_adapters_get_data_connector_source_fields
     *
     * @param connectorIdOrApiName The ID of the connector.
     * @param sourceObjectName The name of the source object.
     */
    export function getDataConnectorSourceFields(connectorIdOrApiName: string, sourceObjectName: string): void;

    /**
     * Wire adapter to retrieve a source object resource for a Tableau CRM connector.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_wire_adapters_get_data_connector_source_object
     *
     * @param connectorIdOrApiName The ID of the connector.
     * @param sourceObjectName The name of the source object.
     */
    export function getDataConnectorSourceObject(connectorIdOrApiName: string, sourceObjectName: string): void;

    /**
     * Wire adapter to test the status of an external Tableau CRM connector.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_wire_adapters_get_data_connector_status
     *
     * @param connectorIdOrApiName The ID of the connector.
     */
    export function getDataConnectorStatus(connectorIdOrApiName: string): void;

    /**
     * Wire adapter to retrieve a collection of Tableau CRM connector types.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_wire_adapters_get_data_connector_types
     */
    export function getDataConnectorTypes(): void;

    /**
     * Wire adapter to retrieve a specific Tableau CRM dataflow job.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_wire_adapters_get_dataflow_job
     *
     * @param dataflowjobId The ID of the dataflow job.
     */
    export function getDataflowJob(dataflowjobId: string): void;

    /**
     * Wire adapter to retrieve a specific Tableau CRM dataflow job node for a recipe or dataflow.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_wire_adapters_get_dataflow_job_node
     *
     * @param dataflowjobId The ID of the dataflow job.
     * @param nodeId The ID of the node.
     */
    export function getDataflowJobNode(dataflowjobId: string, nodeId: string): void;

    /**
     * Wire adapter to retrieve a collection of Tableau CRM dataflow job nodes.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_wire_adapters_get_dataflow_job_nodes
     *
     * @param dataflowjobId The ID of the dataflow job.
     */
    export function getDataflowJobNodes(dataflowjobId: string): void;

    /**
     * Wire adapter to retrieve a collection of Tableau CRM dataflow jobs.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_wire_adapters_get_dataflow_jobs
     *
     * @param dataflowId Filters the collection to only contain dataflow jobs tied to this specific dataflow. The ID must start with '02K'.
     * @param licenseType The response includes dataflow jobs with this license type. Valid values are `EinsteinAnalytics` or `Sonic`.
     * @param page Generated token that indicates the view of dataflow jobs to be returned.
     * @param pageSize Number of items to be returned in a single page. Minimum is 1, maximum is 200, and the default is 25.
     * @param q Search terms. Individual terms are separated by spaces. A wildcard is automatically appended to the last token in the query string.
     *          If the user’s search query contains quotation marks or wildcards, those symbols are automatically removed from the query string in
     *          the URI along with any other special characters.
     * @param status Filters the collection to only contain dataflow jobs with a specific runtime status.
     *               Valid values are `Failure`, `Queued`, `Running`, `Success`, or `Warning`.
     */
    export function getDataflowJobs(dataflowId?: string, licenseType?: string, page?: string, pageSize?: number, q?: string, status?: string): void;

    /**
     * Wire adapter to retrieve a collection of Tableau CRM dataflows.
     *
     * @param q Search terms. Individual terms are separated by spaces. A wildcard is automatically appended to the last token in the query string.
     *          If the user’s search query contains quotation marks or wildcards, those symbols are automatically removed from the query string in
     *          the URI along with any other special characters.
     */
    export function getDataflows(q?: string): void;

    /**
     * Wire adapter to retrieve a specific Tableau CRM dataset by ID or developer name.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_wire_adapters_get_dataset
     *
     * @param datasetIdOrApiName The ID or developer name of the dataset.
     */
    export function getDataset(datasetIdOrApiName: string): void;

    /** Wire adapter to retrieve a collection of Tableau CRM datasets.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_wire_adapters_get_datasets
     *
     * @param datasetTypes Filters the collection to include only datasets of one or more of the specified types.
     *                     Valid values are `Default`, `Live`, or `Trended`.
     * @param folderId Filters the collection to only contain datasets for the specified folder. The ID can be the requesting user's ID for
     *                 datasets in the user's private folder.
     * @param hasCurrentOnly Filters the collection of datasets to include only those datasets that have a current version. The default is `false`.
     * @param includeCurrentVersion Specifies if the response should include the current version metadata. The default is `false`.
     * @param licenseType The response includes dataflow jobs with this license type. Valid values are `EinsteinAnalytics` or `Sonic`.
     * @param order Ordering to apply to the collection results. Valid values are `Ascending` or `Descending`.
     * @param page Generated token that indicates the view of datasets to be returned.
     * @param pageSize Number of items to be returned in a single page. Minimum is 1, maximum is 200, and the default is 25.
     * @param q Search terms. Individual terms are separated by spaces. A wildcard is automatically appended to the last token in the query string.
     *          If the user’s search query contains quotation marks or wildcards, those symbols are automatically removed from the query string in
     *          the URI along with any other special characters.
     * @param scope Scope type to apply to the collection results.
     *              Valid values are `CreatedByMe`, `Favorites`, `IncludeAllPrivate`, `Mru` (Most Recently Used), or `SharedWithMe`.
     * @param sort Sort order to apply to the collection results.
     *             Valid values are `CreatedBy`, `CreatedDate`, `LastModified`, `LastQueried`, `LastRefreshed`,
     *             `Mru` (Most Recently Used, last viewed date), `Name`, or `TotalRows`.
     */
    export function getDatasets(
        datasetTypes?: string,
        folderId?: string,
        hasCurrentOnly?: boolean,
        includeCurrentVersion?: boolean,
        licenseType?: string,
        order?: string,
        page?: string,
        pageSize?: number,
        q?: string,
        scope?: string,
        sort?: string,
    ): void;

    /**
     * Wire adapter to retrieve a specific Tableau CRM data prep recipe by ID.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_wire_adapters_get_recipe
     *
     * @param id The ID of the recipe.
     * @param format Specifies the format of the returned recipe. Valid values are `R2 or `R3`. The default is `R3`.
     */
    export function getRecipe(id: string, format?: string): void;

    /**
     * Wire adapter to retrieve a collection of Tableau CRM data prep recipes.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_wire_adapters_get_recipes
     *
     * @param format Filters the collection to include only recipes of the specified format. Valid values are `R2` or `R3`.
     * @param licenseType The response includes dataflow jobs with this license type. Valid values are `EinsteinAnalytics` or `Sonic`.
     * @param page Generated token that indicates the view of recipes to be returned.
     * @param pageSize Number of items to be returned in a single page. Minimum is 1, maximum is 200, and the default is 25.
     * @param q Search terms. Individual terms are separated by spaces. A wildcard is automatically appended to the last token in the query string.
     *          If the user’s search query contains quotation marks or wildcards, those symbols are automatically removed from the query string in
     *          the URI along with any other special characters.
     * @param sort Sort order to apply to the collection results.
     *             Valid values are `LastModified`, `LastModifiedBy`, `Mru` (Most Recently Used, last viewed date), or `Name`.
     */
    export function getRecipes(format?: string, licenseType?: string, page?: string, pageSize?: number, q?: string, sort?: string): void;

    /**
     * Wire adapter to retrieve a specific Tableau CRM replicated dataset by ID.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_wire_adapters_get_replicated_dataset
     *
     * @param id The ID of the replicated dataset.
     */
    export function getReplicatedDataset(id: string): void;

    /**
     * Wire adapter to retrieve a collection of Tableau CRM replicated datasets, also known as connected objects.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_wire_adapters_get_replicated_datasets
     *
     * @param category Filters the collection to include only connected objects of the specified category. Valid values are `Input` or `Output`.
     * @param connector Filters the collection to include only connected objects belonging to the specified Tableau CRM connector.
     * @param sourceObject Filters the collection to include only connected objects belonging to the specified source object.
     */
    export function getReplicatedDatasets(category?: string, connector?: string, sourceObject?: string): void;

    /**
     * Wire adapter to retrieve a list of fields for the specified connected object.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_wire_adapters_get_replicated_fields
     *
     * @param id The ID of the replicated dataset.
     */
    export function getReplicatedFields(id: string): void;

    /**
     * Wire adapter to retrieve a schedule for a Tableau CRM recipe, dataflow, or data sync.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_wire_adapters_get_schedule
     *
     * @param assetId The ID of the dataflow, recipe, or data sync.
     */
    export function getSchedule(assetId: string): void;

    /**
     * Wire adapter to retrieve a collection of Tableau CRM apps or folders.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_wire_adapters_get_wave_folders
     *
     * @param isPinned Filters the collection to include only folders which are pinned (`true`) or not (`false`). The default is `false`.
     * @param mobileOnlyFeaturedAssets Filters the collection to only contain folders which contain dashboards that are enabled for the
     *                                 Tableau CRM mobile app. The default is `false`.
     * @param page Generated token that indicates the view of folders to be returned.
     * @param pageSize Number of items to be returned in a single page. Minimum is 1, maximum is 200, and the default is 25.
     * @param q Search terms. Individual terms are separated by spaces. A wildcard is automatically appended to the last token in the query string.
     *          If the user’s search query contains quotation marks or wildcards, those symbols are automatically removed from the query string in
     *          the URI along with any other special characters.
     * @param scope Scope type to apply to the collection results.
     *              Valid values are `CreatedByMe`, `Favorites`, `IncludeAllPrivate`, `Mru` (Most Recently Used), or `SharedWithMe`.
     * @param sort Sort order to apply to the collection results.
     *             Valid values are `LastModified`, `LastModifiedBy`, `Mru` (Most Recently Used, last viewed date), or `Name`.
     * @param templateSourceId Filters the collection to include only folders that are created from a specific template source
     */
    export function getWaveFolders(
        isPinned?: boolean,
        mobileOnlyFeaturedAssets?: boolean,
        page?: string,
        pageSize?: number,
        q?: string,
        scope?: string,
        sort?: string,
        templateSourceId?: string,
    ): void;

    /**
     * Wire adapter to retrieve a specific Tableau CRM extended metadata type (Xmd) for a version of a dataset.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_wire_adapters_get_xmd
     *
     * @param datasetIdOrApiName The ID or developer name of the dataset.
     * @param versionId The ID of the dataset version.
     * @param xmdType The xmd type. Valid values are `Asset`, `Main`, `System`, or `User`.
     */
    export function getXmd(datasetIdOrApiName: string, versionId: string, xmdType: string): void;

    /**
     * Wire adapter to trigger the Tableau CRM connector to run a data sync. This API is the equivalent of the “Run Now” UI feature.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_analytics_ingest_data_connector
     *
     * @param connectorIdOrApiName The ID or developer name of the dataset.
     * @return A promise that will resolve to the ingest data connector response.
     */
    export function ingestDataConnector({ connectorIdOrApiName }: { connectorIdOrApiName: string }): Promise<RestoreDatasetVersionRepresentation>;

    /**
     * Wire adapter to updates Tableau CRM connectors.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_analytics_update_data_connector
     *
     * @param connectorIdOrApiName The ID or developer name of the dataset.
     * @param dataConnector.connectionProperties Connection properties for the connector.
     * @param dataConnector.connectorHandler Third party driver used for connection.
     * @param dataConnector.connectorType The type of the Data Connector.
     * @param dataConnector.folder Folder for the Live connector.
     * @param dataConnector.targetConnector AssetReference containing ID or API name of target connector associated with the current source connector.
     * @return A promise that will resolve to the data connector response.
     */
    export function updateDataConnector({
        connectorIdOrApiName,
        dataConnector,
    }: {
        connectorIdOrApiName: string;
        dataConnector: DataConnectorInputRepresentation;
    }): Promise<DataConnectorRepresentation>;

    /**
     * Updates a Tableau CRM dataflow job, which is the equivalent of clicking Stop for a data prep recipe, a data sync, or a dataflow in the Tableau CRM Data Manager UI.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_analytics_update_dataflow_job
     *
     * @param dataflowJobId The dataflow job ID.
     * @param dataflowJob.command The job command to execute. Must be `stop` to update a dataflow job.
     * @return A promise that will resolve to the dataflow job response.
     */
    export function updateDataflowJob({
        dataflowJobId,
        dataflowJob,
    }: {
        dataflowJobId: string;
        dataflowJob: DataflowJobInputRepresentation;
    }): Promise<DataflowJobRepresentation>;

    /**
     * Wire adapter to update the Tableau CRM replicated dataset.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_analytics_update_replicated_dataset
     *
     * @param id The ID of the replicated dataset.
     * @param replicatedDataset.advancedProperties List of user-specified advanced properties associated with this.
     * @param replicatedDataset.connectionMode Connection mode for pulling the data from the replicated dataset.
     * @param replicatedDataset.connectorId The id of the connector object used to replicate.
     * @param replicatedDataset.fullRefresh Whether to perform a one-time full refresh (during the next run) as opposed to incremental.
     * @param replicatedDataset.passThroughFilter Passthrough filter for the replicated object.
     * @param replicatedDataset.rowLevelSharing Inherit row level sharing rules for this object.
     * @param replicatedDataset.sourceObjectName The name of the source object to be replicated.
     * @return A promise that will resolve to the replicated dataset response.
     */
    export function updateReplicatedDataset({
        id,
        replicatedDataset,
    }: {
        id: string;
        replicatedDataset: ReplicatedDatasetInputRepresentation;
    }): Promise<ReplicatedDatasetRepresentation>;

    /**
     * Wire adapter to update the Tableau CRM replicated fields.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_analytics_update_replicated_dataset_fields
     *
     * @param id The ID of the replicated dataset.
     * @param replicatedFields.fields A list of configuration metadata that specifies how to replicate each field of a Replicated Dataset.
     * @return A promise that will resolve to the replicated fields response.
     */
    export function updateReplicatedFields({
        id,
        replicatedFields,
    }: {
        id: string;
        replicatedFields: ReplicatedFieldCollectionInputRepresentation;
    }): Promise<ReplicatedFieldCollectionRepresentation>;

    /**
     * Updates the schedule for a Tableau CRM data prep recipe, data sync, or dataflow.
     *
     * https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_analytics_update_schedule
     *
     * @param assetId The ID of the dataflow, recipe, or data sync.
     * @param schedule The schedule to create or update for the dataflow, recipe, or data sync. Use a
     *                 {@link https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_appendix.htm#ScheduleInputRepresentation|ScheduleInputRepresentation}.
     *                 Schedules are hourly, daily, weekly, monthly (relative), monthly (specific), and event based.
     * @return A promise that will resolve to the schedule response.
     */
    export function updateSchedule({
        assetId,
        schedule,
    }: {
        assetId: string;
        schedule: ScheduleInputRepresentation;
    }): Promise<
        | DailyScheduleRepresentation
        | EmptyScheduleRepresentation
        | EventDrivenScheduleRepresentation
        | HourlyScheduleRepresentation
        | MinutelyScheduleRepresentation
        | MonthlyRelativeScheduleRepresentation
        | MonthlySpecificScheduleRepresentation
        | WeeklyScheduleRepresentation
    >;
}
