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
exports.TeamProjectDto = exports.CommonHelper = exports.Constants = exports.VulnerableComponentDetailedReportDto = exports.ComponentVulnerability = exports.DetailedReportDto = exports.FileDto = exports.SeverityDetailedReportDto = exports.CategoryDetailedReportDto = exports.DescriptionText = exports.CweDescription = exports.cweDto = exports.BulletItem = exports.Para = exports.CategoryRecomendationsDetailedReportDto = exports.CategoryDescriptionDetailedReportDto = exports.FlawDto = exports.CommentsDTO = exports.GraphDto = exports.GraphListItemsDto = exports.SummaryReportDto = exports.SeveritySummaryReportDto = exports.CategorySummaryReportDto = exports.FlawImporterParametersDto = exports.ScanParametersDto = exports.ScanDto = exports.WorkItemDto = exports.workItemsDataDto = exports.CustomProcessTemplateDataDto = void 0;
const path = __importStar(require("path"));
const actionsCore = __importStar(require("@actions/core"));
/**
 * Holds Data About Custom process templates
 */
class CustomProcessTemplateDataDto {
    constructor() {
        this._customFields = new Map();
    }
    get WorkItemType() {
        return this._workItemType;
    }
    set WorkItemType(val) {
        this._workItemType = val;
    }
    get TemplateType() {
        return this._templateType;
    }
    set TemplateType(val) {
        this._templateType = val;
    }
    get CustomPTActiveStatus() {
        return this._customPTActiveStatus;
    }
    set CustomPTActiveStatus(val) {
        this._customPTActiveStatus = val;
    }
    get CustomPTCloseStatus() {
        return this._customPTCloseStatus;
    }
    set CustomPTCloseStatus(val) {
        this._customPTCloseStatus = val;
    }
    get CustomPTRessolvedStatus() {
        return this._customPTRessolvedStatus;
    }
    set CustomPTRessolvedStatus(val) {
        this._customPTRessolvedStatus = val;
    }
    get CustomPTNewStatus() {
        return this._customPTNewStatus;
    }
    set CustomPTNewStatus(val) {
        this._customPTNewStatus = val;
    }
    get CustomPTDesignStatus() {
        return this._customPTDesignStatus;
    }
    set CustomPTDesignStatus(val) {
        this._customPTDesignStatus = val;
    }
    get CustomFields() {
        return this._customFields;
    }
    set CustomFields(val) {
        this._customFields = val;
    }
}
exports.CustomProcessTemplateDataDto = CustomProcessTemplateDataDto;
/**
 * Holds Detailed Report details  and work Item details
 */
class workItemsDataDto {
    constructor() {
        this._severityDTOList = new Array();
        this._workItemList = new Array();
    }
    get ImportType() {
        return this._importType;
    }
    set ImportType(val) {
        this._importType = val;
    }
    get BuildVersion() {
        return this._buildVersion;
    }
    set BuildVersion(val) {
        this._buildVersion = val;
    }
    get FlawImportLimit() {
        return this._flawImportLimit;
    }
    set FlawImportLimit(val) {
        this._flawImportLimit = val;
    }
    get WorkItemList() {
        return this._workItemList;
    }
    set WorkItemList(val) {
        this.WorkItemList = val;
    }
    get Appid() {
        return this._appID;
    }
    set Appid(val) {
        this._appID = val;
    }
    get BuildID() {
        return this._BuildId;
    }
    set BuildID(val) {
        this._BuildId = val;
    }
    get SeverityDTOList() {
        return this._severityDTOList;
    }
    set SeverityDTOList(val) {
        this._severityDTOList = val;
    }
    //Number of raws to import
    get RawImportLimit() {
        return this._rawImportLimit;
    }
    set RawImportLimit(val) {
        this._rawImportLimit = val;
    }
    // Area	
    get Area() {
        return this._area;
    }
    set Area(val) {
        this._area = val;
    }
    get IterationPath() {
        return this._iterationPath;
    }
    set IterationPath(val) {
        this._iterationPath = val;
    }
    get OverwriteAreaPathInWorkItemsOnImport() {
        return this._overwriteAreaPathInWorkItemsOnImport;
    }
    set OverwriteAreaPathInWorkItemsOnImport(val) {
        this._overwriteAreaPathInWorkItemsOnImport = val;
    }
    get OverwriteIterationPathInWorkItemsOnImport() {
        return this._overwriteIterationPathInWorkItemsOnImport;
    }
    set OverwriteIterationPathInWorkItemsOnImport(val) {
        this._overwriteIterationPathInWorkItemsOnImport = val;
    }
}
exports.workItemsDataDto = workItemsDataDto;
/**
 * workItemDto holds work items
 */
class WorkItemDto {
    constructor() {
        this._tags = new Array();
    }
    get FlawComments() {
        return this._flawComments;
    }
    set FlawComments(val) {
        this._flawComments = val;
    }
    get AffectedbyPolicy() {
        return this._affectedbyPolicy;
    }
    set AffectedbyPolicy(val) {
        this._affectedbyPolicy = val;
    }
    get FlawStatus() {
        return this._flawStatus;
    }
    set FlawStatus(val) {
        this._flawStatus = val;
    }
    get Html() {
        return this._html;
    }
    set Html(val) {
        this._html = val;
    }
    get IsOpenAccordingtoMitigationStatus() {
        return this._isOpenAccordingtoMitigationStatus;
    }
    set IsOpenAccordingtoMitigationStatus(val) {
        this._isOpenAccordingtoMitigationStatus = val;
    }
    get Tags() {
        return this._tags;
    }
    set Tags(val) {
        this._tags = val;
    }
    get SeverityValue() {
        return this._severityValue;
    }
    set SeverityValue(val) {
        this._severityValue = val;
    }
    get Title() {
        return this._title;
    }
    set Title(val) {
        this._title = val;
    }
    get Severity() {
        return this._severity;
    }
    set Severity(val) {
        this._severity = val;
    }
    get FixByDate() {
        return this._fixByDate;
    }
    set FixByDate(val) {
        this._fixByDate = val;
    }
    get ScanTypeTag() {
        return this._scanTypeAsTag;
    }
    set ScanTypeTag(val) {
        this._scanTypeAsTag = val;
    }
    get SeverityTag() {
        return this._severityAsTag;
    }
    set SeverityTag(val) {
        this._severityAsTag = val;
    }
}
exports.WorkItemDto = WorkItemDto;
/**
 * ScanDTO : Holds Scan Results /Application Related Data
 */
