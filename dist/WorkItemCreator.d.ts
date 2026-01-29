/*******************************************************************************
* Copyright (c) 2017 Veracode, Inc. All rights observed.
*
* Available for use by Veracode customers as described in the accompanying license agreement.
*
* Send bug reports or enhancement requests to support@veracode.com.
*
* See the license agreement for conditions on submitted materials.
******************************************************************************/
import { CoreApi } from 'azure-devops-node-api/CoreApi';
import * as vss from 'azure-devops-node-api/interfaces/common/VSSInterfaces';
import * as wi from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import * as vm from 'azure-devops-node-api/WebApi';
import * as wa from 'azure-devops-node-api/WorkItemTrackingApi';
import * as CommonData from './Common';
interface WorkItemParameters {
    projectName: string;
    witype: string;
    title: string;
    description: string;
    severity: string;
    area: string;
    foundInBuild: string;
    tagsCollection: string[];
    state: string;
    wiComments: string;
    overwriteAreaPathInWorkItemsOnImport: boolean;
    iterationPath: string;
    overwriteIterationPathInWorkItemsOnImport: boolean;
}
interface WorkItemJson {
    witype: string;
    title: string;
    description: string;
    severity: string;
    area: string;
    foundInBuild: string;
    tagsCollection: string[];
    wiComments: string;
    iterationPath: string;
}
/**
 * Manipulate Main Functionalities related to workItem creation For OAuth Authentication
 */
