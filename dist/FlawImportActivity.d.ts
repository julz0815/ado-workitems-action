/*******************************************************************************
* Copyright (c) 2017 Veracode, Inc. All rights observed.
*
* Available for use by Veracode customers as described in the accompanying license agreement.
*
* Send bug reports or enhancement requests to support@veracode.com.
*
* See the license agreement for conditions on submitted materials.
******************************************************************************/
import * as CommonData from './Common';
/**
 * import work items from Veracode application according to  provided parameters
 */
export declare class FlawImporter {
    private wICoA;
    private veracodeBridgeData;
    private commonHelper;
    private inputsManager;
    private flawManager;
    private failBuildIfFlawImporterBuildStepFails;
    constructor();
    /**
     * Creating work Items for flaws obtained according to user defined parameters
     */
    createWorkItems(): Promise<void>;
    /**
     * Obtain user inputs from  pre-defined variables and
     * populate in custom process template DTO
     * @param customProcessTemplateDataDto : holds data about custom process template
     */
    private populateCustomProcessTemplateSettings;
    /**
     * Create work items according to  veracode scan flaws
     * @param {CommonData.ScanDto} scanDetails - Consists of details required to obtain work item information.
     * @param {Facilitator.ScanParametersDto} scanParameters - All parameters required to call Wrapper Methods.
     * @return {q.Promise<CommonData.workItemsDataDto>} - Promise consist of workitem details
     */
    retrieveWorkItemsData(scanDetails: CommonData.ScanDto, importParameters: CommonData.FlawImporterParametersDto): Promise<CommonData.workItemsDataDto>;
    /**
    * Gather required details for initiate veracode scan
    * @param {Facilitator.ScanParametersDto} scanParameters - All parameters required to call Wrapper Methods.
    * @return {q.Promise<CommonData.ScanDto>}  - Promise with scan details.
    */
    obtainPrerequisites(importParameters: CommonData.FlawImporterParametersDto): Promise<CommonData.ScanDto>;
    /**
     * Extracts the team project name from the Area field
     * @param {string} inputString - Input string from Area field
     * @returns {string} teamName - Name of the team project
     */
    private getTeamProjectName;
    /**
     * Checks whether Application name is valid
     * @param importParameters - user inputs
     * @returns - Whether application name is valid
     */
    private isInvalidAppName;
}
//# sourceMappingURL=FlawImportActivity.d.ts.map