class ScanDto {
    get AnalysisType() {
        return this._analysis_type;
    }
    set AnalysisType(val) {
        this._analysis_type = val;
    }
    get PublishedDate() {
        return this._published_date;
    }
    set PublishedDate(val) {
        this._published_date = val;
    }
    get ScanFileCount() {
        return this._FileCount;
    }
    set ScanFileCount(val) {
        this._FileCount = val;
    }
    get BuildStatus() {
        return this._buildStatus;
    }
    set BuildStatus(val) {
        this._buildStatus = val;
    }
    get PolicyComplianceStatus() {
        return this._policyComplianceStatus;
    }
    set PolicyComplianceStatus(val) {
        this._policyComplianceStatus = val;
    }
    get BuildId() {
        return this._buildId;
    }
    set BuildId(val) {
        this._buildId = val;
    }
    get OldBuildId() {
        return this._oldBuildId;
    }
    set OldBuildId(val) {
        this._oldBuildId = val;
    }
    get Appid() {
        return this._appID;
    }
    set Appid(val) {
        this._appID = val;
    }
    get AppName() {
        return this._appName;
    }
    set AppName(val) {
        this._appName = val;
    }
    get AccountID() {
        return this._accountID;
    }
    set AccountID(val) {
        this._accountID = val;
    }
    get ResultPageURL() {
        return this._resultPageURL;
    }
    set ResultPageURL(val) {
        this._resultPageURL = val;
    }
    get AnalysisCenterUrl() {
        return this._analysisCenterUrl;
    }
    set AnalysisCenterUrl(val) {
        this._analysisCenterUrl = val;
    }
    get AnalysisId() {
        return this._analysisId;
    }
    set AnalysisId(val) {
        this._analysisId = val;
    }
    get StaticAnalysisUnitId() {
        return this._staticAnalysisUnitId;
    }
    set StaticAnalysisUnitId(val) {
        this._staticAnalysisUnitId = val;
    }
    get ComponentProfileUrl() {
        return this._componentProfileUrl;
    }
    set ComponentProfileUrl(val) {
        this._componentProfileUrl = val;
    }
}
exports.ScanDto = ScanDto;
/**
 * BuildDTO : Holds Build Scan Data
 */
