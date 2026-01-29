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
exports.FlawManager = void 0;
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
const q = __importStar(require("q"));
const CommonData = __importStar(require("./Common"));
const StaticAndDynamicFlawManager_1 = require("./StaticAndDynamicFlawManager");
const SCAFlawManager_1 = require("./SCAFlawManager");
/**
 * Arranging flaw data for work item creation
 * Extract data from detailedreport object and populate data in Work item object
 */
class FlawManager {
    manageFlaws(scanDetails, importParameters, reportDetails) {
        core.debug("Class Name: FlawManager, Method Name: manageFlaws");
        var deferred = q.defer();
        var workItemDetails = new CommonData.workItemsDataDto();
        workItemDetails.Appid = scanDetails.Appid;
        workItemDetails.BuildID = scanDetails.BuildId;
        workItemDetails.OverwriteAreaPathInWorkItemsOnImport = importParameters.OverwriteAreaPathInWorkItemsOnImport;
        workItemDetails.OverwriteIterationPathInWorkItemsOnImport = importParameters.OverwriteIterationPathInWorkItemsOnImport;
        workItemDetails.ImportType = importParameters.ImportType;
        console.log("Start Mapping Detailed Report to DTO");
        var xmlDoc;
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
                this.staticAndDynamicFlawManager = new StaticAndDynamicFlawManager_1.StaticAndDynamicFlawManager();
                this.staticAndDynamicFlawManager.captureDASTAndSASTFlawData(xmlDoc, workItemDetails, scanDetails, importParameters);
            }
            if (importParameters.ScanType != CommonData.Constants.scanType_DASTAndSAST &&
                importParameters.ScanType != CommonData.Constants.scanType_DASTAndSAST_Old) {
                this.sCAFlawManager = new SCAFlawManager_1.SCAFlawManager();
                this.adjustSCAParameters(scanDetails, xmlDoc, importParameters);
                this.sCAFlawManager.captureSCAFlawData(xmlDoc, workItemDetails, importParameters, scanDetails);
            }
            deferred.resolve(workItemDetails);
        }
        catch (error) {
            deferred.reject(error);
        }
        return deferred.promise;
    }
    /**
     * Makes necessary adjustments to support SCA flaw importing
     * @param scanDetails - scan details
     * @param xmlDoc - detailed report data
     * @param importParameters - user inputs
     */
    adjustSCAParameters(scanDetails, xmlDoc, importParameters) {
        scanDetails.AnalysisId = xmlDoc.getElementsByTagName('detailedreport')[0].getAttribute('analysis_id');
        scanDetails.StaticAnalysisUnitId = xmlDoc.getElementsByTagName('detailedreport')[0].getAttribute('static_analysis_unit_id');
        var sandboxId;
        if (importParameters.SandboxId) {
            sandboxId = importParameters.SandboxId;
        }
        else {
            sandboxId = "";
        }
        scanDetails.ComponentProfileUrl = `${CommonData.Constants.request_Prefix}${scanDetails.AnalysisCenterUrl}${CommonData.Constants.componentProfilePage_Infix}${scanDetails.AccountID}:${scanDetails.Appid}:${scanDetails.BuildId}:${scanDetails.AnalysisId}:${scanDetails.StaticAnalysisUnitId}:::::${sandboxId}`;
    }
}
exports.FlawManager = FlawManager;
//# sourceMappingURL=FlawManager.js.map