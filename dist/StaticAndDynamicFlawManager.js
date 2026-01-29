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
exports.StaticAndDynamicFlawManager = void 0;
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
class StaticAndDynamicFlawManager {
    constructor() {
        this.commonHelper = new CommonData.CommonHelper();
    }
    /**
    * Gererate workitem details from SAST and DAST flaw data
    * @param xmlDoc - Flaw data
    * @param workItemDetails - WorkItem details
    * @param scanDetails - Scan specific details
    * @param importParameters - user entered paraeters
    */
    captureDASTAndSASTFlawData(xmlDoc, workItemDetails, scanDetails, importParameters) {
        core.debug("Class Name: StaticAndDynamicFlawManager, Method Name: captureDASTAndSASTFlawData");
        let elementSeverityList = xmlDoc.getElementsByTagName('severity');
        console.log(`***No of Severities : ${elementSeverityList.length} ***`);
        for (let i = 0; i < elementSeverityList.length; i++) {
            workItemDetails.SeverityDTOList.push(this.populateSeverityData(elementSeverityList[i], scanDetails, importParameters, workItemDetails));
        }
    }
    /**
     * Extract xml based severity data and map same to  DTO
     * @param {any} severityListItem - xml based severity data.
     * @param {CommonData.ScanDto} scanDetails - veracode scan related details.
     * @param {CommonData.FlawImporterParametersDto} importParameters - user provided parameters.
     * @param {CommonData.workItemsDataDto} workItemsCreationData - work Items generation data.
     * @return {CommonData.SeverityDetailedReportDto} - Mapped severity details .
     */
    populateSeverityData(severityListItem, scanDetails, importParameters, workItemsCreationData) {
        core.debug("Class Name: StaticAndDynamicFlawManager, Method Name: populateSeverityData");
        let severityDetails = new CommonData.SeverityDetailedReportDto();
        severityDetails.Level = severityListItem.getAttribute('level');
        console.log(`Current Severity : ${severityDetails.Level}`);
        if (severityListItem.childNodes.length > 0) {
            try {
                let currentCategoryNodeList = severityListItem.getElementsByTagName('category');
                console.log(`  No of Categories : ${currentCategoryNodeList.length}`);
                for (let c = 0; c < currentCategoryNodeList.length; c++) {
                    let categoryDetails = new CommonData.CategoryDetailedReportDto();
                    categoryDetails.CategoryName = currentCategoryNodeList[c].getAttribute('categoryname');
                    if (currentCategoryNodeList[c].childNodes.length > 0) {
                        console.log(`      Current Category : ${c}`);
                        console.log(`      Current Category Name : ${categoryDetails.CategoryName}`);
                        this.populateCategoryData({ categoryDetails, currentCategoryListItem: currentCategoryNodeList[c], sevData: severityDetails, scanDetails, importParameters, workItemsCreationData });
                    }
                    severityDetails.CategoryList.push(categoryDetails);
                }
            }
            catch (e) {
                console.log(`Error Occured While Mapping Severity Data : ${e}`);
            }
        }
        return severityDetails;
    }
    /**
     * Extract xml based cew data and map same to  DTO
     * @param {CommonData.CategoryDetailedReportDto} categoryDetails - Category Details.
     * @param {any} currentCategoryListItem - xml based category data.
     * @param {CommonData.SeverityDetailedReportDto} sevData - flaw severity related details.
     * @param {CommonData.ScanDto} scanDetails - veracode scan related details.
     * @param {CommonData.FlawImporterParametersDto} importParameters - user provided parameters.
     * @param {CommonData.workItemsDataDto} workItemsCreationData - work Items generation data.
     */
    populateCategoryData({ categoryDetails, currentCategoryListItem, sevData, scanDetails, importParameters, workItemsCreationData }) {
        core.debug("Class Name: StaticAndDynamicFlawManager, Method Name: populateCategoryData");
        try {
            // Map Main description Data
            let categoryMainDescription = currentCategoryListItem.getElementsByTagName('desc')[0];
            let catDescription = new CommonData.CategoryDescriptionDetailedReportDto();
            if (categoryMainDescription.childNodes.length > 0) {
                let descParaList = categoryMainDescription.getElementsByTagName('para');
                categoryDetails.Description = this.getMainParagraphText(descParaList, catDescription);
            }
            // Map recomendations data
            let categoryRecomendations = currentCategoryListItem.getElementsByTagName('recommendations')[0];
            var catRecomendation = new CommonData.CategoryRecomendationsDetailedReportDto();
            if (categoryRecomendations.childNodes.length > 0) {
                var recParaList = categoryRecomendations.getElementsByTagName('para');
                categoryDetails.Recomendations = this.getRecommendationParagraphText(recParaList, catRecomendation);
            }
            let cweList = currentCategoryListItem.getElementsByTagName('cwe');
            for (let cw = 0; cw < cweList.length; cw++) {
                categoryDetails.CweList.push(this.populateCweData(cweList[cw], categoryDetails, sevData, scanDetails, importParameters, workItemsCreationData));
            }
        }
        catch (e) {
            console.log(`Obtaining Category Details Failed for Category : ${categoryDetails.CategoryName}`);
            core.debug(`Error :${e}`);
        }
    }
    /**
     * Composes text from category recomandations
     * @param paraList Pragraphs
     * @param catRecomendation category recomandations
     * @returns String composed with category recomandations
     */
    getRecommendationParagraphText(paraList, catRecomendation) {
        core.debug("Class Name: StaticAndDynamicFlawManager, Method Name: getRecommendationParagraphText");
        for (let rp = 0; rp < paraList.length; rp++) {
            let bulletList;
            let para = new CommonData.Para();
            para.ParaText = paraList[rp].getAttribute('text');
            if (paraList[rp].childNodes.length > 0) {
                bulletList = paraList[rp].getElementsByTagName('bulletitem');
                for (let bu = 0; bu < bulletList.length; bu++) {
                    let bulletItem = new CommonData.BulletItem();
                    bulletItem.BulletText = bulletList[bu].getAttribute('text');
                    para.BulletItemList.push(bulletItem);
                }
            }
            catRecomendation.ParaList.push(para);
        }
        return catRecomendation;
    }
    /**
     * composes text from decription
     * @param paraList Get pragraph text
     * @param catDescription - Category details
     * @returns pragraph text
     */
    getMainParagraphText(paraList, catDescription) {
        core.debug("Class Name: StaticAndDynamicFlawManager, Method Name: getMainParagraphText");
        for (let rp = 0; rp < paraList.length; rp++) {
            let bulletList;
            let para = new CommonData.Para();
            para.ParaText = paraList[rp].getAttribute('text');
            if (paraList[rp].childNodes.length > 0) {
                bulletList = paraList[rp].getElementsByTagName('bulletitem');
                for (let bu = 0; bu < bulletList.length; bu++) {
                    let bulletTtem = new CommonData.BulletItem();
                    bulletTtem.BulletText = bulletList[bu].getAttribute('text');
                    para.BulletItemList.push(bulletTtem);
                }
            }
            catDescription.ParaList.push(para);
        }
        return catDescription;
    }
    /**
     * Extract xml based cew data and map same to  DTO
     *  @param {any} cweListItem - cwe Data.
     *  @return {CommonData.cweDto} - Mapped CWE DTO.\
     *  @param {CommonData.CategoryDetailedReportDto} catData - flaw category details.
     *  @param {CommonData.SeverityDetailedReportDto} sevData - flaw severity related details.
     *  @param {CommonData.ScanDto} scanDetails - veracode scan related details.
     *  @param {CommonData.FlawImporterParametersDto} importParameters - user provided parameters.
     *  @param {CommonData.workItemsDataDto} workItemsCreationData - work Items generation data.
     */
    populateCweData(cweListItem, catData, sevData, scanDetails, importParameters, workItemsCreationData) {
        core.debug("Class Name: StaticAndDynamicFlawManager, Method Name: populateCweData");
        try {
            let cweDetails = new CommonData.cweDto();
            if (cweListItem.childNodes.length > 0) {
                let cweDescription, textBlocks, cweStaticFlaws, dynamicFlaws;
                // Map cwe description
                cweDescription = cweListItem.getElementsByTagName('description')[0];
                let cweDescriptionDetails = new CommonData.CweDescription();
                if (cweDescription.childNodes.length > 0) {
                    //Get and map all text blocks under description
                    textBlocks = cweListItem.getElementsByTagName('text');
                    for (let tb = 0; tb < textBlocks.length; tb++) {
                        let descriptionText = new CommonData.DescriptionText();
                        descriptionText.Text = textBlocks[tb].getAttribute('text');
                        cweDescriptionDetails.DescriptionTextList.push(descriptionText);
                    }
                }
                cweDetails.CweId = cweListItem.getAttribute('cweid');
                cweDetails.CweName = cweListItem.getAttribute('cwename');
                cweDetails.CweDescription = cweDescriptionDetails;
                if (importParameters.ScanType == CommonData.Constants.scanType_DASTAndSAST ||
                    importParameters.ScanType == CommonData.Constants.scanType_DASTAndSAST_Old ||
                    importParameters.ScanType == CommonData.Constants.scanType_DASTAndSASTAndSCA ||
                    importParameters.ScanType == CommonData.Constants.scanType_DASTAndSASTAndSCA_Old ||
                    importParameters.ScanType == CommonData.Constants.scanType_StaticAndSCA ||
                    importParameters.ScanType == CommonData.Constants.scanType_StaticAndSCA_Old)
                    cweStaticFlaws = this.populateStaticFlawData(cweStaticFlaws, cweListItem, cweDetails, catData, sevData, scanDetails, importParameters, workItemsCreationData);
                if (importParameters.ScanType == CommonData.Constants.scanType_DASTAndSAST ||
                    importParameters.ScanType == CommonData.Constants.scanType_DASTAndSAST_Old ||
                    importParameters.ScanType == CommonData.Constants.scanType_DASTAndSASTAndSCA ||
                    importParameters.ScanType == CommonData.Constants.scanType_DASTAndSASTAndSCA_Old)
                    dynamicFlaws = this.populateDynamicFlawData(dynamicFlaws, cweListItem, cweDetails, catData, sevData, scanDetails, importParameters, workItemsCreationData);
            }
            return cweDetails;
        }
        catch (error) {
            console.log("Obtaining CWE Details Failed");
            core.debug(`Error : ${error}`);
            return new CommonData.cweDto();
        }
    }
    populateDynamicFlawData(dynamicFlaws, cweListItem, cweDetails, catData, sevData, scanDetails, importParameters, workItemsCreationData) {
        dynamicFlaws = cweListItem.getElementsByTagName('dynamicflaws');
        if (dynamicFlaws.length > 0) {
            this.populateFlawData(dynamicFlaws, cweDetails, CommonData.Constants.flawType_Dynamic, catData, sevData, scanDetails, importParameters, workItemsCreationData, importParameters.ScanTypeTag ? "DAST" : "");
        }
        return dynamicFlaws;
    }
    populateStaticFlawData(cweStaticFlaws, cweListItem, cweDetails, catData, sevData, scanDetails, importParameters, workItemsCreationData) {
        cweStaticFlaws = cweListItem.getElementsByTagName('staticflaws');
        if (cweStaticFlaws.length > 0) {
            this.populateFlawData(cweStaticFlaws, cweDetails, CommonData.Constants.flawType_Static, catData, sevData, scanDetails, importParameters, workItemsCreationData, importParameters.ScanTypeTag ? "SAST" : "");
        }
        return cweStaticFlaws;
    }
    /**
     * Extract xml based flaw data and map same to  DTO
     *  @param {list of Flaws} cweFlaws - All parameters required to call Wrapper Methods.
     *  @param {CommonData.cweDto} cweDetails - All parameters required to call Wrapper Methods.
     *  @param {string} flawType - All parameters required to call Wrapper Methods.
     *  @param {CommonData.CategoryDetailedReportDto} catData - flaw category details.
     *  @param {CommonData.SeverityDetailedReportDto} sevData - flaw severity related details.
     *  @param {CommonData.SeverityDetailedReportDto} scanDetails - veracode scan details.
     *  @param {CommonData.FlawImporterParametersDto} importParameters - user provided parameters.
     *  @param {CommonData.workItemsDataDto} workItemsCreationData - work Items generation data.
     *  @param {string} scanTypeAsTag - scan type tag value
     */
    populateFlawData(cweFlaws, cweDetails, flawType, catData, sevData, scanDetails, importParameters, workItemsCreationData, scanTypeAsTag) {
        core.debug("Class Name: StaticAndDynamicFlawManager, Method Name: populateFlawData");
        try {
            for (let cwsf = 0; cwsf < cweFlaws.length; cwsf++) {
                if (cweFlaws[cwsf].childNodes.length > 0) {
                    // Map cwe flaw details
                    let flaws = cweFlaws[cwsf].getElementsByTagName('flaw');
                    for (let f = 0; f < flaws.length; f++) {
                        let flawdetails = new CommonData.FlawDto();
                        flawdetails.FlawAffectedbyPolicy = (flaws[f].getAttribute('affects_policy_compliance') === CommonData.Constants.status_True_LowerCase);
                        flawdetails.CategoryName = flaws[f].getAttribute('categoryname');
                        flawdetails.FlawDescription = flaws[f].getAttribute('description');
                        flawdetails.IssueID = flaws[f].getAttribute('issueid');
                        flawdetails.MitigationStatus = flaws[f].getAttribute('mitigation_status');
                        flawdetails.MitigationStatusDescription = flaws[f].getAttribute('mitigation_status_desc');
                        flawdetails.Line = flaws[f].getAttribute('line');
                        flawdetails.RemediationStatus = flaws[f].getAttribute('remediation_status');
                        flawdetails.GracePeriodExpires = flaws[f].getAttribute('grace_period_expires');
                        flawdetails.FlawType = flawType;
                        if (flawType == CommonData.Constants.flawType_Static) {
                            flawdetails.Module = flaws[f].getAttribute('module');
                            flawdetails.AttackVector = flaws[f].getAttribute('type');
                            flawdetails.SourceFile = flaws[f].getAttribute('sourcefile');
                        }
                        else if (flawType == CommonData.Constants.flawType_Dynamic) {
                            flawdetails.DynamicFlawURL = flaws[f].getAttribute('url');
                            flawdetails.DynamicFlawParameter = flaws[f].getAttribute('vuln_parameter');
                        }
                        core.debug(`flawdetails.IssueID : ${flawdetails.IssueID}`);
                        flawdetails.CommentsList = this.populateFlawComments(flaws[f]);
                        cweDetails.FlawList.push(flawdetails);
                        this.generateWorkItemData(flawdetails, cweDetails, catData, sevData, importParameters, scanDetails, workItemsCreationData, scanTypeAsTag);
                    }
                }
            }
        }
        catch (error) {
            console.log(`Obtaining flaw details failed.`);
            core.debug(`Error: ${error}`);
        }
    }
    /**
     * Generate work Item data based on detailed report
     *  @param {CommonData.FlawDto} flawData - veracode flaw related data
     *  @param {CommonData.cweDto} cweData - veracode flaw cwe related data
     *  @param {CommonData.CategoryDetailedReportDto} catData - veracode flaw category related data
     *  @param {CommonData.SeverityDetailedReportDto} sevData - veracode flaw severity related data
     *  @param {CommonData.FlawImporterParametersDto} importParameters - inputs provided in VSTS UI
     *  @param {CommonData.ScanDto} scanDetails - veracode scan details
     *  @param {CommonData.workItemsDataDto} workItemsCreationData - VSTS Work Items creation related data
     *  @param {string} scanTypeAsTag - scan type tag value
     */
    generateWorkItemData(flawData, cweData, catData, sevData, importParameters, scanDetails, workItemsCreationData, scanTypeAsTag) {
        core.debug("Class Name: StaticAndDynamicFlawManager, Method Name: generateWorkItemData");
        let workItem = new CommonData.WorkItemDto();
        workItem.FlawStatus = flawData.RemediationStatus;
        workItem.Severity = sevData.Level;
        workItem.ScanTypeTag = scanTypeAsTag;
        workItem.FlawComments = this.composeWorkItemComments(flawData);
        workItem.FixByDate = importParameters.DueDateTag && flawData.GracePeriodExpires ? this.formatDueDate(flawData.GracePeriodExpires) : "";
        this.adjustWorkItemDataByType(flawData, cweData, workItem, catData, scanDetails, importParameters);
        //TypeScript 'switch case' has issues with numbers and enums.
        //Hence, the multiple 'if else'. However, this seems to be fixed with 
        //TypeScript 2.1. Here we're using TypeScript 1.8.10
        //Ref: https://stackoverflow.com/questions/27747437/typescript-enum-switch-not-working
        if (sevData.Level == 0) {
            workItem.SeverityValue = CommonData.Constants.bug_severity_Low; //Information
        }
        else if (sevData.Level == 1) {
            workItem.SeverityValue = CommonData.Constants.bug_severity_Low; //Very Low
        }
        else if (sevData.Level == 2) {
            workItem.SeverityValue = CommonData.Constants.bug_severity_Low; //Low
        }
        else if (sevData.Level == 3) {
            workItem.SeverityValue = CommonData.Constants.bug_severity_Medium; //Medium
        }
        else if (sevData.Level == 4) {
            workItem.SeverityValue = CommonData.Constants.bug_severity_High; //High
        }
        else {
            workItem.SeverityValue = CommonData.Constants.bug_severity_Critical; //Very High
        }
        this.manipulateWorkItemTags(cweData, workItem, scanDetails, importParameters, workItemsCreationData);
        workItemsCreationData.ImportType = importParameters.ImportType;
        // Filter flaws according to user preferences
        workItem.IsOpenAccordingtoMitigationStatus = true;
        workItem.AffectedbyPolicy = flawData.FlawAffectedbyPolicy;
        this.commonHelper.filterWorkItemsByFlawType(flawData, workItem, workItemsCreationData, importParameters);
    }
    /**
     * Obtain annotation data from flaw
     * @param flaw - flaw that contains annotation data
     * @param commentsList - flaw comments list
     */
    populateFlawAnnotationData(flaw, commentsList) {
        core.debug("Class Name: StaticAndDynamicFlawManager, Method Name: populateFlawAnnotationData");
        try {
            let annotations = flaw.getElementsByTagName('annotations');
            core.debug(`annotations.length: ${annotations.length}`);
            if (annotations.length > 0) {
                for (let a = 0; a < annotations.length; a++) {
                    let anotationData = annotations[a].getElementsByTagName('annotation');
                    core.debug(`anotationData.length: ${anotationData.length}`);
                    for (let annotationIndex = 0; annotationIndex < anotationData.length; annotationIndex++) {
                        let flawCommentDetails = new CommonData.CommentsDTO();
                        let annotationItem = anotationData[annotationIndex];
                        flawCommentDetails.Date = annotationItem.getAttribute('date');
                        flawCommentDetails.Comment = `${annotationItem.getAttribute('date')}: ${annotationItem.getAttribute('user')}: ${annotationItem.getAttribute('action')} <br> ${annotationItem.getAttribute('description')}`;
                        commentsList.push(flawCommentDetails);
                    }
                }
            }
        }
        catch (error) {
            console.log("Obtaining Annotation Details Failed");
            core.debug(`Error: ${error}`);
        }
    }
    /**
     * Obtain mitigation data from flaw
     * @param flaw - flaw that contains mitigation data
     * @param commentsList - flaw comments list
     */
    populateFlawMitigationData(flaw, commentsList) {
        core.debug("Class Name: StaticAndDynamicFlawManager, Method Name: populateFlawMitigationData");
        try {
            let mitigations = flaw.getElementsByTagName('mitigations');
            core.debug(`mitigations.length: ${mitigations.length}`);
            if (mitigations.length > 0) {
                for (let m = 0; m < mitigations.length; m++) {
                    let mitigationData = mitigations[m].getElementsByTagName('mitigation');
                    core.debug(`mitigationData.length: ${mitigationData.length}`);
                    for (let mitigationIndex = 0; mitigationIndex < mitigationData.length; mitigationIndex++) {
                        let flawCommentDetails = new CommonData.CommentsDTO();
                        let mitigationItem = mitigationData[mitigationIndex];
                        flawCommentDetails.Date = mitigationItem.getAttribute('date');
                        flawCommentDetails.Comment = `${mitigationItem.getAttribute('date')}: ${mitigationItem.getAttribute('user')}: ${mitigationItem.getAttribute('action')} <br> ${mitigationItem.getAttribute('description')}`;
                        commentsList.push(flawCommentDetails);
                    }
                }
            }
        }
        catch (error) {
            console.log("Obtaining Mitigation Details Failed");
            core.debug(`Error: ${error}`);
        }
    }
    /**
     * Compose WorkItem comments based on flaw data
     * @param flawData - flaw data retrieved from detailed report
     */
    composeWorkItemComments(flawData) {
        core.debug("Class Name: StaticAndDynamicFlawManager, Method Name: composeWorkItemComments");
        let tempString = "";
        if (flawData.CommentsList.length > 0) {
            let mitigationStatus = flawData.MitigationStatusDescription;
            tempString = `${CommonData.Constants.StaticAndDynamicCommentPrefix} ${mitigationStatus}`;
            for (let m = 0; m < flawData.CommentsList.length; m++) {
                tempString = `${tempString} </br> ${flawData.CommentsList[m].Comment}`;
            }
        }
        core.debug(`Comments String : ${tempString}`);
        return tempString;
    }
    /**
    *  Adjust WorkItem tags based on user inputs
    *  @param {CommonData.cweDto} cweData - veracode flaw CWE related data
    *  @param {CommonData.WorkItemDto} workItem - VSTS WorkItem related data
    *  @param {CommonData.ScanDto} scanDetails - Veracode Scan related data
    *  @param {CommonData.FlawImporterParametersDto} importParameters - inputs provided in VSTS UI
    *  @param  {CommonData.workItemsDataDto} workItemsCreationData - Contains data required for WorkItem creation
    *  @param  scanTypeAsTag - Scan type
    */
    manipulateWorkItemTags(cweData, workItem, scanDetails, importParameters, workItemsCreationData) {
        core.debug("Class Name: StaticAndDynamicFlawManager, Method Name: manipulateWorkItemTags");
        //Add CWE As Tag
        if (importParameters.AddCweTag) {
            core.debug(`Value for CWE tag identified. Value is CWE_${cweData.CweId}`);
            workItem.Tags.push(`CWE_${cweData.CweId}`);
        }
        //Add Custom Tag
        if (importParameters.AddCustomTag) {
            core.debug(`Value for Custom tag identified. Value is ${importParameters.AddCustomTag}`);
            workItem.Tags.push(importParameters.AddCustomTag);
        }
        //Add build Id as Tag
        if (importParameters.FoundInBuild) {
            core.debug(`Value for build id tag identified. Value is ${importParameters.FoundInBuild}`);
            workItem.Tags.push(`Build_${scanDetails.BuildId}`);
        }
        //Add scan name as Tag
        if (importParameters.AddScanNameAsATag) {
            core.debug(`Value for scan name tag identified. Value is ${importParameters.AddScanNameAsATag}`);
            workItem.Tags.push(workItemsCreationData.BuildVersion);
        }
        //Scan Type as Tag
        if (importParameters.ScanTypeTag) {
            core.debug(`Value for scan type tag identified. Value is ${importParameters.FoundInBuild}`);
            workItem.Tags.push(workItem.ScanTypeTag);
        }
        //Severity as Tag        
        if (importParameters.SeverityTag) {
            core.debug(`Value for severity tag identified. Value is ${importParameters.SeverityTag}`);
            workItem.Tags.push(workItem.SeverityValue);
        }
        //Due date as Tag
        if (importParameters.DueDateTag) {
            core.debug(`Value for due date tag identified. Value is ${importParameters.DueDateTag}`);
            workItem.Tags.push(workItem.FixByDate);
        }
    }
    /**
     * Adjust Work Item by Flaw Type (Dynamic , Static)
     *  @param {CommonData.FlawDto} flawData - veracode flaw related data
     *  @param {CommonData.cweDto} cweData - veracode flaw CWE related data
     *  @param {CommonData.WorkItemDto} workItem - VSTS Work Item related data
     *  @param {CommonData.CategoryDetailedReportDto} catData - veracode flaw category related data
     *  @param {CommonData.ScanDto} scanDetails - Veracode Scan related data
     *  @param {CommonData.FlawImporterParametersDto} importParameters - inputs provided in VSTS UI
     */
    adjustWorkItemDataByType(flawData, cweData, workItem, catData, scanDetails, importParameters) {
        core.debug("Class Name: StaticAndDynamicFlawManager, Method Name: adjustWorkItemDataByType");
        let cweLink, flawURL, veracodeLinks, flawCweDetails, flawModule, flawSource, attackVector, currentFlawDesc, flawReferences, currentFlawURL, dynamicParameter, wascLinkExtractedFromFlawDescription, formattedWASCLINK, sandboxNameForTitle, gracePeriodExpires;
        cweLink = CommonData.Constants.cwePageURL_prefix + cweData.CweId + CommonData.Constants.cwePageURL_postFix;
        if (importParameters.SandboxId) {
            flawURL = `${CommonData.Constants.request_Prefix}${scanDetails.AnalysisCenterUrl}${CommonData.Constants.flawURL_Infix}${scanDetails.AccountID}:${scanDetails.Appid.toString()}:${importParameters.SandboxId}:${flawData.IssueID.toString()}`;
        }
        else {
            flawURL = `${CommonData.Constants.request_Prefix}${scanDetails.AnalysisCenterUrl}${CommonData.Constants.flawURL_Infix}${scanDetails.AccountID}:${scanDetails.Appid.toString()}::${flawData.IssueID.toString()}`;
        }
        if (importParameters.SandboxName) {
            sandboxNameForTitle = `${importParameters.SandboxName}: `;
        }
        else {
            sandboxNameForTitle = "";
        }
        let descriptionParagraphs = "";
        let splitDescription = flawData.FlawDescription.split(CommonData.Constants.newLine);
        for (let index = 0; index < splitDescription.length; index++) {
            descriptionParagraphs += `${splitDescription[index]} ${CommonData.Constants.html_LineBreak}`;
        }
        if (flawData.FlawType == CommonData.Constants.flawType_Static) {
            let wascUrlRegex = new RegExp(CommonData.Constants.wascURL_RegEX);
            if (wascUrlRegex.test(flawData.FlawDescription)) {
                const match = wascUrlRegex.exec(flawData.FlawDescription);
                if (match && match[0]) {
                    wascLinkExtractedFromFlawDescription = match[0];
                    formattedWASCLINK = `<a href= ${wascLinkExtractedFromFlawDescription.substring(6, wascLinkExtractedFromFlawDescription.length - 1)} >WASC</a>`;
                }
                else {
                    formattedWASCLINK = "";
                }
            }
            else {
                formattedWASCLINK = "";
            }
            this.generateWorkItemTitle(workItem, sandboxNameForTitle, CommonData.Constants.staticFlawWorkItem_TitlePrefix, catData.CategoryName, importParameters.VeracodeAppProfile, flawData.IssueID.toString());
            veracodeLinks = `<b> Veracode Links : </b> <a href=${scanDetails.ResultPageURL}>Application</a> 
                                    <a href=${CommonData.Constants.request_Prefix}${scanDetails.AnalysisCenterUrl}${CommonData.Constants.policyPageURL_Infix}>Policy</a> 
                                    <a href=${flawURL}>Flaw</a> </br></br>`;
            flawCweDetails = `<b> CWE : </b> <a href=${cweLink}> ${cweData.CweId} </a> ${cweData.CweName} </br></br>`;
            flawModule = `<b> Module : </b> ${flawData.Module} </br></br>`;
            gracePeriodExpires = `<b> Grace Period Expires : </b> ${flawData.GracePeriodExpires} </br></br>`;
            flawSource = `<b> Source : </b> ${flawData.SourceFile} </br></br><b> Line Number : </b> ${flawData.Line} </br></br>`;
            attackVector = `<b> Attack Vector : </b>  ${flawData.AttackVector} </br></br>`;
            currentFlawDesc = `<b> Description : </b><p> ${descriptionParagraphs} </p>`;
            flawReferences = `<b> References : </b> <a href= ${cweLink} >CWE </a> ${formattedWASCLINK}`;
            this.generateWorkItemBody({ workItem, veracodeLinks: veracodeLinks, cweDetails: flawCweDetails, flawModule, flawSource, attackVector, currentFlawURL: "", dynamicParameter: "", flawDesc: currentFlawDesc, references: flawReferences, gracePeriodExpires: gracePeriodExpires });
        }
        else if (flawData.FlawType == CommonData.Constants.flawType_Dynamic) {
            this.generateWorkItemTitle(workItem, sandboxNameForTitle, CommonData.Constants.dynamicFlawWorkItem_TitlePrefix, catData.CategoryName, importParameters.VeracodeAppProfile, flawData.IssueID.toString());
            veracodeLinks = `<b> Veracode Links : </b> <a href=${scanDetails.ResultPageURL}>Application</a>
                                    <a href=${CommonData.Constants.request_Prefix}${scanDetails.AnalysisCenterUrl}${CommonData.Constants.policyPageURL_Infix}>Policy</a>
                                    <a href=${flawURL}>Flaw</a> </br></br>`;
            flawCweDetails = `<b> CWE : </b> <a href=${cweLink > cweData.CweId}  </a>  ${cweData.CweName} </br></br>`;
            currentFlawDesc = `<b> Description : </b><p> ${descriptionParagraphs} </p>`;
            gracePeriodExpires = `<b> Grace Period Expires : </b> ${flawData.GracePeriodExpires} </br></br>`;
            flawReferences = `<b> References : </b> <a href= ${cweLink} >CWE </a>`;
            currentFlawURL = `<b> URL : </b>${flawData.DynamicFlawURL}</br></br>`;
            dynamicParameter = `<b> Parameter : </b>${flawData.DynamicFlawParameter}</br></br>`;
            this.generateWorkItemBody({ workItem, veracodeLinks: veracodeLinks, cweDetails: flawCweDetails, flawModule: "", flawSource: "", attackVector: "", currentFlawURL, dynamicParameter, flawDesc: currentFlawDesc, references: flawReferences, gracePeriodExpires: gracePeriodExpires });
        }
    }
    /**
     * Generate work item body
     * @param {CommonData.WorkItemDto} workItem - Dto consists with work item details
     * @param {string} veracodeLinks - Veracode platform related links
     * @param {string} cweDetails - cew Id ,  link and name
     * @param {string} flawModule - Module that contain flaw
     * @param {string} flawSource - Source file that contain flaw
     * @param {string} attackVector - attack vector affected by vulnerability
     * @param {string} currentFlawURL - dynamic flaw Url related to current flaw
     * @param {string} dynamicParameter - parameter related to dynamic flaw
     * @param {string} flawDesc - description of flaw
     * @param {string} references - references related to flaw
     */
    generateWorkItemBody({ workItem, veracodeLinks, cweDetails, flawModule, flawSource, attackVector, currentFlawURL, dynamicParameter, flawDesc, references, gracePeriodExpires }) {
        core.debug("Class Name: StaticAndDynamicFlawManager, Method Name: generateWorkItemBody");
        workItem.Html = veracodeLinks +
            cweDetails +
            flawModule +
            flawSource +
            attackVector +
            currentFlawURL +
            gracePeriodExpires +
            dynamicParameter +
            flawDesc +
            references;
    }
    /**
     * Generate WorkItem title
     * pattern =  <Sandbox Name>: Veracode Flaw (<analysis type>): <Category Name>, <Application Name>, <Build name>, Flaw <Issue ID>
     * @param {CommonData.WorkItemDto} workItem - Dto consists with work item details
     * @param {string} sandboxNameForTitle - sandbox name
     * @param {string} analysisType - Type of flaw
     * @param {string} categoryName - Flaw category
     * @param {string} appName - veracode platform Application name
     * @param {string} flawId - veracode issue id
     */
    generateWorkItemTitle(workItem, sandboxNameForTitle, analysisType, categoryName, appName, flawId) {
        core.debug("Class Name: StaticAndDynamicFlawManager, Method Name: generateWorkItemTitle");
        workItem.Title = `${sandboxNameForTitle} ${analysisType} ${categoryName}, ${appName}, Flaw ${flawId}`;
        // trimming to remove spaces in the beginning of title
        workItem.Title = workItem.Title.trim();
    }
    /**
    * Compose and arrange flaw comments
    * @param flaw - flaw that contains annotation data
    */
    populateFlawComments(flaw) {
        core.debug("Class Name: StaticAndDynamicFlawManager, Method Name: populateFlawComments");
        try {
            let commentsList = new Array();
            this.populateFlawAnnotationData(flaw, commentsList);
            this.populateFlawMitigationData(flaw, commentsList);
            if (commentsList.length > 0) {
                commentsList.sort(function (a, b) {
                    let c = new Date(a.Date);
                    let d = new Date(b.Date);
                    return c > d ? 1 : -1;
                });
            }
            return commentsList;
        }
        catch (error) {
            console.log("Obtaining Comment Details Failed");
            core.debug(`Error: ${error}`);
            return [];
        }
    }
    /**
     * Format the due date
     * @param gracePeriodExpires - Grace period expire date
     * @returns - formatted date
     */
    formatDueDate(gracePeriodExpires) {
        core.debug("Class Name: StaticAndDynamicFlawManager, Method Name: formatDueDate");
        return `${gracePeriodExpires.substring(0, 10)}T23:59:59Z`;
    }
}
exports.StaticAndDynamicFlawManager = StaticAndDynamicFlawManager;
//# sourceMappingURL=StaticAndDynamicFlawManager.js.map