class ScanParametersDto {
    constructor() {
        this._optArgs = [];
        this._failBuildOnPolicyFail = false;
        this._vID = "";
        this._vKey = "";
        this._veracodeAPIWrapper = "";
        this._scanStatusCheckInterval = 0;
        this._importResults = false;
        this._isMainSummaryReport = false;
        this._stagingFilesPath = "";
    }
    get StagingFilesPath() {
        return this._stagingFilesPath;
    }
    set StagingFilesPath(val) {
        this._stagingFilesPath = val;
    }
    get SandboxName() {
        return this._sandboxName;
    }
    set SandboxName(val) {
        this._sandboxName = val;
    }
    get IsMainSummaryReport() {
        return this._isMainSummaryReport;
    }
    set IsMainSummaryReport(val) {
        this._isMainSummaryReport = val;
    }
    get ApiAction() {
        return this._apiAction;
    }
    set ApiAction(val) {
        this._apiAction = val;
    }
    get IsScandboxScan() {
        return this._isSAndboxScan;
    }
    set IsScandboxScan(val) {
        this._isSAndboxScan = val;
    }
    get Filepath() {
        return this._filepath;
    }
    set Filepath(val) {
        this._filepath = val;
    }
    get IdKeyString() {
        return this._idKeyString;
    }
    set IdKeyString(val) {
        this._idKeyString = val;
    }
    get VeracodeAppProfile() {
        return this._veracodeAppProfile;
    }
    set VeracodeAppProfile(val) {
        this._veracodeAppProfile = val;
    }
    get CreateProfile() {
        return this._createProfile;
    }
    set CreateProfile(val) {
        this._createProfile = val;
    }
    get CredentialType() {
        return this._credentialType;
    }
    set CredentialType(val) {
        this._credentialType = val;
    }
    get IsUsernamePasswordCredentialType() {
        return this._isUsernamePasswordCredentialType;
    }
    set IsUsernamePasswordCredentialType(val) {
        this._isUsernamePasswordCredentialType = val;
    }
    get Username() {
        return this._username;
    }
    set Username(val) {
        this._username = val;
    }
    get Password() {
        return this._password;
    }
    set Password(val) {
        this._password = val;
    }
    get Version() {
        return this._version;
    }
    set Version(val) {
        this._version = val;
    }
    get SandboxId() {
        return this._sandboxId;
    }
    set SandboxId(val) {
        this._sandboxId = val;
    }
    get OptArgs() {
        return this._optArgs;
    }
    set OptArgs(val) {
        this._optArgs = val;
    }
    get FailBuildOnPolicyFail() {
        return this._failBuildOnPolicyFail;
    }
    set FailBuildOnPolicyFail(val) {
        this._failBuildOnPolicyFail = val;
    }
    get ImportResults() {
        return this._importResults;
    }
    set ImportResults(val) {
        this._importResults = val;
    }
    get VID() {
        return this._vID;
    }
    set VID(val) {
        this._vID = val;
    }
    get VKey() {
        return this._vKey;
    }
    set VKey(val) {
        this._vKey = val;
    }
    get VeracodeAPIWrapper() {
        return this._veracodeAPIWrapper;
    }
    set VeracodeAPIWrapper(val) {
        this._veracodeAPIWrapper = val;
    }
    get ScanStatusCheckInterval() {
        return this._scanStatusCheckInterval;
    }
    set ScanStatusCheckInterval(val) {
        this._scanStatusCheckInterval = val;
    }
}
exports.ScanParametersDto = ScanParametersDto;
class FlawImporterParametersDto {
    constructor() {
        this._customFields = new Map();
    }
    get IsValidationsSuccess() {
        return this._isValidationsSuccess;
    }
    set IsValidationsSuccess(val) {
        this._isValidationsSuccess = val;
    }
    //proxy related properties
    get Pport() {
        return this._pport;
    }
    set Pport(val) {
        this._pport = val;
    }
    get Phost() {
        return this._phost;
    }
    set Phost(val) {
        this._phost = val;
    }
    get Puser() {
        return this._puser;
    }
    set Puser(val) {
        this._puser = val;
    }
    get Ppassword() {
        return this._ppassword;
    }
    set Ppassword(val) {
        this._ppassword = val;
    }
    get ApiAction() {
        return this._apiAction;
    }
    set ApiAction(val) {
        this._apiAction = val;
    }
    get VID() {
        return this._vID;
    }
    set VID(val) {
        this._vID = val;
    }
    get VKey() {
        return this._vKey;
    }
    set VKey(val) {
        this._vKey = val;
    }
    get VeracodeAppProfile() {
        return this._veracodeAppProfile;
    }
    set VeracodeAppProfile(val) {
        this._veracodeAppProfile = val;
    }
    get SandboxName() {
        return this._sandboxName;
    }
    set SandboxName(val) {
        this._sandboxName = val;
    }
    get SandboxId() {
        return this._sandboxId;
    }
    set SandboxId(val) {
        this._sandboxId = val;
    }
    get ImportType() {
        return this._importType;
    }
    set ImportType(val) {
        this._importType = val;
    }
    get WorkItemType() {
        return this._workItemType;
    }
    set WorkItemType(val) {
        this._workItemType = val;
    }
    get AreaPath() {
        return this._areaPath;
    }
    set AreaPath(val) {
        this._areaPath = val;
    }
    get IterationPath() {
        return this._iterationPath;
    }
    set IterationPath(val) {
        this._iterationPath = val;
    }
    get AddCweTag() {
        return this._addCweTag;
    }
    set AddCweTag(val) {
        this._addCweTag = val;
    }
    get AddCveTag() {
        return this._addCveTag;
    }
    set AddCveTag(val) {
        this._addCveTag = val;
    }
    get AddCustomTag() {
        return this._addCustomTag;
    }
    set AddCustomTag(val) {
        this._addCustomTag = val;
    }
    get FoundInBuild() {
        return this._foundInBuild;
    }
    set FoundInBuild(val) {
        this._foundInBuild = val;
    }
    get FlawImportLimit() {
        return this._flawImportLimit;
    }
    set FlawImportLimit(val) {
        this._flawImportLimit = val;
    }
    get VeracodeAPIWrapper() {
        return this._veracodeAPIWrapper;
    }
    set VeracodeAPIWrapper(val) {
        this._veracodeAPIWrapper = val;
    }
    get IsDebugEnabled() {
        return this._isDebugEnabled;
    }
    set IsDebugEnabled(val) {
        this._isDebugEnabled = val;
    }
    get CustomFields() {
        return this._customFields;
    }
    set CustomFields(val) {
        this._customFields = val;
    }
    get OverwriteAreaPathInWorkItemsOnImport() {
        return this._overwriteAreaPathInWorkItemsOnImport;
    }
    set OverwriteAreaPathInWorkItemsOnImport(val) {
        this._overwriteAreaPathInWorkItemsOnImport = val;
    }
    get OverwriteIterationPathInWorkItemsOnImport() {
        return this._overwriteIterationPathInWorkItemsOnImport;
    }
    set OverwriteIterationPathInWorkItemsOnImport(val) {
        this._overwriteIterationPathInWorkItemsOnImport = val;
    }
    get AddScanNameAsATag() {
        return this._addScanNameAsATag;
    }
    set AddScanNameAsATag(val) {
        this._addScanNameAsATag = val;
    }
    get ScanType() {
        return this._scanType;
    }
    set ScanType(val) {
        this._scanType = val;
    }
    get FailBuildIfFlawImporterBuildStepFails() {
        return this._failBuildIfFlawImporterBuildStepFails;
    }
    set FailBuildIfFlawImporterBuildStepFails(val) {
        this._failBuildIfFlawImporterBuildStepFails = val;
    }
    get ScanTypeTag() {
        return this._scanTypeAsTag;
    }
    set ScanTypeTag(val) {
        this._scanTypeAsTag = val;
    }
    get SeverityTag() {
        return this._severityAsTag;
    }
    set SeverityTag(val) {
        this._severityAsTag = val;
    }
    get DueDateTag() {
        return this._dueDateAsTag;
    }
    set DueDateTag(val) {
        this._dueDateAsTag = val;
    }
    get AdoToken() {
        return this._adoToken;
    }
    set AdoToken(val) {
        this._adoToken = val;
    }
    get AdoOrg() {
        return this._adoOrg;
    }
    set AdoOrg(val) {
        this._adoOrg = val;
    }
    get AdoProject() {
        return this._adoProject;
    }
    set AdoProject(val) {
        this._adoProject = val;
    }
}
exports.FlawImporterParametersDto = FlawImporterParametersDto;
/**
 * Holds Data About Security Vulnerability Category
 */
class CategorySummaryReportDto {
    constructor() {
        this._categoryname = "";
        this._count = 0;
    }
    get CategoryName() {
        return this._categoryname;
    }
    set CategoryName(val) {
        this._categoryname = val;
    }
    get Count() {
        return this._count;
    }
    set Count(val) {
        this._count = val;
    }
}
exports.CategorySummaryReportDto = CategorySummaryReportDto;
/**
 * Holds data about Severity
 */
class SeveritySummaryReportDto {
    constructor() {
        this._level = 0;
        this._totalFailedCount = 0;
        this._severityName = "";
        this._categoryList = new Array();
    }
    get TotalFailedCount() {
        return this._totalFailedCount;
    }
    set TotalFailedCount(val) {
        this._totalFailedCount = val;
    }
    get SeverityName() {
        return this._severityName;
    }
    set SeverityName(val) {
        this._severityName = val;
    }
    get Level() {
        return this._level;
    }
    set Level(val) {
        this._level = val;
    }
    get CategoryList() {
        return this._categoryList;
    }
    set CategoryList(val) {
        this._categoryList = val;
    }
}
exports.SeveritySummaryReportDto = SeveritySummaryReportDto;
/**
 * Holds SummaryReport details
 */
