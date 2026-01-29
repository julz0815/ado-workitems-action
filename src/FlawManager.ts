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
import { StaticAndDynamicFlawManager } from './StaticAndDynamicFlawManager';
import { SCAFlawManager } from './SCAFlawManager';

// XMLDocument type from xmldom library
type XMLDocument = any;

/**
 * Arranging flaw data for work item creation
 * Extract data from detailedreport object and populate data in Work item object
 */
export class FlawManager {

    sCAFlawManager: SCAFlawManager | undefined;
    staticAndDynamicFlawManager: StaticAndDynamicFlawManager | undefined;

    manageFlaws(scanDetails: CommonData.ScanDto, importParameters: CommonData.FlawImporterParametersDto, reportDetails: string): q.Promise<CommonData.workItemsDataDto> {

        core.debug("Class Name: FlawManager, Method Name: manageFlaws");
        var deferred = q.defer<CommonData.workItemsDataDto>();
        var workItemDetails = new CommonData.workItemsDataDto();
        workItemDetails.Appid = scanDetails.Appid;
        workItemDetails.BuildID = scanDetails.BuildId;
        workItemDetails.OverwriteAreaPathInWorkItemsOnImport = importParameters.OverwriteAreaPathInWorkItemsOnImport;
        workItemDetails.OverwriteIterationPathInWorkItemsOnImport = importParameters.OverwriteIterationPathInWorkItemsOnImport;
        workItemDetails.ImportType = importParameters.ImportType;
        console.log("Start Mapping Detailed Report to DTO");
        var xmlDoc: XMLDocument;
        var DOMParser = require('@xmldom/xmldom').DOMParser;
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(reportDetails, 'text/xml');
        try {
            workItemDetails.Area = importParameters.AreaPath;
            workItemDetails.IterationPath = importParameters.IterationPath;
            workItemDetails.FlawImportLimit = importParameters.FlawImportLimit;
            if (xmlDoc.getElementsByTagName('detailedreport')[0].getAttribute('version')) {
                workItemDetails.BuildVersion = xmlDoc.getElementsByTagName('detailedreport')[0].getAttribute('version');
            }

            if (importParameters.ScanType != CommonData.Constants.scanType_OnlySCA &&
                importParameters.ScanType != CommonData.Constants.scanType_OnlySCA_Old) {
                this.staticAndDynamicFlawManager = new StaticAndDynamicFlawManager();
                this.staticAndDynamicFlawManager.captureDASTAndSASTFlawData(xmlDoc, workItemDetails, scanDetails, importParameters);
            }
            if (importParameters.ScanType != CommonData.Constants.scanType_DASTAndSAST &&
                importParameters.ScanType != CommonData.Constants.scanType_DASTAndSAST_Old) {
                this.sCAFlawManager = new SCAFlawManager();
                this.adjustSCAParameters(scanDetails, xmlDoc, importParameters);
                this.sCAFlawManager.captureSCAFlawData(xmlDoc, workItemDetails, importParameters, scanDetails);
            }

            deferred.resolve(workItemDetails);
        } catch (error) {
            deferred.reject(error);
        }
        return deferred.promise;
    }

    /**
     * Process findings from Veracode API (JSON format) directly
     * This is more efficient than converting JSON to XML and back
     */
    async manageFlawsFromAPI(
        scanDetails: CommonData.ScanDto,
        importParameters: CommonData.FlawImporterParametersDto,
        findingsData: { staticFindings?: any; scaFindings?: any }
    ): Promise<CommonData.workItemsDataDto> {
        core.debug("Class Name: FlawManager, Method Name: manageFlawsFromAPI");
        
        const workItemDetails = new CommonData.workItemsDataDto();
        workItemDetails.Appid = scanDetails.Appid;
        workItemDetails.BuildID = scanDetails.BuildId;
        workItemDetails.OverwriteAreaPathInWorkItemsOnImport = importParameters.OverwriteAreaPathInWorkItemsOnImport;
        workItemDetails.OverwriteIterationPathInWorkItemsOnImport = importParameters.OverwriteIterationPathInWorkItemsOnImport;
        workItemDetails.ImportType = importParameters.ImportType;
        workItemDetails.Area = importParameters.AreaPath;
        workItemDetails.IterationPath = importParameters.IterationPath;
        workItemDetails.FlawImportLimit = importParameters.FlawImportLimit;
        workItemDetails.BuildVersion = "1.0"; // API doesn't provide version, use default
        
        console.log("Start Mapping API Findings to DTO");
        
        try {
            const scanType = importParameters.ScanType;
            
            // Process static findings
            if ((scanType === 'Static Analysis' || scanType === 'Static Analysis and SCA') && findingsData.staticFindings) {
                this.staticAndDynamicFlawManager = new StaticAndDynamicFlawManager();
                this.staticAndDynamicFlawManager.captureDASTAndSASTFlawDataFromAPI(
                    findingsData.staticFindings,
                    workItemDetails,
                    scanDetails,
                    importParameters
                );
            }
            
            // Process SCA findings
            if ((scanType === 'Software Composition Analysis (SCA)' || scanType === 'Static Analysis and SCA') && findingsData.scaFindings) {
                this.sCAFlawManager = new SCAFlawManager();
                this.sCAFlawManager.captureSCAFlawDataFromAPI(
                    findingsData.scaFindings,
                    workItemDetails,
                    importParameters,
                    scanDetails
                );
            }
            
            return workItemDetails;
        } catch (error) {
            core.error(`Error processing API findings: ${error}`);
            throw error;
        }
    }

    /**
     * Makes necessary adjustments to support SCA flaw importing
     * @param scanDetails - scan details
     * @param xmlDoc - detailed report data
     * @param importParameters - user inputs
     */
    private adjustSCAParameters(scanDetails: CommonData.ScanDto, xmlDoc: XMLDocument, importParameters: CommonData.FlawImporterParametersDto) {
        scanDetails.AnalysisId = xmlDoc.getElementsByTagName('detailedreport')[0].getAttribute('analysis_id');
        scanDetails.StaticAnalysisUnitId = xmlDoc.getElementsByTagName('detailedreport')[0].getAttribute('static_analysis_unit_id');
        var sandboxId;
        if (importParameters.SandboxId) {
            sandboxId = importParameters.SandboxId;
        } else {
            sandboxId = "";
        }
        scanDetails.ComponentProfileUrl = `${CommonData.Constants.request_Prefix}${scanDetails.AnalysisCenterUrl}${CommonData.Constants.componentProfilePage_Infix}${scanDetails.AccountID}:${scanDetails.Appid}:${scanDetails.BuildId}:${scanDetails.AnalysisId}:${scanDetails.StaticAnalysisUnitId}:::::${sandboxId}`;
    }
}