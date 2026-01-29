"use strict";
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
exports.SCAFlawManager = void 0;
/*******************************************************************************
* Copyright (c) 2017 Veracode, Inc. All rights observed.
*
* Available for use by Veracode customers as described in the accompanying license agreement.
*
* Send bug reports or enhancement requests to support@veracode.com.
*
* See the license agreement for conditions on submitted materials.
******************************************************************************/
const core = __importStar(require("@actions/core"));
const CommonData = __importStar(require("./Common"));
/**
 * Extracting SCA data and composing work item data
 */
class SCAFlawManager {
    constructor() {
        this.commonHelper = new CommonData.CommonHelper();
    }
    /**
     * Obtains SCA flaw data
     * @param xmlDoc - Flaw data
     * @param workItemDetails - WorkItem details
     * @param importerParameters - import parameters
     */
    captureSCAFlawData(xmlDoc, workItemDetails, importParameters, scanDetails) {
        core.debug("Class Name: SCAFlawManager, Method Name: captureSCAFlawData");
        let scaElement = xmlDoc.getElementsByTagName('software_composition_analysis');
        if (scaElement && scaElement.length > 0) {
            let vulnerableComponentElement = scaElement[0].getElementsByTagName('vulnerable_components');
            if (vulnerableComponentElement !== null && vulnerableComponentElement.length > 0) {
                console.log(`Vulnerable components count: ${vulnerableComponentElement.length}`);
                let vulnerableComponentsList = vulnerableComponentElement[0].getElementsByTagName('component');
                for (let vulnerabilityIndex = 0; vulnerabilityIndex < vulnerableComponentsList.length; vulnerabilityIndex++) {
                    this.filterVulnerabilityByFlawTypeAndAssignForWorkItemCreation(vulnerableComponentsList, vulnerabilityIndex, importParameters, scanDetails, workItemDetails);
                }
            }
        }
    }
    /**
     * Filter vulnerability from detailed report by flaw type and preapare flaws for work item creation
     * @param vulnerableComponentsList Vulnerability component list
     * @param vulnerabilityIndex Current vulnerability index
     * @param importParameters User inputs
     * @param scanDetails Veracode scan details
     * @param workItemDetails Work item creation data
     */
    filterVulnerabilityByFlawTypeAndAssignForWorkItemCreation(vulnerableComponentsList, vulnerabilityIndex, importParameters, scanDetails, workItemDetails) {
        core.debug("Class Name: SCAFlawManager, Method Name: filterVulnerabilityByFlawTypeAndAssignForWorkItemCreation");
        let vulnerableComponent = this.populateComponentData(vulnerableComponentsList[vulnerabilityIndex]);
        if (vulnerableComponent != null && vulnerableComponent.Vulnerabilities != null && vulnerableComponent.Vulnerabilities.length > 0) {
            console.log(`Vulnerabilities count: ${vulnerableComponent.Vulnerabilities.length}`);
            vulnerableComponent.Vulnerabilities.forEach(vulnerability => {
                let flawData = new CommonData.FlawDto();
                if (vulnerability.IsMitigation) {
                    flawData.MitigationStatus = CommonData.Constants.mitigation_Status_Accepted;
                }
                else {
                    flawData.MitigationStatus = CommonData.Constants.mitigation_Status_None;
                }
                flawData.FlawAffectedbyPolicy = vulnerability.DoesAffectPolicy;
                vulnerability.FilePathList = vulnerableComponent.FilePathsList;
                this.commonHelper.filterWorkItemsByFlawType(flawData, this.vulnerabilityToWorkItem(vulnerableComponent, vulnerability, importParameters, scanDetails, workItemDetails.BuildVersion), workItemDetails, importParameters);
            });
        }
    }
    /**
     * Extract and map vulnerabledata to dto
     * @param vulnerabilityItem - vulnerablity data
     * @param vulnerableComponent - vulnerable component data
     */
    populateVulnerabilities(vulnerabilityItem, vulnerableComponent) {
        core.debug("Class Name: SCAFlawManager, Method Name: populateVulnerabilities");
        if (vulnerabilityItem && vulnerabilityItem.getElementsByTagName('vulnerability')) {
            let vulnerabilityList = vulnerabilityItem.getElementsByTagName('vulnerability');
            for (let i = 0; i < vulnerabilityList.length; i++) {
                vulnerabilityItem = vulnerabilityList[i];
                let vulnerability = new CommonData.ComponentVulnerability();
                vulnerability.DoesAffectPolicy = vulnerabilityItem.getAttribute('vulnerability_affects_policy_compliance').toUpperCase() === CommonData.Constants.status_True_UpperCase;
                vulnerability.IsMitigation = vulnerabilityItem.getAttribute('mitigation').toUpperCase() === CommonData.Constants.status_True_UpperCase;
                vulnerability.MitigationType = vulnerabilityItem.getAttribute('mitigation_type');
                vulnerability.CveId = vulnerabilityItem.getAttribute('cve_id');
                vulnerability.CveSummary = vulnerabilityItem.getAttribute('cve_summary');
                vulnerability.CweId = vulnerabilityItem.getAttribute('cwe_id');
                vulnerability.Severity = vulnerabilityItem.getAttribute('severity');
                vulnerability.FirstFoundDate = vulnerabilityItem.getAttribute('first_found_date');
                vulnerableComponent.Vulnerabilities.push(vulnerability);
                if (vulnerability.IsMitigation) {
                    vulnerability.MitigationCommentOnFlawClosure = `${CommonData.Constants.SCAMitigationCommentPrefix} ${vulnerability.MitigationType}`;
                }
                else {
                    vulnerability.MitigationCommentOnFlawClosure = "";
                }
            }
        }
    }
    /**
     * Extract and map component data to dto
     * @param elementComponentItem - component data
     * @returns Vulnerablity component data
     */
    populateComponentData(elementComponentItem) {
        core.debug("Class Name: SCAFlawManager, Method Name: populateComponentData");
        let vulnerableComponent = new CommonData.VulnerableComponentDetailedReportDto();
        vulnerableComponent.Library = elementComponentItem.getAttribute('library');
        vulnerableComponent.ComponentId = elementComponentItem.getAttribute('component_id');
        vulnerableComponent.Version = elementComponentItem.getAttribute('version');
        this.populateComponentFilePaths(elementComponentItem.getElementsByTagName('file_paths')[0], vulnerableComponent.FilePathsList);
        this.populateVulnerabilities(elementComponentItem.getElementsByTagName('vulnerabilities')[0], vulnerableComponent);
        return vulnerableComponent;
    }
    /**
     * Extract and map file paths to dto
     * @param filePathsNode - extracted file path node from the detailed report
     * @param filePathsList - file path list in the dto, uses to store file paths
     */
    populateComponentFilePaths(filePathsNode, filePathsList) {
        core.debug("Class Name: SCAFlawManager, Method Name: populateComponentFilePaths");
        if (filePathsNode && filePathsNode.getElementsByTagName('file_path')) {
            let filePathsNodeList = filePathsNode.getElementsByTagName('file_path');
            for (let i = 0; i < filePathsNodeList.length; i++) {
                filePathsList.push(filePathsNodeList[i].getAttribute('value'));
            }
        }
    }
    /**
     * Converts severity number to string
     * @param severity - severity number
     * @returns severity as a string
     */
    getSeverityAsString(severity) {
        core.debug("Class Name: SCAFlawManager, Method Name: getSeverityAsString");
        if (severity >= 5) {
            return CommonData.Constants.bug_severity_Critical;
        }
        else if (severity == 4) {
            return CommonData.Constants.bug_severity_High;
        }
        else if (severity == 3) {
            return CommonData.Constants.bug_severity_Medium;
        }
        else {
            return CommonData.Constants.bug_severity_Low;
        }
    }
    /**
     * Arrange and map vulnerable data in to workitem data
     * @param vulnerableComponent - Vulnerable data
     * @param vulnerability - vulnerability data
     * @param importParameters - import parameters
     * @returns Workitem data
     */
    vulnerabilityToWorkItem(vulnerableComponent, vulnerability, importParameters, scanDetails, buildVersion) {
        core.debug("Class Name: SCAFlawManager, Method Name: vulnerabilityToWorkItem");
        let workItem = new CommonData.WorkItemDto();
        workItem.Title = `Component: ${vulnerableComponent.Library}-${vulnerableComponent.Version} has CVE Vulnerability ${vulnerability.CveId} detected in Application: ${importParameters.VeracodeAppProfile}`;
        workItem.Html = this.generateWorkItemBody(vulnerability, scanDetails, vulnerableComponent.ComponentId);
        let severity = Number(vulnerability.Severity);
        if (severity && !Number.isNaN(severity)) {
            workItem.SeverityValue = this.getSeverityAsString(severity);
            workItem.Severity = severity;
        }
        workItem.IsOpenAccordingtoMitigationStatus = !vulnerability.IsMitigation;
        workItem.AffectedbyPolicy = vulnerability.DoesAffectPolicy;
        workItem.FlawComments = vulnerability.MitigationCommentOnFlawClosure;
        if (workItem.IsOpenAccordingtoMitigationStatus) {
            workItem.FlawStatus = CommonData.Constants.remediation_status_Open;
        }
        else {
            workItem.FlawStatus = CommonData.Constants.remediation_status_Fixed;
        }
        this.addTags(workItem, importParameters, scanDetails, vulnerability.CveId, buildVersion);
        return workItem;
    }
    /**
     * Adds tags to the work item
     * @param workItem - work item data
     * @param importParameters - user inputs
     * @param scanDetails - scan details
     * @param cveId - CVE ID
     * @param buildVersion - scan name
     */
    addTags(workItem, importParameters, scanDetails, cveId, buildVersion) {
        core.debug("Class Name: SCAFlawManager, Method Name: addTags");
        //Add CVE As Tag
        if (importParameters.AddCveTag && cveId) {
            core.debug(`Value for cwe tag identified. Value is ${cveId}`);
            workItem.Tags.push(cveId);
        }
        //Add Custom Tag
        if (importParameters.AddCustomTag) {
            core.debug(`Value for Custom tag identified. Value is ${importParameters.AddCustomTag}`);
            workItem.Tags.push(importParameters.AddCustomTag);
        }
        //Add build Id as Tag
        if (importParameters.FoundInBuild) {
            core.debug(`Value for build is tag identified. Value is ${scanDetails.BuildId}`);
            workItem.Tags.push(`Build_${scanDetails.BuildId}`);
        }
        //Add scan name as Tag
        if (importParameters.AddScanNameAsATag && buildVersion) {
            core.debug(`Value for scan name tag identified. Value is ${buildVersion}`);
            workItem.Tags.push(buildVersion);
        }
        //Scan Type as Tag
        if (importParameters.ScanTypeTag) {
            core.debug(`Value for scan type tag identified. Value is SCA`);
            workItem.Tags.push("SCA");
        }
        //Severity as Tag
        if (importParameters.SeverityTag) {
            core.debug(`Value for severity tag identified. Value is ${workItem.SeverityValue}`);
            workItem.Tags.push(workItem.SeverityValue);
        }
    }
    /**
     * Composes the work item body
     * @param vulnerability - vulnerability details
     * @param scanDetails - scan details
     * @param componentId - SCA component details
     * @returns - body of the work item
     */
    generateWorkItemBody(vulnerability, scanDetails, componentId) {
        core.debug("Class Name: SCAFlawManager, Method Name: generateWorkItemBody");
        let mainContent = `CVE: <a href= ${CommonData.Constants.cvePageURL_prefix}${vulnerability.CveId} >${vulnerability.CveId}</a>, ${vulnerability.CveSummary} <br>`;
        let componentProfile = `You must fix this vulnerability to secure this component and your application. More information is 
available at  <a href= ${scanDetails.ComponentProfileUrl}:${componentId} >Component Profile </a><br>`;
        let firstFoundDate = `<p><b>Vulnerability first found date:</b> ${vulnerability.FirstFoundDate}</p>`;
        let vulnerabilityFilePaths = `<b>File paths:</b>`;
        for (let pathIndex = 0; pathIndex < vulnerability.FilePathList.length; pathIndex++) {
            vulnerabilityFilePaths += `<p>${vulnerability.FilePathList[pathIndex]}<p>`;
        }
        if (vulnerability.FilePathList.length < 1)
            vulnerabilityFilePaths = "";
        let links = `<br><b>Veracode Link:</b>  <a href= ${scanDetails.ResultPageURL} >Application</a>  <a href=${CommonData.Constants.request_Prefix}${scanDetails.AnalysisCenterUrl}${CommonData.Constants.policyPageURL_Infix}>Policy</a>  <a href= ${scanDetails.ComponentProfileUrl}:${componentId} >Component</a>`;
        return `${mainContent}${componentProfile}${firstFoundDate}${vulnerabilityFilePaths}${links}`;
    }
}
exports.SCAFlawManager = SCAFlawManager;
//# sourceMappingURL=SCAFlawManager.js.map