class SummaryReportDto {
    constructor() {
        this._policy_name = "";
        this._veracode_level = "";
        this._version = "";
        this._score = 0;
        this._summaryReportbuildID = "";
        this._policyComplianceStatus = "";
        this._staticAnalysisFrequency = "";
        this._resultPageURL = "";
        this._appID = "";
        this._totalFlaws = "";
        this._totalNewFlaws = "";
        this._reportType = "";
        this._severityDTOList = new Array();
        this._graphDTO = new GraphDto();
    }
    get ReportType() {
        return this._reportType;
    }
    set ReportType(val) {
        this._reportType = val;
    }
    get GraphDTO() {
        return this._graphDTO;
    }
    set GraphDTO(val) {
        this._graphDTO = val;
    }
    get TotalFlaws() {
        return this._totalFlaws;
    }
    set TotalFlaws(val) {
        this._totalFlaws = val;
    }
    get TotalNewFlaws() {
        return this._totalNewFlaws;
    }
    set TotalNewFlaws(val) {
        this._totalNewFlaws = val;
    }
    get Appid() {
        return this._appID;
    }
    set Appid(val) {
        this._appID = val;
    }
    get ResultPageURL() {
        return this._resultPageURL;
    }
    set ResultPageURL(val) {
        this._resultPageURL = val;
    }
    get StaticAnalysisFrequency() {
        return this._staticAnalysisFrequency;
    }
    set StaticAnalysisFrequency(val) {
        this._staticAnalysisFrequency = val;
    }
    get PolicyComplianceStatus() {
        return this._policyComplianceStatus;
    }
    set PolicyComplianceStatus(val) {
        this._policyComplianceStatus = val;
    }
    get SummaryReportbuildID() {
        return this._summaryReportbuildID;
    }
    set SummaryReportbuildID(val) {
        this._summaryReportbuildID = val;
    }
    get SeverityDTOList() {
        return this._severityDTOList;
    }
    set SeverityDTOList(val) {
        this._severityDTOList = val;
    }
    get PolicyName() {
        return this._policy_name;
    }
    set PolicyName(val) {
        this._policy_name = val;
    }
    get VeracodeLevel() {
        return this._veracode_level;
    }
    set VeracodeLevel(val) {
        this._veracode_level = val;
    }
    get Version() {
        return this._version;
    }
    set Version(val) {
        this._version = val;
    }
    get Score() {
        return this._score;
    }
    set Score(val) {
        this._score = val;
    }
}
exports.SummaryReportDto = SummaryReportDto;
class GraphListItemsDto {
    constructor() {
        this._buildDate = "";
        this._totalFlaws = "";
        this._flawPrecentage = "";
    }
    get FlawPrecentage() {
        return this._flawPrecentage;
    }
    set FlawPrecentage(val) {
        this._flawPrecentage = val;
    }
    get TotalFlaws() {
        return this._totalFlaws;
    }
    set TotalFlaws(val) {
        this._totalFlaws = val;
    }
    get BuildDate() {
        return this._buildDate;
    }
    set BuildDate(val) {
        this._buildDate = val;
    }
}
exports.GraphListItemsDto = GraphListItemsDto;
/**
* Holds Graph details to display on Summary Report
*/
class GraphDto {
    constructor() {
        this._appID = "";
        this._buildID = "";
        this._allBuildIDs = [];
        this._currentBuildIDs = [];
        this._graphListItemsDTOList = new Array();
    }
    get GraphListItemsDTOList() {
        return this._graphListItemsDTOList;
    }
    set GraphListItemsDTOList(val) {
        this._graphListItemsDTOList = val;
    }
    get APPID() {
        return this._appID;
    }
    set APPID(val) {
        this._appID = val;
    }
    get BuildID() {
        return this._buildID;
    }
    set BuildID(val) {
        this._buildID = val;
    }
    get AllBuildIDs() {
        return this._allBuildIDs;
    }
    set AllBuildIDs(val) {
        this._allBuildIDs = val;
    }
    get CurrentBuildIDs() {
        return this._currentBuildIDs;
    }
    set CurrentBuildIDs(val) {
        this._currentBuildIDs = val;
    }
}
exports.GraphDto = GraphDto;
/**
 * Holds work item Comments Data
 */
class CommentsDTO {
    constructor() {
        this._date = "";
        this._comment = "";
    }
    get Date() {
        return this._date;
    }
    set Date(val) {
        this._date = val;
    }
    get Comment() {
        return this._comment;
    }
    set Comment(val) {
        this._comment = val;
    }
}
exports.CommentsDTO = CommentsDTO;
/**
 * Holds Data About Security Flaws of Details report
 */
class FlawDto {
    constructor() {
        this._categoryname = "";
        this._issueID = 0;
        this._flawDescription = "";
        this._mitigationStatus = "";
        this._line = "";
        this._sourcefile = "";
        this._module = "";
        this._flawAffectedbyPolicy = false;
        this._attackVector = "";
        this._remediation_status = "";
        this._flawType = "";
        this._dynamicFlawUrl = "";
        this._dynamicFlawParameter = "";
        this._mitigationStatusDescription = "";
        this._gracePeriodExpires = "";
        this._commentsList = new Array();
    }
    get CommentsList() {
        return this._commentsList;
    }
    set CommentsList(val) {
        this._commentsList = val;
    }
    get DynamicFlawURL() {
        return this._dynamicFlawUrl;
    }
    set DynamicFlawURL(val) {
        this._dynamicFlawUrl = val;
    }
    get DynamicFlawParameter() {
        return this._dynamicFlawParameter;
    }
    set DynamicFlawParameter(val) {
        this._dynamicFlawParameter = val;
    }
    get FlawType() {
        return this._flawType;
    }
    set FlawType(val) {
        this._flawType = val;
    }
    get RemediationStatus() {
        return this._remediation_status;
    }
    set RemediationStatus(val) {
        this._remediation_status = val;
    }
    get AttackVector() {
        return this._attackVector;
    }
    set AttackVector(val) {
        this._attackVector = val;
    }
    get FlawAffectedbyPolicy() {
        return this._flawAffectedbyPolicy;
    }
    set FlawAffectedbyPolicy(val) {
        this._flawAffectedbyPolicy = val;
    }
    get Line() {
        return this._line;
    }
    set Line(val) {
        this._line = val;
    }
    get SourceFile() {
        return this._sourcefile;
    }
    set SourceFile(val) {
        this._sourcefile = val;
    }
    get Module() {
        return this._module;
    }
    set Module(val) {
        this._module = val;
    }
    get IssueID() {
        return this._issueID;
    }
    set IssueID(val) {
        this._issueID = val;
    }
    get CategoryName() {
        return this._categoryname;
    }
    set CategoryName(val) {
        this._categoryname = val;
    }
    get FlawDescription() {
        return this._flawDescription;
    }
    set FlawDescription(val) {
        this._flawDescription = val;
    }
    get MitigationStatus() {
        return this._mitigationStatus;
    }
    set MitigationStatus(val) {
        this._mitigationStatus = val;
    }
    get MitigationStatusDescription() {
        return this._mitigationStatusDescription;
    }
    set MitigationStatusDescription(val) {
        this._mitigationStatusDescription = val;
    }
    get GracePeriodExpires() {
        return this._gracePeriodExpires;
    }
    set GracePeriodExpires(val) {
        this._gracePeriodExpires = val;
    }
}
exports.FlawDto = FlawDto;
/**
 * Holds Main Category Description of Details report
 */