export declare class WorkItemCreatoroAuth {
    accessToken: string;
    collectionUrl: string;
    projectId: string;
    projName: string;
    vstsWI: wa.IWorkItemTrackingApi;
    workItemType: string;
    vstsCore: CoreApi;
    processTemplate: string;
    workItemStateActive: string;
    workItemStateClosed: string;
    workItemStateDesign: string;
    workItemStateNew: string;
    workItemStateResolved: string;
    private connection;
    commonActivity: CommonData.CommonHelper;
    addCustomFields: vss.JsonPatchOperation[];
    private failBuildIfFlawImporterBuildStepFails;
    constructor(importParameters: CommonData.FlawImporterParametersDto, projectName: string);
    setVstsCoreApi(connection: vm.WebApi): Promise<CoreApi>;
    setVstsIWorkItemTrackingApi(connection: vm.WebApi): Promise<wa.IWorkItemTrackingApi>;
    /**
     * Check process template of current project and manage data
     * @param customProcessTemplateDataDto - custom process template data
     */
    manageProcessTemplateData(customProcessTemplateDataDto: CommonData.CustomProcessTemplateDataDto): Promise<void>;
    /**
     * Arrange custom field data to concatinate with patch json document
     * @param customFields - user provided custom fileds
     */
    private arrangeAndPopulateCustomFieldData;
    /**
     * Assign status of work items
     * @param customProcessTemplateDataDto - custom process tempalte data
     */
    private assignWiStatus;
    /**
     * Handles status of agile process templete
     */
    private handleAgileWorkItemStatus;
    /**
     * Handles status of Scrum process templete
     */
    private handleScrumWorkItemStatus;
    /**
     * Handles status of basic process templete
     */
    private handleBasicWorkItemStatus;
    /**
     * Handles status of CMMI process templete
     */
    private handleCMMIWorkItemStatus;
    /**
     * Handles status of customized process templete
     */
    private handleCustomWorkItemStatus;
    /**
     * Manage work Item creation
     * @param flawDetails - details of flaw from veracode platform
     * @param flawItem - Current flaw item related data
     */
    manageCreateWorkItem(flawDetails: CommonData.workItemsDataDto, flawItem: CommonData.WorkItemDto): Promise<boolean>;
    /**
     * Manage work Item update activities
     * @param workItemDetails - details of flaw from veracode platform
     * @param flawItem - Current flaw item related data
     * @param workItemRef - Current WorkItem details retrieved from the server
     */
    manageUpdateWorkItem(workItemDetails: CommonData.workItemsDataDto, flawItem: CommonData.WorkItemDto, workItemRef: wi.WorkItemReference): Promise<boolean>;
    /**
     * Check whether there is new comments available in flaw and composes new history for workitem
     * @param history - Current immediate history of workitem
     * @param flawComments - All comments of the flaw
     * @param state work item state
     * @returns - New flaw comments
     */
    private getStaticAndDynamicNewComments;
    /**
     * Change status of workitem
     * @param retrievedWi  Current workitem data
     * @param workItemDetails details of flaw from veracode platform
     * @param flawItem Current flaw item related data
     * @param workItemRef workitem
     */ handleWorkItemStatus(retrievedWi: wi.WorkItem, workItemDetails: CommonData.workItemsDataDto, flawItem: CommonData.WorkItemDto, workItemRef: wi.WorkItemReference): Promise<boolean>;
    /**
     * Create Work Items for retrieved flaws
     * */
    createWorkItems(workItemDetails: CommonData.workItemsDataDto): Promise<void>;
    /**
    * validate unsupported workitem type that belongs to particular process template
    */
    private validateSupportedWITypes;
    /**
     * Manage unmitigated flaw creation
     *  @param {CommonData.WorkItemDto} flawItem  - Flaw details
     *  @param {CommonData.workItemsDataDto} workItemDetails - Details of all vulnerabilities
     */
    handleUnmitigatedFlawsCreation(flawItem: CommonData.WorkItemDto, workItemDetails: CommonData.workItemsDataDto): Promise<boolean>;
    /**
     * Mange Policy violated Flaw creation
     *  @param {CommonData.WorkItemDto} flawItem  - Flaw details
     *  @param {CommonData.workItemsDataDto} workItemDetails - Details of all vulnerabilities
     */
    handlePolicyViolatedandAllFlawsCreation(flawItem: CommonData.WorkItemDto, workItemDetails: CommonData.workItemsDataDto): Promise<boolean>;
    /**
     * Get Work Item for given Id
     * @param {number} workItemId - Id of the work item to retrieve
     * @param {string[]} fields - WI fields to retrieve
     */
    getWorkItemById(workItemId: number, fields: string[]): Promise<wi.WorkItem>;
    /**
     * Validate area or iteration path
     * @param {string} fullPath - Path string to validate
     * @param {string} pathType - area or iteration
     */
    isValidPath(fullPath: string, pathType: string): Promise<boolean>;
    /**
     * Checks whether classification node found
     * @param path - path value
     * @param deferred - deferred
     * @param pathType - area or iteration
     */
    private validateClassificationNode;
    /**
     * Checks whether root node found
     * @param rootNodePath - path value
     * @param deferred - deferred
     * @parm pathType - area or iteration
     */
    private validateRootNode;
    /**
     * Create Work Item
     * @param {string} projectName - Project name which work item should be created.
     * @param {string} witype - Work item type (bug, issue etc.)
     * @param {string} title - Title of the work item
     * @param {string} description - Description of the work item
     * @param {string} severity - Severity of the work item
     * @param {string} area - Area Path of the work item
     * @param {string} foundInBuild - FoundInBuild of the work item
     * @param {string[]} tagsCollection - Tags of the work item
     * @param {string} state - State of the work item
     * @param {string} wiComments -  work item comments
     * @param overwriteAreaPathInWorkItemsOnImport determines whether area path field needs to overwrite in the WorkItem
     * @param overwriteIterationPathInWorkItemsOnImport determines whether iteration path field needs to overwrite in the WorkItem
     * @param {string} fixByDate -  Due Date for the ticket based on the Fix By Date for the finding, null if the Due Date
     */
    createWorkitem({ projectName, witype, title, description, severity, area, foundInBuild, tagsCollection, state, wiComments, overwriteAreaPathInWorkItemsOnImport, iterationPath, overwriteIterationPathInWorkItemsOnImport }: WorkItemParameters): Promise<boolean>;
    /**
     * manage actions on create and update workitems
     * @param wijson Json data
     * @param projectName Project name
     * @param witype Workitem type
     * @param state Workitem state
     * @param title Workitem title
     * @param area Area path
     * @param overwriteAreaPathInWorkItemsOnImport determines whether area path field needs to overwrite in the WorkItem
     * @param wiComments flaw comments
     * @param buildVersion Veracode scan version
     * @param overwriteIterationPathInWorkItemsOnImport determines whether iteration path field needs to overwrite in the WorkItem
     */
    manageCreateandUpdateWorkItem(wijson: vss.JsonPatchDocument, projectName: string, witype: string, state: string, title: string, area: string, overwriteAreaPathInWorkItemsOnImport: boolean, wiComments: string | null, buildVersion: string, iterationPath: string, overwriteIterationPathInWorkItemsOnImport: boolean): Promise<boolean>;
    /**
     * Performs post work item creation activities
     * @param state - Work item status
     * @param workitem - work item data
     * @param area - area path
     * @param overwriteAreaPathInWorkItemsOnImport - should area path overwrite on import
     * @param wiComments - work item comment
     * @param buildVersion - build version
     * @param overwriteIterationPathInWorkItemsOnImport - should iteration path overwrite on import
     */
    private performPostWorkItemCreationActivities;
    /**
     * Get Workitems
     * @param {string} projectName - Name of the project to retrieve work items
     * @param {string} teamProjectId - Team project Id
     * @param {string} title - WorkItem title
     */
    getWorkitem(projectName: string, teamProjectId: string, title: string): Promise<wi.WorkItemQueryResult>;
    /**
     * Updates Workitem State
     * @param id - Id of the WorkItem to update
     * @param state -  State to be updated
     * @param area - Area path of the WorkItem
     * @param overwriteAreaPathInWorkItemsOnImport - Determines whether area path field needs to overwrite in the WorkItem
     * @param flawComments - flaw comments
     * @param workItem - work item data
     * @param buildVersion - Veracode scan version
     * @param overwriteIterationPathInWorkItemsOnImport - Determines whether iteration path field needs to overwrite in the WorkItem
     */
    updateWorkitemState(id: number, state: string, area: string, overwriteAreaPathInWorkItemsOnImport: boolean, flawComments: string | null, workItem: wi.WorkItem, buildVersion: string, iterationPath: string, overwriteIterationPathInWorkItemsOnImport: boolean, patchDocument?: vss.JsonPatchOperation[]): Promise<void>;
    /**
     * Handles updates for work item comments
     * @param workItem Work item data
     * @param flawComments Latest comments from the flaw
     * @param buildVersion Veracode scan version
     * @param state Current state of the work item
     * @returns new comments
     */
    private handleWorkItemCommentUpdates;
    /**
     * Get new SCA flaw comments
     * @param history Last comment of the work item
     * @param flawComments Full flaw comments
     * @param buildVersion Veracode Scan version
     * @param state work item state
     * @returns New flaw comments
     */
    getSCANewComments(history: string | null, flawComments: string | null, buildVersion: string, state: string): string | null;
    /**
     * Update Workitem comments : TODO : This code will be modified and used when implementing flaw comment upload scenario
     * @param {number} id - Id of the work item to update
     * @param {string} wiComments - work item new comment
     */
    updateWorkitemComments(id: number, wiComments: string): Promise<void>;
    /**
     * Get Work Item Json Patch Document
     * @param {string} witype - Work item type (bug, issue etc.)
     * @param {string} title - Title of the work item
     * @param {string} description - Description of the work item
     * @param {string} severity - Severity of the work item
     * @param {string} area - Area Path of the work item
     * @param {string} foundInBuild - FoundInBuild of the work item
     * @param {string[]} tagsCollection - Tags of the work item
     * @param {string} wiComments - work item comments
     * @param {string} iterationPath - Iteration Path of the work item
     */
    getWorkItemJson({ witype, title, description, severity, area, foundInBuild, tagsCollection, wiComments, iterationPath }: WorkItemJson): Promise<vss.JsonPatchDocument>;
    /**
     * Get Promised Jsonn Patch document
     * @param {any} a - Array of work item fields fields
     */
    getPromiseWithJsonPatchDocument(a: any): Promise<vss.JsonPatchDocument>;
    /**
     * Sets project id when project name is given
     */
    setProjectId(): Promise<void>;
    /**
 * Extracts {CVE, component} from a WI title created by the importer.
 * Expected shape (case-insensitive, flexible spacing):
 *   "Component: <component text> has CVE Vulnerability CVE-YYYY-NNNN detected in Application: ..."
 *
 * Returns a key string "CVE-YYYY-NNNN_<component-lower>" or null if it can't parse.
 */
    private extractFlawKeyFromTitle;
    /**
     * Auto-closes work items whose (CVE, component) keys are NOT present in the latest scan.
     * - currentFlawKeys must contain keys built as `${CVE.toUpperCase()}_${component.toLowerCase()}`
     * - Filters by AppId in WIQL for single-app imports, but does not embed AppId in key comparison.
     */
    private ensureAppIdTag;
    getWorkItemsInBatches(api: wa.IWorkItemTrackingApi, ids: number[], fields?: string[], batchSize?: number): Promise<wi.WorkItem[]>;
}
export {};
//# sourceMappingURL=WorkItemCreator.d.ts.map