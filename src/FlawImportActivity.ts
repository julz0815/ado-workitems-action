/*******************************************************************************
* Copyright (c) 2017 Veracode, Inc. All rights observed.
*
* Available for use by Veracode customers as described in the accompanying license agreement.
*
* Send bug reports or enhancement requests to support@veracode.com.
*
* See the license agreement for conditions on submitted materials.
******************************************************************************/

import * as core from '@actions/core';
import * as q from 'q';
import * as CommonData from './Common';
import { FlawManager } from './FlawManager';
import { InputsManager } from './InputsManager';
import * as veracodeBridgeConnector from './VeracodeBridge';
import * as WICreator from './WorkItemCreator';

/**
 * import work items from Veracode application according to  provided parameters
 */
export class FlawImporter {
    private wICoA: WICreator.WorkItemCreatoroAuth | undefined;
    private veracodeBridgeData: veracodeBridgeConnector.VeracodeBridge | undefined;
    private commonHelper: CommonData.CommonHelper;
    private inputsManager: InputsManager;
    private flawManager: FlawManager;
    private failBuildIfFlawImporterBuildStepFails: boolean = false;
    constructor() {
        console.log("Importing Flaws in Progress...");
        this.commonHelper = new CommonData.CommonHelper();
        this.inputsManager = new InputsManager();
        this.flawManager = new FlawManager();
    }

    /**
     * Creating work Items for flaws obtained according to user defined parameters
     */
    public async createWorkItems() {

        core.debug("Class Name: FlawImporter, Method Name: createWorkItems");
        let self = this;
        let customProcessTemplateDataDto: CommonData.CustomProcessTemplateDataDto = new CommonData.CustomProcessTemplateDataDto();
        // Retrieve all parameters from main UI
        let importParameters = this.inputsManager.retrieveInputs();
        this.failBuildIfFlawImporterBuildStepFails = importParameters.FailBuildIfFlawImporterBuildStepFails;
        let projectName = this.getTeamProjectName(importParameters.AreaPath);

        // Custom process template - not used in GitHub Actions, using defaults
        customProcessTemplateDataDto.TemplateType = CommonData.Constants.string_undefined;

        if (!projectName || projectName == "") {
            this.commonHelper.handleError(null, "Invalid project name found. Please check the Area Path field and try again.", this.failBuildIfFlawImporterBuildStepFails);
        }

        if (importParameters.IsValidationsSuccess) {

            customProcessTemplateDataDto.CustomFields = importParameters.CustomFields;

            this.wICoA = new WICreator.WorkItemCreatoroAuth(importParameters, importParameters.AdoProject);
            //Wait till the project id is set
            await this.wICoA.setProjectId().catch(function (error) {
                console.log("Error occured while finding the Project Id");
                core.debug(error);
            });
            //Wait till the template is identified
            await this.wICoA.manageProcessTemplateData(customProcessTemplateDataDto);

            let isValidAreaPath = await this.wICoA.isValidPath(importParameters.AreaPath, "area");
            let isValidIterationPath = await this.wICoA.isValidPath(importParameters.IterationPath, "iteration");

            if (isValidAreaPath && isValidIterationPath) {
                const scanDetails = await self.obtainPrerequisites(importParameters);
                if (scanDetails) {
                    const workItemData = await self.retrieveWorkItemsData(scanDetails, importParameters);
                    //Create Work items
                    console.log("Creating workitems...");
                    if (self.wICoA) {
                        self.wICoA.createWorkItems(workItemData);
                        // build keys for flaw disappearance logic
                        const currentFlawKeys = workItemData.WorkItemList.map(flaw => {
                            const cve = flaw.Tags.find(tag => tag.startsWith("CVE"));
                            const component = flaw.Tags[0];
                            return `${cve}_${component}`;
                        });
                    }
                } else {
                    console.info("Scan Details Not Found. Flaw Import Task Will be Processed.")
                }
            } else {
                if (!isValidAreaPath)
                    this.commonHelper.handleError(null, "Invalid area path.", this.failBuildIfFlawImporterBuildStepFails);
                else {
                    this.commonHelper.handleError(null, "Invalid iteration path.", this.failBuildIfFlawImporterBuildStepFails);
                }
            }
        } else {
            this.commonHelper.handleError(null, "Invalid input.", this.failBuildIfFlawImporterBuildStepFails);
        }
    }