class CategoryDescriptionDetailedReportDto {
    constructor() {
        this._paraList = new Array();
    }
    get ParaList() {
        return this._paraList;
    }
    set ParaList(val) {
        this._paraList = val;
    }
}
exports.CategoryDescriptionDetailedReportDto = CategoryDescriptionDetailedReportDto;
/**
 * Holds Main Category Recomendations of Details report
 */
class CategoryRecomendationsDetailedReportDto {
    constructor() {
        this._paraList = new Array();
    }
    get ParaList() {
        return this._paraList;
    }
    set ParaList(val) {
        this._paraList = val;
    }
}
exports.CategoryRecomendationsDetailedReportDto = CategoryRecomendationsDetailedReportDto;
/**
 * Holds paragraph details
 */
class Para {
    constructor() {
        this._paraText = "";
        this._bulletItemList = new Array();
    }
    get BulletItemList() {
        return this._bulletItemList;
    }
    set BulletItemList(val) {
        this._bulletItemList = val;
    }
    get ParaText() {
        return this._paraText;
    }
    set ParaText(val) {
        this._paraText = val;
    }
}
exports.Para = Para;
/**
 * Holds bullet item details
 */
class BulletItem {
    constructor() {
        this._bulletText = "";
    }
    get BulletText() {
        return this._bulletText;
    }
    set BulletText(val) {
        this._bulletText = val;
    }
}
exports.BulletItem = BulletItem;
/**
 * Holds Data About cwe Data
 */
class cweDto {
    constructor() {
        this._cweId = "";
        this._cweName = "";
        this._cweDescription = new CweDescription();
        this._flawList = new Array();
    }
    get CweDescription() {
        return this._cweDescription;
    }
    set CweDescription(val) {
        this._cweDescription = val;
    }
    get FlawList() {
        return this._flawList;
    }
    set FlawList(val) {
        this._flawList = val;
    }
    get CweId() {
        return this._cweId;
    }
    set CweId(val) {
        this._cweId = val;
    }
    get CweName() {
        return this._cweName;
    }
    set CweName(val) {
        this._cweName = val;
    }
}
exports.cweDto = cweDto;
/**
 * Holds Data About cwe description
 */
class CweDescription {
    constructor() {
        this._descriptionTextList = new Array();
    }
    get DescriptionTextList() {
        return this._descriptionTextList;
    }
    set DescriptionTextList(val) {
        this._descriptionTextList = val;
    }
}
exports.CweDescription = CweDescription;
/**
 * Holds Data About cwe description text
 */
class DescriptionText {
    constructor() {
        this._text = "";
    }
    get Text() {
        return this._text;
    }
    set Text(val) {
        this._text = val;
    }
}
exports.DescriptionText = DescriptionText;
/**
 * Holds Data About Security Vulnerability Category of Details report
 */
class CategoryDetailedReportDto {
    constructor() {
        this._categoryname = "";
        this._categoryDescription = new CategoryDescriptionDetailedReportDto();
        this._categoryRecomendations = new CategoryRecomendationsDetailedReportDto();
        this._cweList = new Array();
    }
    get CweList() {
        return this._cweList;
    }
    set CweList(val) {
        this._cweList = val;
    }
    get Recomendations() {
        return this._categoryRecomendations;
    }
    set Recomendations(val) {
        this._categoryRecomendations = val;
    }
    get Description() {
        return this._categoryDescription;
    }
    set Description(val) {
        this._categoryDescription = val;
    }
    get CategoryName() {
        return this._categoryname;
    }
    set CategoryName(val) {
        this._categoryname = val;
    }
}
exports.CategoryDetailedReportDto = CategoryDetailedReportDto;
/**
 * Holds data about Severity of Details report
 */
class SeverityDetailedReportDto {
    constructor() {
        this._level = 0;
        this._categoryList = new Array();
    }
    get Level() {
        return this._level;
    }
    set Level(val) {
        this._level = val;
    }
    get CategoryList() {
        return this._categoryList;
    }
    set CategoryList(val) {
        this._categoryList = val;
    }
}
exports.SeverityDetailedReportDto = SeverityDetailedReportDto;
class FileDto {
    constructor() {
        this._sourcePath = "";
        this._size = 0;
    }
    get SourcePath() {
        return this._sourcePath;
    }
    set SourcePath(val) {
        this._sourcePath = val;
    }
    get Size() {
        return this._size;
    }
    set Size(val) {
        this._size = val;
    }
}
exports.FileDto = FileDto;
/**
 * Holds SummaryReport details
 */
class DetailedReportDto {
    constructor() {
        this._appID = "";
        this._BuildId = "";
        this._severityDTOList = new Array();
        this._titleList = new Array();
    }
    get TitleList() {
        return this._titleList;
    }
    set TitleList(val) {
        this._titleList = val;
    }
    get Appid() {
        return this._appID;
    }
    set Appid(val) {
        this._appID = val;
    }
    get BuildID() {
        return this._BuildId;
    }
    set BuildID(val) {
        this._BuildId = val;
    }
    get SeverityDTOList() {
        return this._severityDTOList;
    }
    set SeverityDTOList(val) {
        this._severityDTOList = val;
    }
}
exports.DetailedReportDto = DetailedReportDto;
/**
 * Holds SCA Component vulnerability data
 */
