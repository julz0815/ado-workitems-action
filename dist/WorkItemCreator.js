"use strict";
/*******************************************************************************
* Copyright (c) 2017 Veracode, Inc. All rights observed.
*
* Available for use by Veracode customers as described in the accompanying license agreement.
*
* Send bug reports or enhancement requests to support@veracode.com.
*
* See the license agreement for conditions on submitted materials.
******************************************************************************/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkItemCreatoroAuth = void 0;
const vss = __importStar(require("azure-devops-node-api/interfaces/common/VSSInterfaces"));
const vm = __importStar(require("azure-devops-node-api/WebApi"));
const core = __importStar(require("@actions/core"));
const q = __importStar(require("q"));
const CommonData = __importStar(require("./Common"));
const escapeTextUtility = __importStar(require("./EscapeTextUtility"));
let cleanser = new escapeTextUtility.Cleanser();
const fieldsToRetrieve = ["System.State", "System.Title", "System.Tags", "System.History", "Microsoft.VSTS.Common.Severity"];
/**
 * Manipulate Main Functionalities related to workItem creation For OAuth Authentication
 */
class WorkItemCreatoroAuth {
    constructor(importParameters, projectName) {
        console.log("Initializing Workitem Creator... \n" +
            "Retrieving environment values...");
        // Build collection URL from org name
        this.collectionUrl = `https://dev.azure.com/${importParameters.AdoOrg}`;
        this.projName = projectName;
        this.accessToken = importParameters.AdoToken;
        let creds = vm.getBearerHandler(this.accessToken);
        core.debug("creds value : " + creds);
        this.connection = new vm.WebApi(this.collectionUrl, creds);
        this.commonActivity = new CommonData.CommonHelper();
        this.workItemType = importParameters.WorkItemType;
        this.failBuildIfFlawImporterBuildStepFails = importParameters.FailBuildIfFlawImporterBuildStepFails;
        this.setVstsCoreApi(this.connection);
        this.setVstsIWorkItemTrackingApi(this.connection);
        console.log("Collection URL: " + cleanser.getCleansedText(this.collectionUrl) + "\n" +
            "Project Name: " + cleanser.getCleansedText(this.projName));
    }
    async setVstsCoreApi(connection) {
        try {
            this.vstsCore = await connection.getCoreApi();
        }
        catch (error) {
            this.commonActivity.handleError(error, "Error while setting the VstsCoreApi", this.failBuildIfFlawImporterBuildStepFails);
        }
        return this.vstsCore;
    }
    async setVstsIWorkItemTrackingApi(connection) {
        try {
            this.vstsWI = await connection.getWorkItemTrackingApi();
        }
        catch (error) {
            this.commonActivity.handleError(error, "Error while setting the WorkItemTrackingApi", this.failBuildIfFlawImporterBuildStepFails);
        }
        return this.vstsWI;
    }
    /**
     * Check process template of current project and manage data
     * @param customProcessTemplateDataDto - custom process template data
     */
    async manageProcessTemplateData(customProcessTemplateDataDto) {
        core.debug("Class Name : WorkItemCreatoroAuth , Method Name : checkTemplateandAssignWIStatus");
        try {
            let projectData = await this.vstsCore.getProject(this.projectId, true, true);
            let templateData = projectData.capabilities?.["processTemplate"];
            this.processTemplate = templateData?.["templateName"] || '';
            if (customProcessTemplateDataDto.TemplateType == CommonData.Constants.processTemplate_Custom) {
                this.processTemplate = CommonData.Constants.processTemplate_Custom;
            }
            this.assignWiStatus(customProcessTemplateDataDto);
            if (customProcessTemplateDataDto.CustomFields) {
                this.arrangeAndPopulateCustomFieldData(customProcessTemplateDataDto.CustomFields);
            }
        }
        catch (error) {
            this.commonActivity.handleError(error, "Error while obtaining project details", this.failBuildIfFlawImporterBuildStepFails);
        }
    }
    /**
     * Arrange custom field data to concatinate with patch json document
     * @param customFields - user provided custom fileds
     */
    arrangeAndPopulateCustomFieldData(customFields) {
        core.debug("Class Name : WorkItemCreatoroAuth , Method Name : arrangeCustomFieldData");
        this.addCustomFields = new Array(customFields.size);
        let currentIndex = 0;
        for (let customField of customFields.entries()) {
            let patchDocumentEntry = { "from": "", "op": vss.Operation.Add, "path": "/fields/" + customField[0], "value": customField[1] };
            this.addCustomFields[currentIndex] = patchDocumentEntry;
            currentIndex++;
        }
    }
    /**
     * Assign status of work items
     * @param customProcessTemplateDataDto - custom process tempalte data
     */
    assignWiStatus(customProcessTemplateDataDto) {
        core.debug("Class Name : WorkItemCreatoroAuth, Method Name : assignWiStatus");
        console.log("Process template name : " + this.processTemplate);
        switch (this.processTemplate) {
            case CommonData.Constants.processTemplate_Agile:
                this.handleAgileWorkItemStatus();
                break;
            case CommonData.Constants.processTemplate_Scrum:
                this.handleScrumWorkItemStatus();
                break;
            case CommonData.Constants.processTemplate_CMMI:
                this.handleCMMIWorkItemStatus();
                break;
            case CommonData.Constants.processTemplate_Custom:
                this.handleCustomWorkItemStatus(customProcessTemplateDataDto);
                break;
            case CommonData.Constants.processTemplate_Basic:
                this.handleBasicWorkItemStatus();
                break;
            default:
                this.commonActivity.setTaskFailure("Veracode does not support the "
                    + this.processTemplate
                    + " project template. By default, the Veracode Flaw Importer task only supports Basic, Agile, Scrum, or CMMI templates. If you are using custom process templates, you must define the required variables.");
                break;
        }
    }
    /**
     * Handles status of agile process templete
     */
    handleAgileWorkItemStatus() {
        core.debug("Class Name : WorkItemCreatoroAuth , Method Name : handleAgileWorkItemStatus");
        this.workItemStateActive = CommonData.Constants.wiStatus_Active;
        this.workItemStateClosed = CommonData.Constants.wiStatus_Closed;
        this.workItemStateDesign = CommonData.Constants.wiStatus_Design;
        this.workItemStateNew = CommonData.Constants.wiStatus_New;
        this.workItemStateResolved = CommonData.Constants.wiStatus_Resolved;
        if (this.workItemType == CommonData.Constants.wiType_Issue) {
            this.workItemStateNew = CommonData.Constants.wiStatus_Active;
        }
        if (this.workItemType == CommonData.Constants.wiType_TestCase) {
            this.workItemStateNew = CommonData.Constants.wiStatus_Design;
        }
    }
    /**
     * Handles status of Scrum process templete
     */
    handleScrumWorkItemStatus() {
        core.debug("Class Name : WorkItemCreatoroAuth , Method Name : handleScrumWorkItemStatus");
        this.workItemStateActive = CommonData.Constants.wiStatus_Committed;
        this.workItemStateDesign = CommonData.Constants.wiStatus_Design;
        this.workItemStateNew = CommonData.Constants.wiStatus_New;
        if (this.workItemType == CommonData.Constants.wiType_Task) {
            this.workItemStateNew = CommonData.Constants.wiStatus_ToDo;
        }
        if (this.workItemType == CommonData.Constants.wiType_TestCase) {
            this.workItemStateNew = CommonData.Constants.wiStatus_Design;
            this.workItemStateResolved = CommonData.Constants.wiStatus_Closed;
            this.workItemStateClosed = CommonData.Constants.wiStatus_Closed;
        }
        else {
            this.workItemStateResolved = CommonData.Constants.wiStatus_Done;
            this.workItemStateClosed = CommonData.Constants.wiStatus_Done;
        }
    }
    /**
     * Handles status of basic process templete
     */
    handleBasicWorkItemStatus() {
        core.debug("Class Name : WorkItemCreatoroAuth , Method Name : handleBasicWorkItemStatus");
        this.workItemStateActive = CommonData.Constants.wiStatus_Doing;
        this.workItemStateClosed = CommonData.Constants.wiStatus_Done;
        this.workItemStateNew = CommonData.Constants.wiStatus_ToDo;
    }
    /**
     * Handles status of CMMI process templete
     */
    handleCMMIWorkItemStatus() {
        core.debug("Class Name : WorkItemCreatoroAuth , Method Name : handleCMMIWorkItemStatus");
        this.workItemStateActive = CommonData.Constants.wiStatus_Active;
        this.workItemStateClosed = CommonData.Constants.wiStatus_Closed;
        this.workItemStateDesign = CommonData.Constants.wiStatus_Design;
        this.workItemStateNew = CommonData.Constants.wiStatus_Proposed;
        this.workItemStateResolved = CommonData.Constants.wiStatus_Resolved;
    }
    /**
     * Handles status of customized process templete
     */
    handleCustomWorkItemStatus(customPtocessTemplateDataDto) {
        core.debug("Class Name : WorkItemCreatoroAuth , Method Name : handleCustomWorkItemStatus");
        this.workItemType = customPtocessTemplateDataDto.WorkItemType;
        this.workItemStateActive = customPtocessTemplateDataDto.CustomPTActiveStatus;
        this.workItemStateClosed = customPtocessTemplateDataDto.CustomPTCloseStatus;
        this.workItemStateDesign = customPtocessTemplateDataDto.CustomPTDesignStatus;
        this.workItemStateNew = customPtocessTemplateDataDto.CustomPTNewStatus;
        this.workItemStateResolved = customPtocessTemplateDataDto.CustomPTRessolvedStatus;
    }
    /**
     * Manage work Item creation
     * @param flawDetails - details of flaw from veracode platform
     * @param flawItem - Current flaw item related data
     */
    async manageCreateWorkItem(flawDetails, flawItem) {
        core.debug("Class Name : WorkItemCreatoroAuth , Method Name : manageCreateWorkItem");
        let deferred = q.defer();
        try {
            switch (flawDetails.ImportType) {
                case CommonData.Constants.WorkItemImport_AllFlaws:
                    await this.handlePolicyViolatedandAllFlawsCreation(flawItem, flawDetails);
                    break;
                case CommonData.Constants.WorkItemImport_AllUnmitigatedFlaws:
                    if (flawItem.IsOpenAccordingtoMitigationStatus) {
                        await this.handleUnmitigatedFlawsCreation(flawItem, flawDetails);
                    }
                    break;
                case CommonData.Constants.WorkItemImport_AllFlawsThatViolatingPolicy:
                    if (flawItem.AffectedbyPolicy) {
                        await this.handlePolicyViolatedandAllFlawsCreation(flawItem, flawDetails);
                    }
                    break;
                case CommonData.Constants.WorkItemImport_AllUnmitigatedFlawsThatViolatingPolicy:
                    if (flawItem.IsOpenAccordingtoMitigationStatus && flawItem.AffectedbyPolicy) {
                        await this.handleUnmitigatedFlawsCreation(flawItem, flawDetails);
                    }
                    break;
                default:
                    console.log("Work Item Generation Preference not Selected");
            }
            deferred.resolve(true);
        }
        catch (error) {
            deferred.reject(false);
            this.commonActivity.handleError(error, "Error occurred while managing work item creation", this.failBuildIfFlawImporterBuildStepFails);
        }
        return deferred.promise;
    }
    /**
     * Manage work Item update activities
     * @param workItemDetails - details of flaw from veracode platform
     * @param flawItem - Current flaw item related data
     * @param workItemRef - Current WorkItem details retrieved from the server
     */
    async manageUpdateWorkItem(workItemDetails, flawItem, workItemRef) {
        core.debug("Class Name: WorkItemCreatoroAuth, Method Name: manageUpdateWorkItem");
        let deferred = q.defer();
        try {
            if (!workItemRef.id) {
                deferred.reject(false);
                return deferred.promise;
            }
            await this.getWorkItemById(workItemRef.id, fieldsToRetrieve)
                .then(async (retrievedWi) => {
                await this.ensureAppIdTag(retrievedWi, workItemDetails.Appid);
                return this.handleWorkItemStatus(retrievedWi, workItemDetails, flawItem, workItemRef);
            }).catch((e) => {
                console.error(`Failed to retrieve work item by id '${workItemRef.id}' ${e}`);
                deferred.reject(false);
            });
            deferred.resolve(true);
        }
        catch (error) {
            deferred.reject(false);
            this.commonActivity.handleError(error, "Error occured while updating the work item", this.failBuildIfFlawImporterBuildStepFails);
        }
        return deferred.promise;
    }
    /**
     * Check whether there is new comments available in flaw and composes new history for workitem
     * @param history - Current immediate history of workitem
     * @param flawComments - All comments of the flaw
     * @param state work item state
     * @returns - New flaw comments
     */
    getStaticAndDynamicNewComments(history, flawComments, state) {
        core.debug("Class Name: WorkItemCreatoroAuth, Method Name: getStaticAndDynamicNewComments");
        try {
            if (history && flawComments && history != flawComments) {
                if (this.processTemplate == CommonData.Constants.processTemplate_CMMI && state == CommonData.Constants.wiStatus_Resolved)
                    return null;
                core.debug(`flawComments: ${flawComments} <End of flaw comments>`);
                let firstOccuranceOfLineBreakInHistory = history.indexOf("</br>", 0);
                let oldHistory = history.substring(firstOccuranceOfLineBreakInHistory + 5, history.length);
                let firstIndexOfOldCommentInNewComments = flawComments.indexOf(oldHistory);
                let latestComments = flawComments.substring(firstIndexOfOldCommentInNewComments + oldHistory.length, flawComments.length);
                let firstOccuranceOfLineBreakInNewComments = flawComments.indexOf("</br>", 0);
                let firstLineOfNewComments = flawComments.substring(0, firstOccuranceOfLineBreakInNewComments);
                return `${firstLineOfNewComments}${latestComments}`.trim();
            }
            else if (!history && flawComments) {
                return flawComments;
            }
            core.debug("No new flaw comments found");
            return null;
        }
        catch (error) {
            console.log(`Error: ${error}`);
            return null;
        }
    }
    /**
     * Change status of workitem
     * @param retrievedWi  Current workitem data
     * @param workItemDetails details of flaw from veracode platform
     * @param flawItem Current flaw item related data
     * @param workItemRef workitem
     */ async handleWorkItemStatus(retrievedWi, workItemDetails, flawItem, workItemRef) {
        core.debug("Class Name: WorkItemCreatoroAuth, Method Name: handleWorkItemStatus");
        let deferred = q.defer();
        if (!retrievedWi.fields) {
            deferred.resolve(true);
            return deferred.promise;
        }
        console.log(`Work item id: ${retrievedWi.id}, Flaw status: ${flawItem.FlawStatus}, System  State: ${retrievedWi.fields["System.State"]}, Work item new state: ${this.workItemStateNew}`);
        const currentSeverity = retrievedWi.fields?.["Microsoft.VSTS.Common.Severity"];
        if (!retrievedWi.fields) {
            deferred.resolve(true);
            return deferred.promise;
        }
        const canUpdateSeverity = this.workItemType === CommonData.Constants.wiType_Bug;
        const desiredSeverity = (flawItem?.SeverityValue && flawItem.SeverityValue.trim())
            ? flawItem.SeverityValue.trim()
            : (() => {
                const n = typeof flawItem?.Severity === "string" ? parseInt(flawItem.Severity, 10) : flawItem?.Severity;
                switch (n) {
                    case 5: return CommonData.Constants.bug_severity_Critical; // "1 - Critical"
                    case 4: return CommonData.Constants.bug_severity_High; // "2 - High"
                    case 3: return CommonData.Constants.bug_severity_Medium; // "3 - Medium"
                    default: return CommonData.Constants.bug_severity_Low; // collapse 2/1/0 into "4 - Low"
                }
            })();
        const severityPatch = [];
        const severityChanged = canUpdateSeverity && !!desiredSeverity && currentSeverity !== desiredSeverity;
        if (canUpdateSeverity && desiredSeverity && currentSeverity !== desiredSeverity) {
            severityPatch.push({
                from: "",
                op: currentSeverity ? vss.Operation.Replace : vss.Operation.Add,
                path: "/fields/Microsoft.VSTS.Common.Severity",
                value: desiredSeverity
            });
        }
        // normalize desired severity word to one of: critical|high|medium|low
        const desiredSeverityWord = (() => {
            const s = String(desiredSeverity || "").toLowerCase();
            if (s.includes("critical"))
                return "critical";
            if (s.includes("high"))
                return "high";
            if (s.includes("medium"))
                return "medium";
            if (s.includes("low"))
                return "low";
            return null;
        })();
        const toTitleCase = (w) => w ? w.charAt(0).toUpperCase() + w.slice(1) : w;
        try {
            const currentTagsRaw = (retrievedWi.fields?.["System.Tags"] || "");
            const tagsArr = currentTagsRaw
                .split(";")
                .map(t => t.trim())
                .filter(Boolean);
            // Helper to get rank + word for desired severity
            const getRankedSeverity = (value) => {
                const s = value.toLowerCase();
                if (s.includes("critical") || s.startsWith("1"))
                    return { rank: 1, label: "Critical" };
                if (s.includes("high") || s.startsWith("2"))
                    return { rank: 2, label: "High" };
                if (s.includes("medium") || s.startsWith("3"))
                    return { rank: 3, label: "Medium" };
                if (s.includes("low") || s.startsWith("4"))
                    return { rank: 4, label: "Low" };
                return null;
            };
            const desired = getRankedSeverity(desiredSeverityWord || "");
            if (!desired) {
                deferred.resolve(true);
                return deferred.promise;
            }
            // Regex to detect severity tags like "1 - Critical" or "Critical"
            const severityRegex = /^\s*(?:([1-4])\s*-\s*)?(critical|high|medium|low)\s*$/i;
            const severityMatches = tagsArr
                .map((t, i) => ({ i, t, m: t.match(severityRegex) }))
                .filter(x => !!x.m);
            // Proceed only if severity actually changed and exactly one severity tag exists
            if (severityChanged && severityMatches.length === 1 && desired) {
                const idx = severityMatches[0].i;
                const existingTag = tagsArr[idx];
                const newTag = `${desired.rank} - ${desired.label}`;
                if (existingTag.toLowerCase() !== newTag.toLowerCase()) {
                    tagsArr[idx] = newTag;
                    severityPatch.push({
                        from: "",
                        op: currentTagsRaw ? vss.Operation.Replace : vss.Operation.Add,
                        path: "/fields/System.Tags",
                        value: tagsArr.join("; ")
                    });
                }
            }
        }
        catch (e) {
            core.debug(`Error during severity tag update: ${e}`);
        }
        retrievedWi.__severityPatch = severityPatch;
        try {
            let didStateChange = false;
            if (this.commonActivity.isReopened(this.processTemplate, flawItem, retrievedWi, this.workItemStateNew, this.workItemStateClosed, this.workItemStateResolved)) {
                core.debug("Work item is reopened");
                // CMMI template does not support to change closed workitem to 'proposed' status,
                // hence changing same to 'Active'    
                // CCMI test cases need to chage to 'Design' for re open
                if (this.processTemplate == CommonData.Constants.processTemplate_CMMI && this.workItemType == CommonData.Constants.wiType_TestCase) {
                    this.workItemStateNew = CommonData.Constants.wiStatus_Design;
                }
                else if (this.processTemplate == CommonData.Constants.processTemplate_CMMI) {
                    this.workItemStateNew = CommonData.Constants.wiStatus_Active;
                }
                //Re-Open work item
                console.log(`Work item '${retrievedWi.fields["System.Title"]}' will changed to '${this.workItemStateNew}' state.`);
                await this.updateWorkitemState(workItemRef.id, this.workItemStateNew, workItemDetails.Area, workItemDetails.OverwriteAreaPathInWorkItemsOnImport, flawItem.FlawComments || null, retrievedWi, workItemDetails.BuildVersion, workItemDetails.IterationPath, workItemDetails.OverwriteIterationPathInWorkItemsOnImport, severityPatch);
                didStateChange = true;
            }
            else if (flawItem.FlawStatus == CommonData.Constants.remediation_status_Fixed ||
                !flawItem.IsOpenAccordingtoMitigationStatus ||
                flawItem.FlawStatus == CommonData.Constants.remediation_status_CannotReproduce) {
                // work item in CMMI need to be ressolved before closing if current status is Active
                if (this.processTemplate == CommonData.Constants.processTemplate_CMMI && retrievedWi.fields["System.State"] == this.workItemStateActive) {
                    console.log(`Work item '${retrievedWi.fields["System.Title"]}' Will Changed to 'Ressolved' state.`);
                    await this.updateWorkitemState(workItemRef.id, this.workItemStateResolved, workItemDetails.Area, workItemDetails.OverwriteAreaPathInWorkItemsOnImport, flawItem.FlawComments || null, retrievedWi, workItemDetails.BuildVersion, workItemDetails.IterationPath, workItemDetails.OverwriteIterationPathInWorkItemsOnImport, severityPatch);
                    didStateChange = true;
                }
                if (retrievedWi.fields["System.State"] != this.workItemStateClosed) {
                    console.log(`WorkItem '${retrievedWi.fields["System.Title"]}' Will Changed to 'Closed' state.`);
                    await this.updateWorkitemState(workItemRef.id, this.workItemStateClosed, workItemDetails.Area, workItemDetails.OverwriteAreaPathInWorkItemsOnImport, flawItem.FlawComments || null, retrievedWi, workItemDetails.BuildVersion, workItemDetails.IterationPath, workItemDetails.OverwriteIterationPathInWorkItemsOnImport, severityPatch);
                    didStateChange = true;
                }
            }
            if (!didStateChange && severityPatch.length > 0) {
                console.log(`No state change. Updating severity/tag for WI ${retrievedWi.id}.`);
                await this.updateWorkitemState(workItemRef.id, retrievedWi.fields["System.State"] || '', workItemDetails.Area, workItemDetails.OverwriteAreaPathInWorkItemsOnImport, null, retrievedWi, workItemDetails.BuildVersion, workItemDetails.IterationPath, workItemDetails.OverwriteIterationPathInWorkItemsOnImport, severityPatch);
            }
            deferred.resolve(true);
        }
        catch (error) {
            deferred.reject(false);
            this.commonActivity.handleError(error, "Error occured while handling  work item Status", this.failBuildIfFlawImporterBuildStepFails);
        }
        return deferred.promise;
    }
    /**
     * Create Work Items for retrieved flaws
     * */
    async createWorkItems(workItemDetails) {
        const makeTitleKey = (s) => String(s || "").trim().toLowerCase();
        core.debug("Class Name: WorkItemCreatoroAuth, Method Name: createWorkItems");
        let onUpdate = false;
        console.log(`Work item type:  ${this.workItemType}\nWork item area path: ${workItemDetails.Area}\nOverwrite area path in work items on import: ${workItemDetails.OverwriteAreaPathInWorkItemsOnImport}\nWork items count: ${workItemDetails.WorkItemList.length}\nWork item flaw import limit: ${workItemDetails.FlawImportLimit}\nWork item list length: ${workItemDetails.WorkItemList.length}\nOverwrite Iteration Path In WorkItems On Import: ${workItemDetails.OverwriteIterationPathInWorkItemsOnImport}`);
        let createdWorkItemCount = 0;
        if (await this.validateSupportedWITypes()) {
            this.commonActivity.handleError(null, "The current process template does not support the selected work item type. Select a different type and try again.", this.failBuildIfFlawImporterBuildStepFails);
        }
        else {
            const appTag = `VeracodeFlawImporter:${workItemDetails.Appid}`.replace(/'/g, "''");
            const wiql = {
                query: `SELECT [System.Id] FROM workitems WHERE [System.Tags] CONTAINS '${appTag}'`
            };
            const teamContext = {
                project: this.projName,
                projectId: this.projectId,
                team: "",
                teamId: ""
            };
            const existingRef = await this.vstsWI.queryByWiql(wiql, teamContext);
            const existingIds = (existingRef.workItems || [])
                .map(w => w.id)
                .filter((x) => typeof x === "number" && x !== undefined);
            const existingFull = existingIds.length
                ? await this.getWorkItemsInBatches(this.vstsWI, existingIds, [
                    "System.Id",
                    "System.Title",
                    "System.Tags",
                    "System.State"
                ])
                : [];
            const existingIdSet = new Set(existingFull.map(w => w.id));
            const existingTitleSet = new Set(existingFull.map(w => String(w.fields?.["System.Title"] || "").trim().toLowerCase()));
            const currentTitleSet = new Set((workItemDetails.WorkItemList || [])
                .map(f => String(f.Title || "").trim().toLowerCase())
                .filter(Boolean));
            for (let index = 0; index < workItemDetails.WorkItemList.length; index++) {
                let flawItem = workItemDetails.WorkItemList[index];
                console.log(`WorkItem title: ${flawItem.Title}`);
                const title = (flawItem.Title || "").toLowerCase();
                const isSCAFlaw = /cve-\d{4}-\d+/i.test(title) || /component/i.test(title);
                let workItemQueryResult = await this.getWorkitem(this.projName, this.projectId, flawItem.Title);
                core.debug(`WorkItem result length: ${workItemQueryResult.workItems?.length || 0}`);
                if (!workItemQueryResult.workItems || workItemQueryResult.workItems.length == 0) {
                    if (createdWorkItemCount < workItemDetails.FlawImportLimit) {
                        if (workItemDetails.Appid) {
                            if (isSCAFlaw) {
                                const appIdTag = `VeracodeFlawImporter:${String(workItemDetails.Appid).trim()}`;
                                ;
                                if (!flawItem.Tags)
                                    flawItem.Tags = [];
                                const hasAppId = flawItem.Tags.some(t => new RegExp(`^VeracodeFlawImporter\\s*[:=]\\s*${String(workItemDetails.Appid).toLowerCase()}\\b`, "i").test(t));
                                if (!hasAppId) {
                                    flawItem.Tags.push(appIdTag);
                                }
                            }
                        }
                        await this.manageCreateWorkItem(workItemDetails, flawItem);
                        createdWorkItemCount++;
                    }
                }
                else {
                    onUpdate = true;
                    if (workItemQueryResult.workItems && workItemQueryResult.workItems.length > 0) {
                        await this.manageUpdateWorkItem(workItemDetails, flawItem, workItemQueryResult.workItems[0]);
                    }
                }
            }
            if (onUpdate) {
                let printLogStatementOnce = true;
                for (const wiItem of existingFull) {
                    if (!wiItem.fields)
                        continue;
                    const title = String(wiItem.fields["System.Title"] || "").trim().toLowerCase();
                    const isSCA = /cve-\d{4}-\d+/i.test(title) || /component/i.test(title);
                    if (isSCA && !currentTitleSet.has(title) && wiItem.fields["System.State"]?.toLowerCase() !== this.workItemStateClosed.toLowerCase()) {
                        if (printLogStatementOnce) {
                            console.log(`Closing SCA WorkItems not present in latest scan(remediated/resolved):`);
                            printLogStatementOnce = false;
                        }
                        console.log(`Work item id: ${wiItem.id}, System  State: ${wiItem.fields["System.State"]}, Work item new state: ${this.workItemStateClosed}`);
                        console.log(`WorkItem '${wiItem.fields["System.Title"]}' Will Changed to 'Closed' state.`);
                        await this.updateWorkitemState(wiItem.id, this.workItemStateClosed, workItemDetails.Area, workItemDetails.OverwriteAreaPathInWorkItemsOnImport, null, wiItem, workItemDetails.BuildVersion, workItemDetails.IterationPath, false);
                    }
                }
            }
        }
    }
    /**
    * validate unsupported workitem type that belongs to particular process template
    */
    async validateSupportedWITypes() {
        core.debug("Class Name: WorkItemCreatoroAuth, Method Name: validateSupportedWITypes");
        let deferred = q.defer();
        let isInvalidWorkItemType = true;
        try {
            let workitemTypes = await this.vstsWI.getWorkItemTypes(this.projectId);
            workitemTypes.forEach(workItemType => {
                if (this.workItemType == workItemType.name) {
                    isInvalidWorkItemType = false;
                    console.log(`Work item type '${workItemType.name}' identified in current process template`);
                }
            });
            deferred.resolve(isInvalidWorkItemType);
        }
        catch (error) {
            deferred.reject(true);
            this.commonActivity.handleError(error, "Error occurred while validating work item type", this.failBuildIfFlawImporterBuildStepFails);
        }
        return deferred.promise;
    }
    /**
     * Manage unmitigated flaw creation
     *  @param {CommonData.WorkItemDto} flawItem  - Flaw details
     *  @param {CommonData.workItemsDataDto} workItemDetails - Details of all vulnerabilities
     */
    async handleUnmitigatedFlawsCreation(flawItem, workItemDetails) {
        core.debug("Class Name: WorkItemCreatoroAuth, Method Name: handleUnmitigatedFlawsCreation");
        if (flawItem.FlawStatus == CommonData.Constants.remediation_status_Fixed || flawItem.FlawStatus == CommonData.Constants.remediation_status_CannotReproduce) {
            return this.createWorkitem({ projectName: this.projName, witype: this.workItemType, title: flawItem.Title, description: flawItem.Html, severity: flawItem.SeverityValue, area: workItemDetails.Area, foundInBuild: workItemDetails.BuildID, tagsCollection: flawItem.Tags, state: this.workItemStateClosed, wiComments: flawItem.FlawComments, overwriteAreaPathInWorkItemsOnImport: workItemDetails.OverwriteAreaPathInWorkItemsOnImport, iterationPath: workItemDetails.IterationPath, overwriteIterationPathInWorkItemsOnImport: workItemDetails.OverwriteIterationPathInWorkItemsOnImport });
        }
        else {
            console.log(`Creating WorkItem '${flawItem.Title}' in project '${this.projName}'`);
            return this.createWorkitem({ projectName: this.projName, witype: this.workItemType, title: flawItem.Title, description: flawItem.Html, severity: flawItem.SeverityValue, area: workItemDetails.Area, foundInBuild: workItemDetails.BuildID, tagsCollection: flawItem.Tags, state: this.workItemStateNew, wiComments: flawItem.FlawComments, overwriteAreaPathInWorkItemsOnImport: workItemDetails.OverwriteAreaPathInWorkItemsOnImport, iterationPath: workItemDetails.IterationPath, overwriteIterationPathInWorkItemsOnImport: workItemDetails.OverwriteIterationPathInWorkItemsOnImport });
        }
    }
    /**
     * Mange Policy violated Flaw creation
     *  @param {CommonData.WorkItemDto} flawItem  - Flaw details
     *  @param {CommonData.workItemsDataDto} workItemDetails - Details of all vulnerabilities
     */
    async handlePolicyViolatedandAllFlawsCreation(flawItem, workItemDetails) {
        core.debug("Class Name: WorkItemCreatoroAuth, Method Name: handlePolicyViolatedandAllFlawsCreation");
        if (!flawItem.IsOpenAccordingtoMitigationStatus || flawItem.FlawStatus == CommonData.Constants.remediation_status_Fixed || flawItem.FlawStatus == CommonData.Constants.remediation_status_CannotReproduce) {
            return this.createWorkitem({ projectName: this.projName, witype: this.workItemType, title: flawItem.Title, description: flawItem.Html, severity: flawItem.SeverityValue, area: workItemDetails.Area, foundInBuild: workItemDetails.BuildID, tagsCollection: flawItem.Tags, state: this.workItemStateClosed, wiComments: flawItem.FlawComments, overwriteAreaPathInWorkItemsOnImport: workItemDetails.OverwriteAreaPathInWorkItemsOnImport, iterationPath: workItemDetails.IterationPath, overwriteIterationPathInWorkItemsOnImport: workItemDetails.OverwriteIterationPathInWorkItemsOnImport });
        }
        else {
            console.log(`Creating WorkItem '${flawItem.Title}' in project '${this.projName}'`);
            return this.createWorkitem({ projectName: this.projName, witype: this.workItemType, title: flawItem.Title, description: flawItem.Html, severity: flawItem.SeverityValue, area: workItemDetails.Area, foundInBuild: workItemDetails.BuildID, tagsCollection: flawItem.Tags, state: this.workItemStateNew, wiComments: flawItem.FlawComments, overwriteAreaPathInWorkItemsOnImport: workItemDetails.OverwriteAreaPathInWorkItemsOnImport, iterationPath: workItemDetails.IterationPath, overwriteIterationPathInWorkItemsOnImport: workItemDetails.OverwriteIterationPathInWorkItemsOnImport });
        }
    }
    /**
     * Get Work Item for given Id
     * @param {number} workItemId - Id of the work item to retrieve
     * @param {string[]} fields - WI fields to retrieve
     */
    async getWorkItemById(workItemId, fields) {
        core.debug("Class Name: WorkItemCreatoroAuth, Method Name: getWorkItemById");
        try {
            return await this.vstsWI.getWorkItem(workItemId, fields);
        }
        catch (error) {
            this.commonActivity.handleError(error, "Failed to obtain work item details", this.failBuildIfFlawImporterBuildStepFails);
            throw error;
        }
    }
    /**
     * Validate area or iteration path
     * @param {string} fullPath - Path string to validate
     * @param {string} pathType - area or iteration
     */
    async isValidPath(fullPath, pathType) {
        core.debug("Class Name: WorkItemCreatoroAuth, Method Name: isValidPath");
        let deferred = q.defer();
        let nodes = fullPath.split("\\");
        try {
            core.debug(`Number of nodes: ${nodes.length}`);
            if (nodes.length == 1) {
                await this.validateRootNode(fullPath, deferred, pathType);
            }
            else {
                await this.validateClassificationNode(fullPath, deferred, pathType);
            }
        }
        catch (error) {
            deferred.reject(false);
            this.commonActivity.handleError(error, `An error occurred while validating the ${pathType} path`, this.failBuildIfFlawImporterBuildStepFails);
        }
        return deferred.promise;
    }
    /**
     * Checks whether classification node found
     * @param path - path value
     * @param deferred - deferred
     * @param pathType - area or iteration
     */
    async validateClassificationNode(path, deferred, pathType) {
        core.debug("Class Name: WorkItemCreatoroAuth, Method Name: validateClassificationNode");
        let node;
        if (pathType == "area")
            node = await this.vstsWI.getClassificationNode(this.projName, undefined, "Areas\\" + path.replace(this.projName, ""));
        if (pathType == "iteration")
            node = await this.vstsWI.getClassificationNode(this.projName, undefined, "iterations\\" + path.replace(this.projName, ""));
        if (!node || node.name == "") {
            console.log(`'${path}' is not a valid ${pathType} path.`);
            deferred.resolve(false);
        }
        else {
            console.log(`'${path}' is a valid ${pathType} path.`);
            deferred.resolve(true);
        }
    }
    /**
     * Checks whether root node found
     * @param rootNodePath - path value
     * @param deferred - deferred
     * @parm pathType - area or iteration
     */
    async validateRootNode(rootNodePath, deferred, pathType) {
        core.debug("Class Name: WorkItemCreatoroAuth, Method Name: validateRootNode");
        let apCollection = await this.vstsWI.getRootNodes(this.projName);
        let isValid = false;
        if (apCollection != undefined && apCollection != null) {
            apCollection.forEach(e => {
                if (e.name == rootNodePath) {
                    isValid = true;
                }
            });
        }
        if (!isValid) {
            console.log(`'${rootNodePath}' is a not valid Root ${pathType} path.`);
            deferred.resolve(false);
        }
        else {
            console.log(`'${rootNodePath}' is a valid Root ${pathType} path.`);
            deferred.resolve(true);
        }
    }
    // Access token is now provided via inputs, no need for getAccessToken method
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
    async createWorkitem({ projectName, witype, title, description, severity, area, foundInBuild, tagsCollection, state, wiComments, overwriteAreaPathInWorkItemsOnImport, iterationPath, overwriteIterationPathInWorkItemsOnImport }) {
        core.debug("Class Name: WorkItemCreatoroAuth, Method Name: createWorkitem");
        let wijson = await this.getWorkItemJson({ witype, title, description, severity, area, foundInBuild, tagsCollection, wiComments, iterationPath });
        return this.manageCreateandUpdateWorkItem(wijson, projectName, witype, state, title, area, overwriteAreaPathInWorkItemsOnImport, wiComments || null, foundInBuild, iterationPath, overwriteIterationPathInWorkItemsOnImport);
    }
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
    async manageCreateandUpdateWorkItem(wijson, projectName, witype, state, title, area, overwriteAreaPathInWorkItemsOnImport, wiComments, buildVersion, iterationPath, overwriteIterationPathInWorkItemsOnImport) {
        core.debug("Class Name: WorkItemCreatoroAuth, Method Name: manageCreateandUpdateWorkItem");
        let deferred = q.defer();
        try {
            await this.vstsWI.createWorkItem(undefined, wijson, projectName, witype, undefined, undefined).then((workitem) => {
                console.log(`WorkItem '${workitem.id}' Created.`);
                //VSTS doesn't allow to create work items with "Closed" state, therefore updating the stste to "Closed" once its created.
                if (workitem.id) {
                    this.performPostWorkItemCreationActivities(state, workitem, area, overwriteAreaPathInWorkItemsOnImport, wiComments || '', buildVersion, iterationPath, overwriteIterationPathInWorkItemsOnImport);
                }
                deferred.resolve(true);
            }).catch((e) => {
                console.error(`Failed to create WorkItem '${title}' ${e}`);
                deferred.reject(false);
            });
        }
        catch (error) {
            deferred.reject(false);
            this.commonActivity.handleError(error, "Error occured while creating or updating work item", this.failBuildIfFlawImporterBuildStepFails);
        }
        return deferred.promise;
    }
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
    performPostWorkItemCreationActivities(state, workitem, area, overwriteAreaPathInWorkItemsOnImport, wiComments, buildVersion, iterationPath, overwriteIterationPathInWorkItemsOnImport) {
        core.debug("Class Name: WorkItemCreatoroAuth, Method Name: performPostWorkItemCreationActivities");
        core.debug(`Expected work item state as per the flaw: ${state}`);
        if (state == this.workItemStateClosed && workitem.id) {
            core.debug(`Work item closed state as per the process template: ${this.workItemStateClosed}`);
            this.updateWorkitemState(workitem.id, state, area, overwriteAreaPathInWorkItemsOnImport, wiComments || null, workitem, buildVersion, iterationPath, overwriteIterationPathInWorkItemsOnImport);
            console.log(`Updated WorkItem '${workitem.id}' to Closed State.`);
        }
    }
    /**
     * Get Workitems
     * @param {string} projectName - Name of the project to retrieve work items
     * @param {string} teamProjectId - Team project Id
     * @param {string} title - WorkItem title
     */
    async getWorkitem(projectName, teamProjectId, title) {
        core.debug("Class Name: WorkItemCreatoroAuth, Method Name: getWorkitem");
        try {
            title = title.replace(/'/g, "''");
            let selectWorkItemsQry = {
                query: `Select [System.Id] From WorkItems Where [System.WorkItemType] = '${this.workItemType}' AND [System.Title] = '${title}'`
            };
            let teamContext = { project: projectName, projectId: teamProjectId, team: "", teamId: "" };
            return await this.vstsWI.queryByWiql(selectWorkItemsQry, teamContext, undefined, undefined);
        }
        catch (error) {
            this.commonActivity.handleError(error, "Work item query failed.", this.failBuildIfFlawImporterBuildStepFails);
            return { workItems: [] };
        }
    }
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
    async updateWorkitemState(id, state, area, overwriteAreaPathInWorkItemsOnImport, flawComments, workItem, buildVersion, iterationPath, overwriteIterationPathInWorkItemsOnImport, patchDocument = []) {
        let wiJsonPatchDocument;
        core.debug("Class Name: WorkItemCreatoroAuth, Method Name: updateWorkitemState");
        try {
            let newComments = await this.handleWorkItemCommentUpdates(workItem, flawComments, buildVersion, state);
            area = area.replace(/\\/g, "\\\\");
            let jsonPathcOperations = new Array();
            let wiStateJson = { "op": vss.Operation.Replace, "path": "/fields/System.State", "value": state };
            let wiAreaPathJson = { "op": vss.Operation.Replace, "path": "/fields/System.AreaPath", "value": area };
            let wiIterationPathJson = { "op": vss.Operation.Replace, "path": "/fields/System.IterationPath", "value": iterationPath };
            let wiCommentsJson;
            if (newComments && newComments !== "") {
                wiCommentsJson = { "op": vss.Operation.Replace, "path": "/fields/System.History", "value": newComments };
            }
            jsonPathcOperations.push(wiStateJson);
            if (overwriteIterationPathInWorkItemsOnImport)
                jsonPathcOperations.push(wiIterationPathJson);
            if (overwriteAreaPathInWorkItemsOnImport)
                jsonPathcOperations.push(wiAreaPathJson);
            if (wiCommentsJson)
                jsonPathcOperations.push(wiCommentsJson);
            // Add the severity update if necessary
            if (patchDocument && patchDocument.length > 0) {
                // Severity field update
                const filteredPatch = patchDocument.filter(op => op.path !== "/fields/System.History");
                filteredPatch.forEach(op => {
                    jsonPathcOperations.push(op);
                });
            }
            wiJsonPatchDocument = await this.getPromiseWithJsonPatchDocument(jsonPathcOperations);
            await this.vstsWI.updateWorkItem(undefined, wiJsonPatchDocument, id, undefined, undefined).then((workitem) => {
                console.log(`Work item '${workitem.id}' updated`);
            }).catch((e) => {
                console.error(`Failed to update work item '${id}' ${e}`);
            });
        }
        catch (error) {
            this.commonActivity.handleError(error, "Failed to update work item status", this.failBuildIfFlawImporterBuildStepFails);
        }
    }
    /**
     * Handles updates for work item comments
     * @param workItem Work item data
     * @param flawComments Latest comments from the flaw
     * @param buildVersion Veracode scan version
     * @param state Current state of the work item
     * @returns new comments
     */
    async handleWorkItemCommentUpdates(workItem, flawComments, buildVersion, state) {
        core.debug("Class Name: WorkItemCreatoroAuth, Method Name: handleWorkItemCommentUpdates");
        let history = null;
        let commentList = null;
        try {
            if (!workItem.id)
                return null;
            commentList = await this.vstsWI.getComments(this.projectId, workItem.id, 1);
        }
        catch (error) {
            core.debug(`Error: ${error}`);
            core.debug(`Unable to synchronize comments between imported flaws and work items. Ensure you are using Azure DevOps/TFS 2019 or later.`);
            return null;
        }
        let isSCAHistoryAvailable = false, isStaticDynamicHistoryAvailable = false;
        if (commentList?.comments && commentList.comments[0]) {
            history = commentList.comments[0].text || null;
            core.debug("Work item comments found");
            if (history) {
                core.debug(`history: ${history}`);
                if (history.includes(CommonData.Constants.SCAMitigationCommentPrefix))
                    isSCAHistoryAvailable = true;
                if (history.includes(CommonData.Constants.StaticAndDynamicCommentPrefix))
                    isStaticDynamicHistoryAvailable = true;
            }
        }
        else {
            core.debug("Work item comments not found");
        }
        if (flawComments && (flawComments.includes(CommonData.Constants.StaticAndDynamicCommentPrefix) || isStaticDynamicHistoryAvailable))
            return this.getStaticAndDynamicNewComments(history, flawComments, state);
        if ((flawComments && flawComments.includes(CommonData.Constants.SCAMitigationCommentPrefix)) || (!flawComments && isSCAHistoryAvailable))
            return this.getSCANewComments(history, flawComments, buildVersion, state);
        return null;
    }
    /**
     * Get new SCA flaw comments
     * @param history Last comment of the work item
     * @param flawComments Full flaw comments
     * @param buildVersion Veracode Scan version
     * @param state work item state
     * @returns New flaw comments
     */
    getSCANewComments(history, flawComments, buildVersion, state) {
        core.debug("Class Name: WorkItemCreatoroAuth, Method Name: getSCANewComments");
        try {
            if (((history && flawComments) || (!history && flawComments)) && (history != flawComments))
                return flawComments;
            if (state == this.workItemStateNew && history && !flawComments)
                return `${CommonData.Constants.SCAIssueReOpenCommentPrefix} ${buildVersion}`;
            return null;
        }
        catch (error) {
            console.log(`Error: ${error}`);
            return null;
        }
    }
    /**
     * Update Workitem comments : TODO : This code will be modified and used when implementing flaw comment upload scenario
     * @param {number} id - Id of the work item to update
     * @param {string} wiComments - work item new comment
     */
    async updateWorkitemComments(id, wiComments) {
        core.debug("Class Name: WorkItemCreatoroAuth, Method Name: updateWorkitemComments");
        let wijson = [
            {
                "op": "add",
                "path": "/fields/System.History",
                "value": wiComments
            }
        ];
        await this.vstsWI.updateWorkItem(undefined, wijson, id, undefined, undefined).then((workitem) => {
            console.log(`WorkItem '${workitem.id}' Updated`);
        }).catch((e) => {
            this.commonActivity.handleError(e, `Failed to update WorkItem '${id}'`, this.failBuildIfFlawImporterBuildStepFails);
        });
    }
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
    async getWorkItemJson({ witype, title, description, severity, area, foundInBuild, tagsCollection, wiComments, iterationPath }) {
        core.debug("Class Name: WorkItemCreatoroAuth, Method Name: getWorkItemJson");
        area = area.replace(/\\/g, "\\\\");
        //Title
        let addTitle = { "from": "", "op": vss.Operation.Add, "path": "/fields/System.Title", "value": title };
        //Tags
        let addTags = { "from": "", "op": vss.Operation.Add, "path": "/fields/System.Tags", "value": tagsCollection.join(";") };
        //RepoSteps
        let addRepoSteps = { "from": "", "op": vss.Operation.Add, "path": "/fields/Microsoft.VSTS.TCM.ReproSteps", "value": description };
        //Severity
        let addSeverity = { "from": "", "op": vss.Operation.Add, "path": "/fields/Microsoft.VSTS.Common.Severity", "value": severity };
        //AreaPath
        let addAreaPath = { "from": "", "op": vss.Operation.Add, "path": "/fields/System.AreaPath", "value": area };
        //Iteration Path
        let addIterationPath = { "from": "", "op": vss.Operation.Add, "path": "/fields/System.IterationPath", "value": iterationPath };
        //Description
        let addDescription = { "from": "", "op": vss.Operation.Add, "path": "/fields/System.Description", "value": description };
        //Discussion
        let addDiscussion;
        if (wiComments != null) {
            wiComments = wiComments.trim();
            addDiscussion = { "from": "", "op": vss.Operation.Add, "path": "/fields/System.History", "value": wiComments };
        }
        //Found in build
        let addfoundInBuild;
        if (foundInBuild) {
            addfoundInBuild = { "from": "", "op": vss.Operation.Add, "path": "/fields/Microsoft.VSTS.Build.FoundIn", "value": foundInBuild };
        }
        var jsonPatchDocumentBase = [addTags, addTitle, addAreaPath, addIterationPath];
        if (witype == CommonData.Constants.wiType_Bug) {
            jsonPatchDocumentBase = jsonPatchDocumentBase.concat(addSeverity);
            jsonPatchDocumentBase = jsonPatchDocumentBase.concat(addRepoSteps);
            if (addfoundInBuild) {
                jsonPatchDocumentBase = jsonPatchDocumentBase.concat(addfoundInBuild);
            }
        }
        else {
            jsonPatchDocumentBase = jsonPatchDocumentBase.concat(addDescription);
        }
        if (addDiscussion) {
            jsonPatchDocumentBase = jsonPatchDocumentBase.concat(addDiscussion);
        }
        return this.getPromiseWithJsonPatchDocument(jsonPatchDocumentBase.concat(this.addCustomFields || []));
    }
    /**
     * Get Promised Jsonn Patch document
     * @param {any} a - Array of work item fields fields
     */
    async getPromiseWithJsonPatchDocument(a) {
        core.debug("Class Name : WorkItemCreatoroAuth , Method Name : getPromiseWithJsonPatchDocument");
        try {
            let deferred = q.defer();
            let bugJpd;
            bugJpd = a;
            deferred.resolve(bugJpd);
            return await deferred.promise;
        }
        catch (error) {
            this.commonActivity.handleError(error, "Failed to obtain patch document", this.failBuildIfFlawImporterBuildStepFails);
            return [];
        }
    }
    /**
     * Sets project id when project name is given
     */
    async setProjectId() {
        core.debug("Class Name: WorkItemCreatoroAuth, Method Name: setProjectId");
        if (this.vstsCore == undefined) {
            this.vstsCore = await this.connection.getCoreApi();
            this.vstsWI = await this.connection.getWorkItemTrackingApi();
        }
        try {
            await this.vstsCore.getProjects(null, 1000).then((data) => {
                core.debug(`Projects: \n  ${JSON.stringify(data)}`);
                console.log(`Projects Count: ${Object.keys(data).length}`);
                if (data != undefined && data != null) {
                    let filteredProject = data.filter(x => x.name == this.projName);
                    if (filteredProject != undefined && filteredProject != null && filteredProject.length > 0) {
                        core.debug(`Selected project name: ${filteredProject[0].name}`);
                        console.log(`Selected project id: ${filteredProject[0].id}`);
                        this.projectId = filteredProject[0].id || '';
                    }
                    else {
                        //Project ID not found
                        this.commonActivity.handleError(null, `Project ID not found. Enter the area path for the project ${this.projName} in the Area field.`, this.failBuildIfFlawImporterBuildStepFails);
                    }
                }
            });
        }
        catch (error) {
            //Error occurred while finding the project ID.
            this.commonActivity.handleError(error, `Error occurred while finding the project ID. Verify the area path for the project ${this.projName} in the Area field, and try again.`, this.failBuildIfFlawImporterBuildStepFails);
        }
    }
    /**
 * Extracts {CVE, component} from a WI title created by the importer.
 * Expected shape (case-insensitive, flexible spacing):
 *   "Component: <component text> has CVE Vulnerability CVE-YYYY-NNNN detected in Application: ..."
 *
 * Returns a key string "CVE-YYYY-NNNN_<component-lower>" or null if it can't parse.
 */
    extractFlawKeyFromTitle(title) {
        try {
            if (!title)
                return null;
            const cveMatch = title.match(/(CVE-\d{4}-\d+)/i);
            const cve = cveMatch ? cveMatch[1].toUpperCase() : undefined;
            const compMatch = title.match(/Component:\s*(.*?)\s+has\s+CVE/i) ||
                title.match(/Component:\s*([^\r\n]+?)(?:\s+CVE|\s+detected|\s+in\s+Application:|$)/i);
            const component = compMatch ? compMatch[1].trim().toLowerCase() : undefined;
            if (!cve || !component)
                return null;
            return `${cve.toUpperCase()}_${component.toLowerCase()}`;
        }
        catch (e) {
            return null;
        }
    }
    /**
     * Auto-closes work items whose (CVE, component) keys are NOT present in the latest scan.
     * - currentFlawKeys must contain keys built as `${CVE.toUpperCase()}_${component.toLowerCase()}`
     * - Filters by AppId in WIQL for single-app imports, but does not embed AppId in key comparison.
     */
    async ensureAppIdTag(workItem, appId) {
        const title = String(workItem.fields?.["System.Title"] || "");
        const isSCAFlaw = /cve-\d{4}-\d+/i.test(title) || /component/i.test(title);
        if (!isSCAFlaw)
            return;
        if (!appId)
            return;
        const tagToAdd = `VeracodeFlawImporter:${String(appId).trim()}`;
        const currentTagsRaw = (workItem.fields?.["System.Tags"] || "");
        const tags = currentTagsRaw
            .split(";")
            .map(t => t.trim())
            .filter(Boolean);
        const hasIt = tags.some(t => t.toLowerCase() === tagToAdd.toLowerCase());
        if (hasIt)
            return; // already tagged
        tags.push(tagToAdd);
        const newTags = tags.join("; ");
        const patch = [
            {
                op: currentTagsRaw ? vss.Operation.Replace : vss.Operation.Add,
                path: "/fields/System.Tags",
                from: "",
                value: newTags
            }
        ];
        if (workItem.id) {
            await this.vstsWI.updateWorkItem(undefined, patch, workItem.id, undefined, undefined);
        }
    }
    async getWorkItemsInBatches(api, ids, fields = ["System.Id", "System.Title", "System.Tags", "System.State"], batchSize = 200) {
        const out = [];
        for (let i = 0; i < ids.length; i += batchSize) {
            const slice = ids.slice(i, i + batchSize);
            const batch = await api.getWorkItems(slice, fields);
            if (batch?.length)
                out.push(...batch);
        }
        return out;
    }
}
exports.WorkItemCreatoroAuth = WorkItemCreatoroAuth;
//# sourceMappingURL=WorkItemCreator.js.map