    /**
     * Obtain user inputs from  pre-defined variables and
     * populate in custom process template DTO
     * @param customProcessTemplateDataDto : holds data about custom process template
     */
    private populateCustomProcessTemplateSettings(
        customProcessTemplateDataDto: CommonData.CustomProcessTemplateDataDto):
        q.Promise<CommonData.CustomProcessTemplateDataDto> {

        core.debug("Class Name: FlawImporter, Method Name: createWorkItems");
        let deferred = q.defer<CommonData.CustomProcessTemplateDataDto>();
        try {
            customProcessTemplateDataDto.TemplateType = CommonData.Constants.processTemplate_Custom;
            if (core.getInput("customPTActiveStatus")) {
                customProcessTemplateDataDto.CustomPTActiveStatus = core.getInput("customPTActiveStatus");
                core.debug(`customPTActiveStatus : ${customProcessTemplateDataDto.CustomPTActiveStatus}`);
            }
            if (core.getInput("customPTCloseStatus")) {
                customProcessTemplateDataDto.CustomPTCloseStatus = core.getInput("customPTCloseStatus");
                core.debug(`customPTCloseStatus : ${customProcessTemplateDataDto.CustomPTCloseStatus}`);
            }
            if (core.getInput("customPTNewStatus")) {
                customProcessTemplateDataDto.CustomPTNewStatus = core.getInput("customPTNewStatus");
                core.debug(`customPTNewStatus : ${customProcessTemplateDataDto.CustomPTNewStatus}`);
            }
            if (core.getInput("customPTResolvedStatus")) {
                customProcessTemplateDataDto.CustomPTRessolvedStatus = core.getInput("customPTResolvedStatus");
                core.debug(`customPTResolvedStatus : ${customProcessTemplateDataDto.CustomPTRessolvedStatus}`);
            }
            // Design state is optional as it does not available in all work-item types
            if (core.getInput("customPTDesignStatus")) {
                customProcessTemplateDataDto.CustomPTDesignStatus = core.getInput("customPTDesignStatus");
                core.debug(`customPTDesignStatus : ${customProcessTemplateDataDto.CustomPTDesignStatus}`);
            }
            if (core.getInput("customWorkItemType")) {
                customProcessTemplateDataDto.WorkItemType = core.getInput("customWorkItemType");
                core.debug(`customWorkItemType : ${customProcessTemplateDataDto.WorkItemType}`);
            } else {
                console.log(" If you are using custom process templates, you must define the workitem type in pre-defined variables section.");
            }
            deferred.resolve(customProcessTemplateDataDto);
        } catch (error) {
            deferred.reject(false);
            this.commonHelper.handleError(error, "Error Occurred While populating custom workitem data.", this.failBuildIfFlawImporterBuildStepFails);
        }
        return deferred.promise;
    }

    /**
     * Create work items according to  veracode scan flaws
     * @param {CommonData.ScanDto} scanDetails - Consists of details required to obtain work item information.
     * @param {Facilitator.ScanParametersDto} scanParameters - All parameters required to call Wrapper Methods.
     * @return {q.Promise<CommonData.workItemsDataDto>} - Promise consist of workitem details
     */
    async retrieveWorkItemsData(
        scanDetails: CommonData.ScanDto,
        importParameters: CommonData.FlawImporterParametersDto): Promise<CommonData.workItemsDataDto> {

        core.debug("Class Name: FlawImporter, Method Name: retrieveWorkItemsData");
        importParameters.ApiAction = CommonData.Constants.apiAction_GetDetailedReport;
        try {
            if (this.veracodeBridgeData) {
                let reportDetails = await this.veracodeBridgeData.downloadAndReadDetailedReportData(scanDetails.BuildId, importParameters);
                return await this.flawManager.manageFlaws(scanDetails, importParameters, reportDetails);
            }
            return new CommonData.workItemsDataDto();
        } catch (error) {
            this.commonHelper.handleError(error, "Mapping detailed flaw details failed", this.failBuildIfFlawImporterBuildStepFails);
            return new CommonData.workItemsDataDto();
        }
    }