class ComponentVulnerability {
    constructor() {
        this._cveId = "";
        this._cveSummary = "";
        this._cweId = "";
        this._isMitigation = false;
        this._mitigationType = "";
        this._mitigationCommentOnFlawClosure = "";
        this._severity = "";
        this._doesAffectPolicy = false;
        this._firstFoundDate = "";
        this._filePathList = new Array();
    }
    get CveId() {
        return this._cveId;
    }
    set CveId(val) {
        this._cveId = val;
    }
    get CveSummary() {
        return this._cveSummary;
    }
    set CveSummary(val) {
        this._cveSummary = val;
    }
    get CweId() {
        return this._cweId;
    }
    set CweId(val) {
        this._cweId = val;
    }
    get IsMitigation() {
        return this._isMitigation;
    }
    set IsMitigation(val) {
        this._isMitigation = val;
    }
    get MitigationType() {
        return this._mitigationType;
    }
    set MitigationType(val) {
        this._mitigationType = val;
    }
    get MitigationCommentOnFlawClosure() {
        return this._mitigationCommentOnFlawClosure;
    }
    set MitigationCommentOnFlawClosure(val) {
        this._mitigationCommentOnFlawClosure = val;
    }
    get Severity() {
        return this._severity;
    }
    set Severity(val) {
        this._severity = val;
    }
    get DoesAffectPolicy() {
        return this._doesAffectPolicy;
    }
    set DoesAffectPolicy(val) {
        this._doesAffectPolicy = val;
    }
    get FirstFoundDate() {
        return this._firstFoundDate;
    }
    set FirstFoundDate(val) {
        this._firstFoundDate = val;
    }
    get FilePathList() {
        return this._filePathList;
    }
    set FilePathList(val) {
        this._filePathList = val;
    }
}
exports.ComponentVulnerability = ComponentVulnerability;
/**
* Holds data about Vulnerable Components (SCA findings)
*/
class VulnerableComponentDetailedReportDto {
    constructor() {
        this._library = "";
        this._componentId = "";
        this._version = "";
        this._vulnerabilities = new Array();
        this._FilePathsList = new Array();
    }
    get Library() {
        return this._library;
    }
    set Library(val) {
        this._library = val;
    }
    get ComponentId() {
        return this._componentId;
    }
    set ComponentId(val) {
        this._componentId = val;
    }
    get Version() {
        return this._version;
    }
    set Version(val) {
        this._version = val;
    }
    get Vulnerabilities() {
        return this._vulnerabilities;
    }
    set Vulnerabilities(val) {
        this._vulnerabilities = val;
    }
    isMitigated() {
        for (var i = 0; i < this._vulnerabilities.length; i++) {
            if (this._vulnerabilities[i].IsMitigation) {
                return false;
            }
        }
        return true;
    }
    get FilePathsList() {
        return this._FilePathsList;
    }
    set FilePathsList(value) {
        this._FilePathsList = value;
    }
}
exports.VulnerableComponentDetailedReportDto = VulnerableComponentDetailedReportDto;
/**
 * Holds Constants used throughout extension
 */
class Constants {
    //user metadata
    static get usermetadata_ExtensionVersion() { return "1.0.0"; }
    static get usermetadata_Name() { return "VeracodeVSTSExtension"; }
    static get usermetadata_Unknown() { return "Unknown"; }
    // Build Status related constants
    static get BuildStatus_incomplete() { return "Incomplete"; }
    static get BuildStatus_notsubmitted() { return "Not Submitted to Engine"; }
    static get BuildStatus_submitted() { return "Submitted to Engine"; }
    static get BuildStatus_scanerrors() { return "Scan Errors"; }
    static get BuildStatus_scaninprocess() { return "Scan In Process"; }
    static get BuildStatus_scancancelled() { return "Scan Cancelled"; }
    static get BuildStatus_internalerror() { return "Scan Internal Error"; }
    static get BuildStatus_pendinginternalreview() { return "Pending Internal Review"; }
    static get BuildStatus_resultsready() { return "Results Ready"; }
    static get BuildStatus_preflightsubmitted() { return "Pre-Scan Submitted"; }
    static get BuildStatus_preflightfailed() { return "Pre-Scan Failed"; }
    static get BuildStatus_preflightsuccess() { return "Pre-Scan Success"; }
    static get BuildStatus_preflightnomodules() { return "No Modules Defined"; }
    static get BuildStatus_pendingvendoracceptance() { return "Pending Vendor Confirmation"; }
    static get BuildStatus_preflightcancelled() { return "Pre-Scan Cancelled"; }
    static get BuildStatus_scanonhold() { return "Scan On Hold"; }
    static get BuildStatus_timeframepending() { return "Timeframe Pending"; }
    static get BuildStatus_paused() { return "Paused"; }
    static get BuildStatus_stopping() { return "Stopping"; }
    static get BuildStatus_pausing() { return "Pausing"; }
    static get BuildStatus_NoModulesDefined() { return "No Modules Defined"; }
    // Policy Compliance Status related constants
    static get policycompliancestatus_determining() { return "Calculating..."; }
    static get policycompliancestatus_not_assessed() { return "Not Assessed"; }
    static get policycompliancestatus_did_not_pass() { return "Did Not Pass"; }
    static get policycompliancestatus_conditional_pass() { return "Conditional Pass"; }
    static get policycompliancestatus_passed() { return "Pass"; }
    static get policycompliancestatus_vendor_review() { return "Under Vendor Review"; }
    static get status_passed() { return "Passed"; }
    static get status_failed() { return "Failed"; }
    static get status_False_TitleCase() { return "False"; }
    static get status_False_LowerCase() { return "false"; }
    static get status_False_UpperCase() { return "FALSE"; }
    static get status_True_TitleCase() { return "True"; }
    static get status_True_LowerCase() { return "true"; }
    static get status_True_UpperCase() { return "TRUE"; }
    static get string_NotAvailable() { return "NA"; }
    static get string_Empty() { return ""; }
    static get string_undefined() { return 'undefined'; }
    static get application_Criticality_VeryHigh() { return "VeryHigh"; }
    static get processTemplate_Agile() { return 'Agile'; }
    static get processTemplate_Scrum() { return 'Scrum'; }
    static get processTemplate_CMMI() { return 'CMMI'; }
    static get processTemplate_Basic() { return 'Basic'; }
    static get processTemplate_Custom() { return 'Custom'; }
    static get wiType_Issue() { return 'Issue'; }
    static get wiType_Bug() { return 'Bug'; }
    static get wiType_Task() { return 'Task'; }
    static get wiType_TestCase() { return 'Test Case'; }
    static get veracodePlatformResultPage_Infix() { return "/auth/index.jsp#HomeAppProfile:"; }
    static get componentProfilePage_Infix() { return "/auth/index.jsp#ReviewResultsSCA:"; }
    static get request_Prefix() { return "https://"; }
    static get flawURL_Infix() { return "/auth/index.jsp#ReviewResultsFlaw:"; }
    static get policyPageURL_Infix() { return "/auth/index.jsp#Policies"; }
    static get cwePageURL_prefix() { return "http://cwe.mitre.org/data/definitions/"; }
    static get cvePageURL_prefix() { return "https://nvd.nist.gov/vuln/detail/"; }
    static get cwePageURL_postFix() { return ".html"; }
    // File paths and names	
    static get apiWrapperName() { return 'VeracodeJavaAPI.jar'; }
    static get detailedReportFolderLocation() { return path.join(__dirname, "reports"); }
    static get detailedReportFileName() { return "detailedReportdata_FI.xml"; }
    // API Actions	
    static get apiAction_GetApplist() { return 'getapplist'; }
    static get apiAction_GetBuildInfo() { return 'getbuildinfo'; }
    static get apiAction_GetBuildList() { return 'getbuildlist'; }
    static get apiAction_GetSandBoxlist() { return 'getsandboxlist'; }
    static get apiAction_GetDetailedReport() { return 'detailedreport'; }
    static get apiAction_GetRegion() { return 'getregion'; }
    static get apiAction_GetBuildDetailsByApplicationId() { return 'getapplications'; }
    static get serverEndpointAuth_UnPw() { return 'UsernamePassword'; }
    static get connectionDetailsSelection_ServiceConnection() { return 'Service Connection'; }
    static get connectionDetailsSelection_Endpoint() { return 'Endpoint'; }
    static get excludedExtentions() { return 'xml,config'; }
    static get filteredFileDirectory() { return 'StagingFiles'; }
    static get summaryReportType_UploadandScanOnly() { return 'Upload and Scan Only'; }
    static get summaryReportType_GetFullSummary() { return 'Get Full Summary'; }
    static get bug_severity_Critical() { return '1 - Critical'; }
    static get bug_severity_High() { return '2 - High'; }
    static get bug_severity_Medium() { return '3 - Medium'; }
    static get bug_severity_Low() { return '4 - Low'; }
    static get remediation_status_New() { return 'New'; }
    static get remediation_status_Open() { return 'Open'; }
    static get remediation_status_Fixed() { return 'Fixed'; }
    static get remediation_status_CannotReproduce() { return 'Cannot Reproduce'; }
    static get remediation_status_Reopened() { return 'Reopened'; }
    static get remediation_status_PotentialFalsePositive() { return 'Potential False Positive'; }
    static get remediation_status_Re_Opened() { return 'Re-Open'; }
    static get mitigation_Status_Accepted() { return 'accepted'; }
    static get mitigation_Status_None() { return 'none'; }
    //Work Item import filter constants
    static get WorkItemImport_None() { return 'None'; }
    static get WorkItemImport_AllFlaws() { return 'All Flaws'; }
    static get WorkItemImport_AllUnmitigatedFlaws() { return 'All Unmitigated Flaws'; }
    static get WorkItemImport_AllFlawsThatViolatingPolicy() { return 'All Flaws Violating Policy'; }
    static get WorkItemImport_AllUnmitigatedFlawsThatViolatingPolicy() { return 'All Unmitigated Flaws Violating Policy'; }
    //Optional Parameters
    static get optionalArgument_sandboxid() { return 'sandboxid'; }
    static get optionalArgument_sandboxname() { return 'sandboxname'; }
    static get optionalArgument_phost() { return 'phost'; }
    static get optionalArgument_ppassword() { return 'ppassword'; }
    static get optionalArgument_pport() { return 'pport'; }
    static get optionalArgument_puser() { return 'puser'; }
    static get flawType_Static() { return 'Static'; }
    static get flawType_Dynamic() { return 'Dynamic'; }
    static get staticFlawWorkItem_TitlePrefix() { return 'Veracode Flaw (Static):'; }
    static get dynamicFlawWorkItem_TitlePrefix() { return 'Veracode Flaw (Dynamic):'; }
    //Regex Patterns
    static get wascURL_RegEX() { return 'WASC\\s*\\(http:\\/\\/webappsec.pbworks.com\\/.*\\)'; }
    static get flawLimitNumberValidation_RegEX() { return "^[0-9]*$"; }
    static get ServerReturnedHTTPResponseCode524() { return "Server returned HTTP response code: 524"; }
    static get html_LineBreak() { return "<br>"; }
    static get newLine() { return "\n"; }
    /**
     *  data related to workitem status *
     *  agileActive  = "Active",
        agileClosed = "Closed" ,
        agileDesign = "Design",
        agileNew = "New",
        agileResolved = "Resolved",
        scrumActive  = "Committed",
        scrumClosed = "Done" ,
        scrumDesign = "Design",
        scrumNew = "New",
        scrumResolved = "Done",
        cmmiActive  = "Active",
        cmmiClosed = "Closed" ,
        cmmiDesign = "Design",
        cmmiNew = "Proposed",
        cmmiResolved = "Resolved"
     */
    static get wiStatus_Active() { return 'Active'; }
    static get wiStatus_Closed() { return 'Closed'; }
    static get wiStatus_Design() { return 'Design'; }
    static get wiStatus_New() { return 'New'; }
    static get wiStatus_Resolved() { return 'Resolved'; }
    static get wiStatus_Committed() { return 'Committed'; }
    static get wiStatus_Done() { return 'Done'; }
    static get wiStatus_Proposed() { return 'Proposed'; }
    static get wiStatus_ToDo() { return 'To Do'; }
    static get wiStatus_Doing() { return 'Doing'; }
    static get FlawImporter_InvalidYAMLPropertiesMessage() { return "One or more YAML properties for Veracode Upload and Scan task has empty or invalid value. Please correct these values and, then, try again."; }
    static get MaxCharactersAllowedInApplicationName() { return 256; }
    static get MaxCharactersAllowedInSandboxName() { return 247; }
    static get ApplicationNameTooLong() { return "The Application Name cannot have more than 256 characters"; }
    static get SandboxNameTooLong() { return "The Sandbox Name cannot have more than 247 characters"; }
    static get GreaterThanSymbol() { return ">"; }
    static get LessThanSymbol() { return "<"; }
    static get InvalidVeracodeApplicationName() { return "You can only use standard alphabetic, numeric, and punctuation characters in the Application Name field. You have tried to use unsupported characters."; }
    static get InvalidCredentialsPrefix() { return "The credentials contain invalid prefix."; }
    static get PlatformAccessError() { return "Error occurred while accessing the Veracode Platform."; }
    // Types of Findings menu options
    static get scanType_DASTAndSAST_Old() { return 'Dynamic and Static Analysis'; }
    static get scanType_OnlySCA_Old() { return 'Software Composition Analysis'; }
    static get scanType_DASTAndSASTAndSCA_Old() { return 'Dynamic, Static, and Software Composition Analysis'; }
    static get scanType_StaticAndSCA_Old() { return 'Static and SCA Analysis'; }
    static get scanType_DASTAndSAST() { return 'Dynamic, Static'; }
    static get scanType_OnlySCA() { return 'SCA'; }
    static get scanType_DASTAndSASTAndSCA() { return 'Dynamic, Static, SCA'; }
    static get scanType_StaticAndSCA() { return 'Static, SCA'; }
    static get SCAMitigationCommentPrefix() { return 'This Vulnerability has been mitigated. Reason is'; }
    static get SCAIssueReOpenCommentPrefix() { return 'Reopen issue because the vulnerability is unmitigated in build'; }
    static get StaticAndDynamicCommentPrefix() { return `Mitigation Status:`; }
    //system variables
    static get VIdVariable() { return "VERACODE_API_KEY_ID"; }
    static get VKeyVariable() { return "VERACODE_API_KEY_SECRET"; }
    static get ProxyVariable() { return "VERACODE_HTTPS_PROXY"; }
}
exports.Constants = Constants;
/**
 * Contains helper methods use in flaw importer
 */