    /**
    * Gather required details for initiate veracode scan
    * @param {Facilitator.ScanParametersDto} scanParameters - All parameters required to call Wrapper Methods.
    * @return {q.Promise<CommonData.ScanDto>}  - Promise with scan details.
    */
    public async obtainPrerequisites(
        importParameters: CommonData.FlawImporterParametersDto): Promise<CommonData.ScanDto> {

        core.debug("Class Name: FlawImporter, Method Name: obtainPrerequisites");
        this.veracodeBridgeData = new veracodeBridgeConnector.VeracodeBridge(importParameters);
        let scanDetails = new CommonData.ScanDto();

        try {
            if (this.isInvalidAppName(importParameters)) {
                this.commonHelper.handleError(null, CommonData.Constants.InvalidVeracodeApplicationName, importParameters.FailBuildIfFlawImporterBuildStepFails);
            }
            if (importParameters.VeracodeAppProfile.length > CommonData.Constants.MaxCharactersAllowedInApplicationName) {
                this.commonHelper.handleError(null, CommonData.Constants.ApplicationNameTooLong, importParameters.FailBuildIfFlawImporterBuildStepFails);
            }
            if (this.veracodeBridgeData) {
                scanDetails.AnalysisCenterUrl = await this.veracodeBridgeData.getAnalysisCenterUrl(importParameters);
                importParameters.ApiAction = CommonData.Constants.apiAction_GetApplist;
                await this.veracodeBridgeData.getAppInfo(scanDetails, importParameters);
                if (!scanDetails.Appid) {
                    return scanDetails;
                }
                let latestScan = new CommonData.ScanDto();
                if (importParameters.SandboxName && importParameters.SandboxName.length > CommonData.Constants.MaxCharactersAllowedInSandboxName) {
                    this.commonHelper.setTaskFailure(CommonData.Constants.SandboxNameTooLong)
                }
                if (!importParameters.SandboxId && importParameters.SandboxName) {
                    importParameters.ApiAction = CommonData.Constants.apiAction_GetSandBoxlist;
                    await this.veracodeBridgeData.getSandboxInfo(scanDetails.Appid.toString(), importParameters);
                }
                if ((importParameters.SandboxId && importParameters.SandboxName) || !importParameters.SandboxName) {
                    latestScan = await this.veracodeBridgeData.getLatestBuild(scanDetails, importParameters);
                } else {
                    this.commonHelper.handleError(null, "Invalid sandbox", this.failBuildIfFlawImporterBuildStepFails);
                }
                latestScan.AnalysisCenterUrl = scanDetails.AnalysisCenterUrl;
                return latestScan;
            }
            return scanDetails;

        } catch (error) {
            this.commonHelper.handleError(error, "Obtaining application details failed.", this.failBuildIfFlawImporterBuildStepFails);
            return scanDetails;
        }
    }

    /**
     * Extracts the team project name from the Area field
     * @param {string} inputString - Input string from Area field
     * @returns {string} teamName - Name of the team project
     */
    private getTeamProjectName(inputString: string): string {

        core.debug("Class Name: FlawImporter, Method Name: getTeamProjectName");
        let projectName;
        let projectNameEndIndex = inputString.indexOf('\\');

        if (inputString != undefined && inputString != "") {
            if (projectNameEndIndex < 0) {
                //Only project name is given.
                projectName = inputString;
            }
            else {
                projectName = inputString.substring(0, projectNameEndIndex);
            }
            console.log(`Extracted project name: ${projectName}`);
        }

        return projectName || "";
    }

    /**
     * Checks whether Application name is valid
     * @param importParameters - user inputs
     * @returns - Whether application name is valid
     */
    private isInvalidAppName(importParameters: CommonData.FlawImporterParametersDto) {

        core.debug("Class Name: FlawImporter, Method Name: isInvalidAppName");
        return importParameters.VeracodeAppProfile.search(CommonData.Constants.GreaterThanSymbol) != -1 || importParameters.VeracodeAppProfile.search(CommonData.Constants.LessThanSymbol) != -1;
    }
}