class CommonHelper {
    /**
     * Check whether flaw is reopened
     * @param processTemplate - TFS/VSTS process template
     * @param flawItem Current flaw data
     * @param retrievedWi workitem data
     * @param workItemStateNew new status related to current process template
     * @param workItemStateClosed close status related to current process template
     * @param workItemStateResolved ressolved status related to current process template
     */
    isReopened(processTemplate, flawItem, retrievedWi, workItemStateNew, workItemStateClosed, workItemStateResolved) {
        var flag = false;
        if (flawItem.IsOpenAccordingtoMitigationStatus &&
            (flawItem.FlawStatus == Constants.remediation_status_Reopened ||
                flawItem.FlawStatus == Constants.remediation_status_Re_Opened ||
                flawItem.FlawStatus == Constants.remediation_status_New ||
                flawItem.FlawStatus == Constants.remediation_status_Open) &&
            retrievedWi.fields &&
            (retrievedWi.fields["System.State"] == workItemStateClosed ||
                retrievedWi.fields["System.State"] == workItemStateResolved) &&
            retrievedWi.fields["System.State"] != workItemStateNew) {
            flag = true;
        }
        if (processTemplate == Constants.processTemplate_CMMI &&
            retrievedWi.fields &&
            (retrievedWi.fields["System.State"] == Constants.wiStatus_Proposed ||
                retrievedWi.fields["System.State"] == Constants.wiStatus_Design)) {
            flag = false;
        }
        return flag;
    }
    /**
     * Failes the task and displays the input message
     * @param message
     */
    setTaskFailure(message) {
        throw new Error(`Build Failed: ${message}`);
    }
    /**
     * Filter work items by flaw types selected by user
     * @param flawData Veracode flaw related data
     * @param workItem Work item data
     * @param workItemsCreationData Work item creation data
     * @param importParameters user inputs
     */
    filterWorkItemsByFlawType(flawData, workItem, workItemsCreationData, importParameters) {
        switch (importParameters.ImportType) {
            case Constants.WorkItemImport_AllFlaws:
                this.handleFlaws(flawData, workItem, workItemsCreationData);
                break;
            case Constants.WorkItemImport_AllUnmitigatedFlaws:
                if (flawData.MitigationStatus != Constants.mitigation_Status_Accepted) {
                    workItemsCreationData.WorkItemList.push(workItem);
                }
                break;
            case Constants.WorkItemImport_AllFlawsThatViolatingPolicy:
                if (flawData.FlawAffectedbyPolicy) {
                    this.handleFlaws(flawData, workItem, workItemsCreationData);
                }
                break;
            case Constants.WorkItemImport_AllUnmitigatedFlawsThatViolatingPolicy:
                if (flawData.MitigationStatus != Constants.mitigation_Status_Accepted && flawData.FlawAffectedbyPolicy) {
                    workItemsCreationData.WorkItemList.push(workItem);
                }
                break;
            default:
                console.log("Import type is not selected.");
        }
    }
    /**
     * Handle data related to all flaws and flaws that violating policy
     * @param flawData Veracode flaw related data
     * @param workItem Work item data
     * @param workItemsCreationData Work item creation data
     */
    handleFlaws(flawData, workItem, workItemsCreationData) {
        actionsCore.debug("Class Name: CommonHelper, Method Name: handleFlaws");
        if (flawData.MitigationStatus != Constants.mitigation_Status_Accepted) {
            workItemsCreationData.WorkItemList.push(workItem);
        }
        else {
            workItem.IsOpenAccordingtoMitigationStatus = false;
            workItemsCreationData.WorkItemList.push(workItem);
        }
    }
    /**
    * Decides whether fail build or not based on user preference
    * @param error - error
    * @param message - error message
    * @param failBuildIfFlawImporterBuildStepFails - determines whether it should fail the ADO build or not
    */
    handleError(error, message, failBuildIfFlawImporterBuildStepFails) {
        if (error) {
            console.error(`Error: ${error}`);
        }
        if (failBuildIfFlawImporterBuildStepFails) {
            this.setTaskFailure(message);
        }
        else {
            console.log(message);
        }
    }
}
exports.CommonHelper = CommonHelper;
/**
 * Holds the team project reference data
 * */
class TeamProjectDto {
    constructor() {
        this.abbreviation = "";
        this.description = "";
        this.id = "";
        this.name = "";
        this.revision = 0;
        this.url = "";
    }
}
exports.TeamProjectDto = TeamProjectDto;
//# sourceMappingURL=Common.js.map