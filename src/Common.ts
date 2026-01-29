/*******************************************************************************
* Copyright (c) 2017 Veracode, Inc. All rights observed.
*
* Available for use by Veracode customers as described in the accompanying license agreement.
*
* Send bug reports or enhancement requests to support@veracode.com.
*
* See the license agreement for conditions on submitted materials.
******************************************************************************/
import * as core from 'azure-devops-node-api/interfaces/CoreInterfaces';
import * as wi from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import * as path from 'path';
import * as actionsCore from '@actions/core';

/**
 * Holds Data About Custom process templates
 */
export class CustomProcessTemplateDataDto {
	private _customPTActiveStatus!: string;
	private _customPTCloseStatus!: string;
	private _customPTNewStatus!: string;
	private _customPTRessolvedStatus!: string;
	private _customPTDesignStatus!: string;
	private _templateType!: string;
	private _workItemType!: string;
	private _customFields: Map<string, string> = new Map();

	get WorkItemType() {
		return this._workItemType;
	}
	set WorkItemType(val: string) {
		this._workItemType = val;
	}
	get TemplateType() {
		return this._templateType;
	}
	set TemplateType(val: string) {
		this._templateType = val;
	}
	get CustomPTActiveStatus() {
		return this._customPTActiveStatus;
	}
	set CustomPTActiveStatus(val: string) {
		this._customPTActiveStatus = val;
	}
	get CustomPTCloseStatus() {
		return this._customPTCloseStatus;
	}
	set CustomPTCloseStatus(val: string) {
		this._customPTCloseStatus = val;
	}
	get CustomPTRessolvedStatus() {
		return this._customPTRessolvedStatus;
	}
	set CustomPTRessolvedStatus(val: string) {
		this._customPTRessolvedStatus = val;
	}
	get CustomPTNewStatus() {
		return this._customPTNewStatus;
	}
	set CustomPTNewStatus(val: string) {
		this._customPTNewStatus = val;
	}
	get CustomPTDesignStatus() {
		return this._customPTDesignStatus;
	}
	set CustomPTDesignStatus(val: string) {
		this._customPTDesignStatus = val;
	}
	get CustomFields() {
		return this._customFields;
	}
	set CustomFields(val: Map<string, string>) {
		this._customFields = val;
	}
}

/**
 * Holds Detailed Report details  and work Item details
 */
export class workItemsDataDto {
	private _severityDTOList: Array<SeverityDetailedReportDto>;
	private _appID!: string;
	private _BuildId!: string;
	private _workItemList: Array<WorkItemDto>;
	private _rawImportLimit!: number;
	private _area!: string;
	private _flawImportLimit!: number;
	private _buildVersion!: string;
	private _importType!: string;
	private _overwriteAreaPathInWorkItemsOnImport!: boolean;
	private _iterationPath!: string;
	private _overwriteIterationPathInWorkItemsOnImport!: boolean;

	constructor() {
		this._severityDTOList = new Array<SeverityDetailedReportDto>();

		this._workItemList = new Array<WorkItemDto>();
	}

	get ImportType() {
		return this._importType;
	}
	set ImportType(val: string) {
		this._importType = val;
	}

	get BuildVersion() {
		return this._buildVersion;
	}
	set BuildVersion(val: string) {
		this._buildVersion = val;
	}
	get FlawImportLimit() {
		return this._flawImportLimit;
	}
	set FlawImportLimit(val: number) {
		this._flawImportLimit = val;
	}
	get WorkItemList() {
		return this._workItemList;
	}
	set WorkItemList(val: Array<WorkItemDto>) {
		this.WorkItemList = val;
	}
	get Appid() {
		return this._appID;
	}
	set Appid(val: string) {
		this._appID = val;
	}
	get BuildID() {
		return this._BuildId;
	}
	set BuildID(val: string) {
		this._BuildId = val;
	}
	get SeverityDTOList() {
		return this._severityDTOList;
	}
	set SeverityDTOList(val: Array<SeverityDetailedReportDto>) {
		this._severityDTOList = val;
	}
	//Number of raws to import
	get RawImportLimit() {
		return this._rawImportLimit;
	}
	set RawImportLimit(val: number) {
		this._rawImportLimit = val;
	}
	// Area	
	get Area() {
		return this._area;
	}
	set Area(val: string) {
		this._area = val;
	}

	get IterationPath() {
		return this._iterationPath;
	}
	set IterationPath(val: string) {
		this._iterationPath = val;
	}

	get OverwriteAreaPathInWorkItemsOnImport(): boolean {
		return this._overwriteAreaPathInWorkItemsOnImport;
	}
	set OverwriteAreaPathInWorkItemsOnImport(val: boolean) {
		this._overwriteAreaPathInWorkItemsOnImport = val;
	}

	get OverwriteIterationPathInWorkItemsOnImport(): boolean {
		return this._overwriteIterationPathInWorkItemsOnImport;
	}
	set OverwriteIterationPathInWorkItemsOnImport(val: boolean) {
		this._overwriteIterationPathInWorkItemsOnImport = val;
	}

}

/**
 * workItemDto holds work items
 */
export class WorkItemDto {
	private _title!: string;
	private _severity!: number;
	private _severityValue!: string;
	private _tags: Array<string>;
	private _isOpenAccordingtoMitigationStatus!: boolean;
	private _html!: string;
	private _flawStatus!: string;
	private _affectedbyPolicy!: boolean;
	private _flawComments!: string;
	private _fixByDate!: string;
	private _scanTypeAsTag!: string;
	private _severityAsTag!: string;
	private _annotations: Array<any>;
	private _resolutionStatus!: string;

	constructor() {
		this._tags = new Array<string>();
		this._annotations = new Array<any>();
	}

	get FlawComments() {
		return this._flawComments;
	}
	set FlawComments(val: string) {
		this._flawComments = val;
	}
	get AffectedbyPolicy() {
		return this._affectedbyPolicy;
	}
	set AffectedbyPolicy(val: boolean) {
		this._affectedbyPolicy = val;
	}
	get FlawStatus() {
		return this._flawStatus;
	}
	set FlawStatus(val: string) {
		this._flawStatus = val;
	}
	get Html() {
		return this._html;
	}
	set Html(val: string) {
		this._html = val;
	}

	get IsOpenAccordingtoMitigationStatus() {
		return this._isOpenAccordingtoMitigationStatus;
	}
	set IsOpenAccordingtoMitigationStatus(val: boolean) {
		this._isOpenAccordingtoMitigationStatus = val;
	}
	get Tags() {
		return this._tags;
	}
	set Tags(val: Array<string>) {
		this._tags = val;
	}
	get SeverityValue() {
		return this._severityValue
	}
	set SeverityValue(val: string) {
		this._severityValue = val;
	}
	get Title() {
		return this._title;
	}
	set Title(val: string) {
		this._title = val;
	}
	get Severity() {
		return this._severity;
	}
	set Severity(val: number) {
		this._severity = val;
	}
	get FixByDate() {
		return this._fixByDate;
	}
	set FixByDate(val: string) {
		this._fixByDate = val;
	}
	get ScanTypeTag() {
		return this._scanTypeAsTag;
	}
	set ScanTypeTag(val: string) {
		this._scanTypeAsTag = val;
	}
	get SeverityTag() {
		return this._severityAsTag;
	}
	set SeverityTag(val: string) {
		this._severityAsTag = val;
	}
	get Annotations() {
		return this._annotations;
	}
	set Annotations(val: Array<any>) {
		this._annotations = val;
	}
	get ResolutionStatus() {
		return this._resolutionStatus;
	}
	set ResolutionStatus(val: string) {
		this._resolutionStatus = val;
	}
}


/**
 * ScanDTO : Holds Scan Results /Application Related Data
 */
export class ScanDto {
	private _buildStatus!: string;
	private _policyComplianceStatus!: string;
	private _buildId!: string;
	private _oldBuildId!: string;
	private _appID!: string;
	private _appName!: string;
	private _accountID!: string;
	private _resultPageURL!: string;
	private _FileCount!: number;
	private _published_date!: string;
	private _analysis_type!: string;
	private _analysisCenterUrl!: string;
	private _staticAnalysisUnitId!: string;
	private _analysisId!: string;
	private _componentProfileUrl!: string;
	private _sandboxId!: string;
	private _sandboxName!: string;
	private _buildName!: string;

	get AnalysisType() {
		return this._analysis_type;
	}
	set AnalysisType(val: string) {
		this._analysis_type = val;
	}
	get PublishedDate() {
		return this._published_date;
	}
	set PublishedDate(val: string) {
		this._published_date = val;
	}
	get ScanFileCount() {
		return this._FileCount;
	}
	set ScanFileCount(val: number) {
		this._FileCount = val;
	}
	get BuildStatus() {
		return this._buildStatus;
	}
	set BuildStatus(val: string) {
		this._buildStatus = val;
	}
	get PolicyComplianceStatus() {
		return this._policyComplianceStatus;
	}
	set PolicyComplianceStatus(val: string) {
		this._policyComplianceStatus = val;
	}
	get BuildId() {
		return this._buildId;
	}
	set BuildId(val: string) {
		this._buildId = val;
	}
	get OldBuildId() {
		return this._oldBuildId;
	}
	set OldBuildId(val: string) {
		this._oldBuildId = val;
	}
	get Appid() {
		return this._appID;
	}
	set Appid(val: string) {
		this._appID = val;
	}
	get AppName() {
		return this._appName;
	}
	set AppName(val: string) {
		this._appName = val
	}
	get AccountID() {
		return this._accountID;
	}
	set AccountID(val: string) {
		this._accountID = val;
	}
	get ResultPageURL() {
		return this._resultPageURL;
	}
	set ResultPageURL(val: string) {
		this._resultPageURL = val;
	}
	get AnalysisCenterUrl() {
		return this._analysisCenterUrl;
	}
	set AnalysisCenterUrl(val: string) {
		this._analysisCenterUrl = val;
	}
	get AnalysisId() {
		return this._analysisId;
	}
	set AnalysisId(val: string) {
		this._analysisId = val;
	}
	get StaticAnalysisUnitId() {
		return this._staticAnalysisUnitId;
	}
	set StaticAnalysisUnitId(val: string) {
		this._staticAnalysisUnitId = val;
	}
	get ComponentProfileUrl() {
		return this._componentProfileUrl;
	}
	set ComponentProfileUrl(val: string) {
		this._componentProfileUrl = val;
	}
	get SandboxId() {
		return this._sandboxId;
	}
	set SandboxId(val: string) {
		this._sandboxId = val;
	}
	get SandboxName() {
		return this._sandboxName;
	}
	set SandboxName(val: string) {
		this._sandboxName = val;
	}
	get BuildName() {
		return this._buildName;
	}
	set BuildName(val: string) {
		this._buildName = val;
	}
}

/**
 * BuildDTO : Holds Build Scan Data
 */
export class ScanParametersDto {
	private _apiAction!: string;
	private _isSAndboxScan!: boolean;
	private _filepath!: string;
	private _idKeyString!: string;
	private _veracodeAppProfile!: string;
	private _createProfile!: string;
	private _credentialType!: boolean;
	private _isUsernamePasswordCredentialType!: boolean;
	private _username!: string;
	private _password!: string;
	private _version!: string;
	private _sandboxId!: string;
	private _sandboxName!: string;
	private _optArgs: string[] = [];
	private _failBuildOnPolicyFail: boolean = false;
	private _vID: string = "";
	private _vKey: string = "";
	private _veracodeAPIWrapper: string = "";
	private _scanStatusCheckInterval: number = 0;
	private _importResults: boolean = false;
	private _isMainSummaryReport: boolean = false;
	private _stagingFilesPath: string = "";

	get StagingFilesPath() {
		return this._stagingFilesPath;
	}
	set StagingFilesPath(val: string) {
		this._stagingFilesPath = val;
	}
	get SandboxName() {
		return this._sandboxName;
	}
	set SandboxName(val: string) {
		this._sandboxName = val;
	}
	get IsMainSummaryReport() {
		return this._isMainSummaryReport;
	}
	set IsMainSummaryReport(val: boolean) {
		this._isMainSummaryReport = val;
	}
	get ApiAction() {
		return this._apiAction
	}
	set ApiAction(val: string) {
		this._apiAction = val;
	}
	get IsScandboxScan() {
		return this._isSAndboxScan;
	}
	set IsScandboxScan(val: boolean) {
		this._isSAndboxScan = val;
	}
	get Filepath() {
		return this._filepath;
	}
	set Filepath(val: string) {
		this._filepath = val;
	}
	get IdKeyString() {
		return this._idKeyString;
	}
	set IdKeyString(val: string) {
		this._idKeyString = val;
	}
	get VeracodeAppProfile() {
		return this._veracodeAppProfile;
	}
	set VeracodeAppProfile(val: string) {
		this._veracodeAppProfile = val;
	}
	get CreateProfile() {
		return this._createProfile;
	}
	set CreateProfile(val: string) {
		this._createProfile = val;
	}
	get CredentialType() {
		return this._credentialType;
	}
	set CredentialType(val: boolean) {
		this._credentialType = val;
	}
	get IsUsernamePasswordCredentialType() {
		return this._isUsernamePasswordCredentialType;
	}
	set IsUsernamePasswordCredentialType(val: boolean) {
		this._isUsernamePasswordCredentialType = val;
	}
	get Username() {
		return this._username;
	}
	set Username(val: string) {
		this._username = val;
	}
	get Password() {
		return this._password;
	}
	set Password(val: string) {
		this._password = val;
	}
	get Version() {
		return this._version;
	}
	set Version(val: string) {
		this._version = val;
	}
	get SandboxId() {
		return this._sandboxId;
	}
	set SandboxId(val: string) {
		this._sandboxId = val;
	}
	get OptArgs() {
		return this._optArgs;
	}
	set OptArgs(val: string[]) {
		this._optArgs = val;
	}
	get FailBuildOnPolicyFail() {
		return this._failBuildOnPolicyFail;
	}
	set FailBuildOnPolicyFail(val: boolean) {
		this._failBuildOnPolicyFail = val;
	}
	get ImportResults(): boolean {
		return this._importResults;
	}
	set ImportResults(val: boolean) {
		this._importResults = val;
	}
	get VID() {
		return this._vID
	}
	set VID(val: string) {
		this._vID = val;
	}
	get VKey() {
		return this._vKey;
	}
	set VKey(val: string) {
		this._vKey = val;
	}
	get VeracodeAPIWrapper() {
		return this._veracodeAPIWrapper;
	}
	set VeracodeAPIWrapper(val: string) {
		this._veracodeAPIWrapper = val;
	}
	get ScanStatusCheckInterval() {
		return this._scanStatusCheckInterval;
	}
	set ScanStatusCheckInterval(val: number) {
		this._scanStatusCheckInterval = val;
	}
}

export class FlawImporterParametersDto {
	private _importType!: string;
	private _workItemType!: string;
	private _areaPath!: string;
	private _addCweTag!: boolean;
	private _addCustomTag!: string;
	private _foundInBuild!: boolean;
	private _flawImportLimit!: number;
	private _apiAction!: string;
	private _isValidationsSuccess!: boolean;
	private _veracodeAppProfile!: string;
	private _sandboxId!: string;
	private _sandboxName!: string;
	private _vID!: string;
	private _vKey!: string;
	private _veracodeAPIWrapper!: string;
	private _customFields: Map<string, string> = new Map();
	private _overwriteAreaPathInWorkItemsOnImport!: boolean;
	private _addScanNameAsATag!: boolean;
	private _scanType!: string;
	private _failBuildIfFlawImporterBuildStepFails!: boolean;
	private _iterationPath!: string;
	private _overwriteIterationPathInWorkItemsOnImport!: boolean;
	private _scanTypeAsTag!: boolean;
	private _severityAsTag!: boolean;
	private _dueDateAsTag!: boolean;
	private _addCveTag!: boolean;

	// Azure DevOps connection fields
	private _adoToken!: string;
	private _adoOrg!: string;
	private _adoProject!: string;
	
	// Work item state fields
	private _adoOpenState!: string;
	private _adoCloseState!: string;
	private _adoReopenState!: string;

	//Proxy related fields
	private _pport!: string;
	private _phost!: string;
	private _puser!: string;
	private _ppassword!: string;

	private _isDebugEnabled!: boolean;

	get IsValidationsSuccess() {
		return this._isValidationsSuccess;
	}
	set IsValidationsSuccess(val: boolean) {
		this._isValidationsSuccess = val;
	}
	//proxy related properties
	get Pport() {
		return this._pport;
	}
	set Pport(val: string) {
		this._pport = val;
	}
	get Phost() {
		return this._phost;
	}
	set Phost(val: string) {
		this._phost = val;
	}
	get Puser() {
		return this._puser;
	}
	set Puser(val: string) {
		this._puser = val;
	}
	get Ppassword() {
		return this._ppassword;
	}
	set Ppassword(val: string) {
		this._ppassword = val;
	}
	get ApiAction() {
		return this._apiAction
	}
	set ApiAction(val: string) {
		this._apiAction = val;
	}
	get VID() {
		return this._vID
	}
	set VID(val: string) {
		this._vID = val;
	}
	get VKey() {
		return this._vKey;
	}
	set VKey(val: string) {
		this._vKey = val;
	}
	get VeracodeAppProfile() {
		return this._veracodeAppProfile;
	}
	set VeracodeAppProfile(val: string) {
		this._veracodeAppProfile = val;
	}
	get SandboxName() {
		return this._sandboxName;
	}
	set SandboxName(val: string) {
		this._sandboxName = val;
	}
	get SandboxId() {
		return this._sandboxId;
	}
	set SandboxId(val: string) {
		this._sandboxId = val;
	}
	get ImportType() {
		return this._importType;
	}
	set ImportType(val: string) {
		this._importType = val;
	}
	get WorkItemType() {
		return this._workItemType;
	}
	set WorkItemType(val: string) {
		this._workItemType = val;
	}
	get AreaPath() {
		return this._areaPath;
	}
	set AreaPath(val: string) {
		this._areaPath = val;
	}
	get IterationPath() {
		return this._iterationPath;
	}
	set IterationPath(val: string) {
		this._iterationPath = val;
	}
	get AddCweTag() {
		return this._addCweTag;
	}
	set AddCweTag(val: boolean) {
		this._addCweTag = val;
	}
	get AddCveTag() {
		return this._addCveTag;
	}
	set AddCveTag(val: boolean) {
		this._addCveTag = val;
	}
	get AddCustomTag() {
		return this._addCustomTag;
	}
	set AddCustomTag(val: string) {
		this._addCustomTag = val;
	}
	get FoundInBuild() {
		return this._foundInBuild;
	}
	set FoundInBuild(val: boolean) {
		this._foundInBuild = val;
	}
	get FlawImportLimit() {
		return this._flawImportLimit;
	}
	set FlawImportLimit(val: number) {
		this._flawImportLimit = val;
	}
	get VeracodeAPIWrapper() {
		return this._veracodeAPIWrapper;
	}
	set VeracodeAPIWrapper(val: string) {
		this._veracodeAPIWrapper = val;
	}
	get IsDebugEnabled() {
		return this._isDebugEnabled;
	}
	set IsDebugEnabled(val: boolean) {
		this._isDebugEnabled = val;
	}
	get CustomFields() {
		return this._customFields;
	}
	set CustomFields(val: Map<string, string>) {
		this._customFields = val;
	}
	get OverwriteAreaPathInWorkItemsOnImport(): boolean {
		return this._overwriteAreaPathInWorkItemsOnImport;
	}
	set OverwriteAreaPathInWorkItemsOnImport(val: boolean) {
		this._overwriteAreaPathInWorkItemsOnImport = val;
	}
	get OverwriteIterationPathInWorkItemsOnImport(): boolean {
		return this._overwriteIterationPathInWorkItemsOnImport;
	}
	set OverwriteIterationPathInWorkItemsOnImport(val: boolean) {
		this._overwriteIterationPathInWorkItemsOnImport = val;
	}
	get AddScanNameAsATag() {
		return this._addScanNameAsATag;
	}
	set AddScanNameAsATag(val: boolean) {
		this._addScanNameAsATag = val;
	}
	get ScanType() {
		return this._scanType;
	}
	set ScanType(val: string) {
		this._scanType = val;
	}
	get FailBuildIfFlawImporterBuildStepFails() {
		return this._failBuildIfFlawImporterBuildStepFails;
	}
	set FailBuildIfFlawImporterBuildStepFails(val: boolean) {
		this._failBuildIfFlawImporterBuildStepFails = val;
	}
	get ScanTypeTag() {
		return this._scanTypeAsTag;
	}
	set ScanTypeTag(val: boolean) {
		this._scanTypeAsTag = val;
	}
	get SeverityTag() {
		return this._severityAsTag;
	}
	set SeverityTag(val: boolean) {
		this._severityAsTag = val;
	}
	get DueDateTag() {
		return this._dueDateAsTag;
	}
	set DueDateTag(val: boolean) {
		this._dueDateAsTag = val;
	}
	get AdoToken() {
		return this._adoToken;
	}
	set AdoToken(val: string) {
		this._adoToken = val;
	}
	get AdoOrg() {
		return this._adoOrg;
	}
	set AdoOrg(val: string) {
		this._adoOrg = val;
	}
	get AdoProject() {
		return this._adoProject;
	}
	set AdoProject(val: string) {
		this._adoProject = val;
	}
	get AdoOpenState() {
		return this._adoOpenState;
	}
	set AdoOpenState(val: string) {
		this._adoOpenState = val;
	}
	get AdoCloseState() {
		return this._adoCloseState;
	}
	set AdoCloseState(val: string) {
		this._adoCloseState = val;
	}
	get AdoReopenState() {
		return this._adoReopenState;
	}
	set AdoReopenState(val: string) {
		this._adoReopenState = val;
	}
}

/**
 * Holds Data About Security Vulnerability Category
 */
export class CategorySummaryReportDto {
	private _categoryname: string = "";
	private _count: number = 0;

	get CategoryName() {
		return this._categoryname;
	}
	set CategoryName(val: string) {
		this._categoryname = val;
	}
	get Count() {
		return this._count;
	}
	set Count(val: number) {
		this._count = val;
	}
}

/**
 * Holds data about Severity
 */
export class SeveritySummaryReportDto {
	private _level: number = 0;
	private _totalFailedCount: number = 0;
	private _categoryList: Array<CategorySummaryReportDto>;
	private _severityName: string = "";

	constructor() {
		this._categoryList = new Array<CategorySummaryReportDto>();
	}

	get TotalFailedCount() {
		return this._totalFailedCount;
	}
	set TotalFailedCount(val: number) {
		this._totalFailedCount = val;
	}
	get SeverityName() {
		return this._severityName;
	}
	set SeverityName(val: string) {
		this._severityName = val;
	}
	get Level() {
		return this._level;
	}
	set Level(val: number) {
		this._level = val;
	}
	get CategoryList() {
		return this._categoryList;
	}
	set CategoryList(val: Array<CategorySummaryReportDto>) {
		this._categoryList = val;
	}
}

/**
 * Holds SummaryReport details
 */
export class SummaryReportDto {
	private _severityDTOList: Array<SeveritySummaryReportDto>;
	private _policy_name: string = "";
	private _veracode_level: string = "";
	private _version: string = "";
	private _score: number = 0;
	private _summaryReportbuildID: string = "";
	private _policyComplianceStatus: string = "";
	private _staticAnalysisFrequency: string = "";
	private _resultPageURL: string = "";
	private _appID: string = "";
	private _totalFlaws: string = "";
	private _totalNewFlaws: string = "";
	private _graphDTO: GraphDto;
	private _reportType: string = "";

	constructor() {
		this._severityDTOList = new Array<SeveritySummaryReportDto>();
		this._graphDTO = new GraphDto();
	}

	get ReportType() {
		return this._reportType;
	}
	set ReportType(val: string) {
		this._reportType = val;
	}
	get GraphDTO() {
		return this._graphDTO;
	}
	set GraphDTO(val: GraphDto) {
		this._graphDTO = val;
	}
	get TotalFlaws() {
		return this._totalFlaws;
	}
	set TotalFlaws(val: string) {
		this._totalFlaws = val;
	}
	get TotalNewFlaws() {
		return this._totalNewFlaws;
	}
	set TotalNewFlaws(val: string) {
		this._totalNewFlaws = val;
	}
	get Appid() {
		return this._appID;
	}
	set Appid(val: string) {
		this._appID = val;
	}
	get ResultPageURL() {
		return this._resultPageURL;
	}
	set ResultPageURL(val: string) {
		this._resultPageURL = val;
	}
	get StaticAnalysisFrequency() {
		return this._staticAnalysisFrequency;
	}
	set StaticAnalysisFrequency(val: string) {
		this._staticAnalysisFrequency = val;
	}
	get PolicyComplianceStatus() {
		return this._policyComplianceStatus;
	}
	set PolicyComplianceStatus(val: string) {
		this._policyComplianceStatus = val;
	}
	get SummaryReportbuildID() {
		return this._summaryReportbuildID;
	}
	set SummaryReportbuildID(val: string) {
		this._summaryReportbuildID = val;
	}
	get SeverityDTOList() {
		return this._severityDTOList;
	}
	set SeverityDTOList(val: Array<SeveritySummaryReportDto>) {
		this._severityDTOList = val;
	}
	get PolicyName() {
		return this._policy_name;
	}
	set PolicyName(val: string) {
		this._policy_name = val;
	}
	get VeracodeLevel() {
		return this._veracode_level;
	}
	set VeracodeLevel(val: string) {
		this._veracode_level = val;
	}
	get Version() {
		return this._version;
	}
	set Version(val: string) {
		this._version = val;
	}
	get Score() {
		return this._score;
	}
	set Score(val: number) {
		this._score = val;
	}
}

export class GraphListItemsDto {
	private _buildDate: string = "";
	private _totalFlaws: string = "";
	private _flawPrecentage: string = "";

	get FlawPrecentage() {
		return this._flawPrecentage;
	}
	set FlawPrecentage(val: string) {
		this._flawPrecentage = val;
	}
	get TotalFlaws() {
		return this._totalFlaws;
	}
	set TotalFlaws(val: string) {
		this._totalFlaws = val;
	}
	get BuildDate() {
		return this._buildDate;
	}
	set BuildDate(val: string) {
		this._buildDate = val;
	}
}

/**
* Holds Graph details to display on Summary Report
*/
export class GraphDto {
	private _appID: string = "";
	private _buildID: string = "";
	private _allBuildIDs: string[] = [];
	private _currentBuildIDs: string[] = [];
	private _graphListItemsDTOList: Array<GraphListItemsDto>;

	constructor() {
		this._graphListItemsDTOList = new Array<GraphListItemsDto>();
	}

	get GraphListItemsDTOList() {
		return this._graphListItemsDTOList;
	}
	set GraphListItemsDTOList(val: Array<GraphListItemsDto>) {
		this._graphListItemsDTOList = val;
	}
	get APPID() {
		return this._appID;
	}
	set APPID(val: string) {
		this._appID = val;
	}
	get BuildID() {
		return this._buildID;
	}
	set BuildID(val: string) {
		this._buildID = val;
	}
	get AllBuildIDs() {
		return this._allBuildIDs;
	}
	set AllBuildIDs(val: string[]) {
		this._allBuildIDs = val;
	}
	get CurrentBuildIDs() {
		return this._currentBuildIDs;
	}
	set CurrentBuildIDs(val: string[]) {
		this._currentBuildIDs = val;
	}
}

/**
 * Holds work item Comments Data
 */
export class CommentsDTO {
	private _date: string = "";
	private _comment: string = "";

	get Date() {
		return this._date;
	}
	set Date(val: string) {
		this._date = val;
	}
	get Comment() {
		return this._comment;
	}
	set Comment(val: string) {
		this._comment = val;
	}
}

/**
 * Holds Data About Security Flaws of Details report
 */
export class FlawDto {
	private _categoryname: string = "";
	private _issueID: number = 0;
	private _flawDescription: string = "";
	private _mitigationStatus: string = "";
	private _line: string = "";
	private _sourcefile: string = "";
	private _module: string = "";
	private _flawAffectedbyPolicy: boolean = false;
	private _attackVector: string = "";
	private _remediation_status: string = "";
	private _flawType: string = "";
	private _dynamicFlawUrl: string = "";
	private _dynamicFlawParameter: string = "";
	private _commentsList: Array<CommentsDTO>;
	private _mitigationStatusDescription: string = "";
	private _gracePeriodExpires: string = "";

	constructor() {
		this._commentsList = new Array<CommentsDTO>();
	}

	get CommentsList() {
		return this._commentsList;
	}
	set CommentsList(val: Array<CommentsDTO>) {
		this._commentsList = val;
	}
	get DynamicFlawURL() {
		return this._dynamicFlawUrl;
	}
	set DynamicFlawURL(val: string) {
		this._dynamicFlawUrl = val;
	}
	get DynamicFlawParameter() {
		return this._dynamicFlawParameter;
	}
	set DynamicFlawParameter(val: string) {
		this._dynamicFlawParameter = val;
	}
	get FlawType() {
		return this._flawType;
	}
	set FlawType(val: string) {
		this._flawType = val;
	}
	get RemediationStatus() {
		return this._remediation_status;
	}
	set RemediationStatus(val: string) {
		this._remediation_status = val;
	}
	get AttackVector() {
		return this._attackVector;
	}
	set AttackVector(val: string) {
		this._attackVector = val;
	}
	get FlawAffectedbyPolicy() {
		return this._flawAffectedbyPolicy;
	}
	set FlawAffectedbyPolicy(val: boolean) {
		this._flawAffectedbyPolicy = val;
	}
	get Line() {
		return this._line;
	}
	set Line(val: string) {
		this._line = val;
	}
	get SourceFile() {
		return this._sourcefile;
	}
	set SourceFile(val: string) {
		this._sourcefile = val;
	}
	get Module() {
		return this._module;
	}
	set Module(val: string) {
		this._module = val;
	}
	get IssueID() {
		return this._issueID;
	}
	set IssueID(val: number) {
		this._issueID = val;
	}
	get CategoryName() {
		return this._categoryname;
	}
	set CategoryName(val: string) {
		this._categoryname = val;
	}
	get FlawDescription() {
		return this._flawDescription
	}
	set FlawDescription(val: string) {
		this._flawDescription = val;
	}
	get MitigationStatus() {
		return this._mitigationStatus;
	}
	set MitigationStatus(val: string) {
		this._mitigationStatus = val;
	}
	get MitigationStatusDescription() {
		return this._mitigationStatusDescription;
	}
	set MitigationStatusDescription(val: string) {
		this._mitigationStatusDescription = val;
	}
	public get GracePeriodExpires(): string {
		return this._gracePeriodExpires;
	}
	public set GracePeriodExpires(val: string) {
		this._gracePeriodExpires = val;
	}
}

/**
 * Holds Main Category Description of Details report
 */
export class CategoryDescriptionDetailedReportDto {
	private _paraList: Array<Para>;
	constructor() {
		this._paraList = new Array<Para>();
	}
	get ParaList() {
		return this._paraList;
	}
	set ParaList(val: Array<Para>) {
		this._paraList = val;
	}

}

/**
 * Holds Main Category Recomendations of Details report
 */
export class CategoryRecomendationsDetailedReportDto {
	private _paraList: Array<Para>;
	constructor() {
		this._paraList = new Array<Para>();
	}
	get ParaList() {
		return this._paraList;
	}
	set ParaList(val: Array<Para>) {
		this._paraList = val;
	}
}

/**
 * Holds paragraph details
 */
export class Para {
	private _paraText: string = "";
	private _bulletItemList: Array<BulletItem>;
	constructor() {
		this._bulletItemList = new Array<BulletItem>();
	}
	get BulletItemList() {
		return this._bulletItemList;
	}
	set BulletItemList(val: Array<BulletItem>) {
		this._bulletItemList = val;
	}
	get ParaText() {
		return this._paraText;
	}
	set ParaText(val: string) {
		this._paraText = val;
	}
}

/**
 * Holds bullet item details
 */
export class BulletItem {
	private _bulletText: string = "";

	get BulletText() {
		return this._bulletText;
	}
	set BulletText(val: string) {
		this._bulletText = val;
	}
}

/**
 * Holds Data About cwe Data
 */
export class cweDto {
	private _cweId: string = "";
	private _cweName: string = "";
	private _cweDescription: CweDescription;
	private _flawList: Array<FlawDto>;
	constructor() {
		this._cweDescription = new CweDescription();
		this._flawList = new Array<FlawDto>();
	}
	get CweDescription() {
		return this._cweDescription;
	}
	set CweDescription(val: CweDescription) {
		this._cweDescription = val;
	}
	get FlawList() {
		return this._flawList;
	}
	set FlawList(val: Array<FlawDto>) {
		this._flawList = val;
	}
	get CweId() {
		return this._cweId;
	}
	set CweId(val: string) {
		this._cweId = val;
	}
	get CweName() {
		return this._cweName;
	}
	set CweName(val: string) {
		this._cweName = val;
	}
}

/**
 * Holds Data About cwe description
 */
export class CweDescription {
	private _descriptionTextList: Array<DescriptionText>;
	constructor() {
		this._descriptionTextList = new Array<DescriptionText>();
	}
	get DescriptionTextList() {
		return this._descriptionTextList;
	}
	set DescriptionTextList(val: Array<DescriptionText>) {
		this._descriptionTextList = val;
	}

}

/**
 * Holds Data About cwe description text
 */
export class DescriptionText {
	private _text: string = ""
	get Text() {
		return this._text;
	}
	set Text(val: string) {
		this._text = val;
	}
}

/**
 * Holds Data About Security Vulnerability Category of Details report
 */
export class CategoryDetailedReportDto {
	private _categoryname: string = "";
	private _categoryDescription: CategoryDescriptionDetailedReportDto;
	private _categoryRecomendations: CategoryRecomendationsDetailedReportDto;
	private _cweList: Array<cweDto>;
	constructor() {
		this._categoryDescription = new CategoryDescriptionDetailedReportDto();
		this._categoryRecomendations = new CategoryRecomendationsDetailedReportDto();
		this._cweList = new Array<cweDto>();
	}

	get CweList() {
		return this._cweList;
	}
	set CweList(val: Array<cweDto>) {
		this._cweList = val;
	}
	get Recomendations() {
		return this._categoryRecomendations;
	}
	set Recomendations(val: CategoryRecomendationsDetailedReportDto) {
		this._categoryRecomendations = val;
	}
	get Description() {
		return this._categoryDescription;
	}
	set Description(val: CategoryDescriptionDetailedReportDto) {
		this._categoryDescription = val;
	}
	get CategoryName() {
		return this._categoryname;
	}
	set CategoryName(val: string) {
		this._categoryname = val;
	}
}

/**
 * Holds data about Severity of Details report
 */
export class SeverityDetailedReportDto {
	private _level: number = 0;
	private _categoryList: Array<CategoryDetailedReportDto>;

	constructor() {
		this._categoryList = new Array<CategoryDetailedReportDto>();
	}
	get Level() {
		return this._level;
	}
	set Level(val: number) {
		this._level = val;
	}
	get CategoryList() {
		return this._categoryList;
	}
	set CategoryList(val: Array<CategoryDetailedReportDto>) {
		this._categoryList = val;
	}
}

export class FileDto {
	private _sourcePath: string = "";
	private _size: number = 0;

	get SourcePath() {
		return this._sourcePath;
	}
	set SourcePath(val: string) {
		this._sourcePath = val;
	}
	get Size() {
		return this._size;
	}
	set Size(val: number) {
		this._size = val;
	}
}

/**
 * Holds SummaryReport details
 */
export class DetailedReportDto {
	private _severityDTOList: Array<SeverityDetailedReportDto>;
	private _titleList: Array<string>;
	private _appID: string = "";
	private _BuildId: string = "";

	constructor() {
		this._severityDTOList = new Array<SeverityDetailedReportDto>();
		this._titleList = new Array<string>();
	}

	get TitleList() {
		return this._titleList;
	}
	set TitleList(val: Array<string>) {
		this._titleList = val;
	}
	get Appid() {
		return this._appID;
	}
	set Appid(val: string) {
		this._appID = val;
	}
	get BuildID() {
		return this._BuildId;
	}
	set BuildID(val: string) {
		this._BuildId = val;
	}
	get SeverityDTOList() {
		return this._severityDTOList;
	}
	set SeverityDTOList(val: Array<SeverityDetailedReportDto>) {
		this._severityDTOList = val;
	}
}

/**
 * Holds SCA Component vulnerability data
 */
export class ComponentVulnerability {
	private _cveId: string = "";
	private _cveSummary: string = "";
	private _cweId: string = "";
	private _isMitigation: boolean = false;
	private _mitigationType: string = "";
	private _mitigationCommentOnFlawClosure: string = "";
	private _severity: string = "";
	private _doesAffectPolicy: boolean = false;
	private _firstFoundDate: string = "";
	private _filePathList: Array<string>;

	constructor() {
		this._filePathList = new Array<string>();
	}

	get CveId() {
		return this._cveId;
	}
	set CveId(val: string) {
		this._cveId = val;
	}

	get CveSummary() {
		return this._cveSummary;
	}
	set CveSummary(val: string) {
		this._cveSummary = val;
	}

	get CweId() {
		return this._cweId;
	}
	set CweId(val: string) {
		this._cweId = val;
	}

	get IsMitigation() {
		return this._isMitigation;
	}
	set IsMitigation(val: boolean) {
		this._isMitigation = val;
	}

	get MitigationType() {
		return this._mitigationType;
	}
	set MitigationType(val: string) {
		this._mitigationType = val;
	}

	get MitigationCommentOnFlawClosure() {
		return this._mitigationCommentOnFlawClosure;
	}
	set MitigationCommentOnFlawClosure(val: string) {
		this._mitigationCommentOnFlawClosure = val;
	}

	get Severity() {
		return this._severity;
	}
	set Severity(val: string) {
		this._severity = val;
	}

	get DoesAffectPolicy() {
		return this._doesAffectPolicy;
	}
	set DoesAffectPolicy(val: boolean) {
		this._doesAffectPolicy = val;
	}

	get FirstFoundDate() {
		return this._firstFoundDate;
	}
	set FirstFoundDate(val: string) {
		this._firstFoundDate = val;
	}

	get FilePathList() {
		return this._filePathList;
	}
	set FilePathList(val: Array<string>) {
		this._filePathList = val;
	}
}

/**
* Holds data about Vulnerable Components (SCA findings)
*/
export class VulnerableComponentDetailedReportDto {
	private _library: string = "";
	private _componentId: string = "";
	private _version: string = "";
	private _vulnerabilities: Array<ComponentVulnerability>; // this is a list of ALL vulnerabilities in the component
	private _FilePathsList: Array<string>;

	constructor() {
		this._vulnerabilities = new Array<ComponentVulnerability>();
		this._FilePathsList = new Array<string>();
	}

	get Library() {
		return this._library;
	}
	set Library(val: string) {
		this._library = val;
	}

	get ComponentId() {
		return this._componentId;
	}
	set ComponentId(val: string) {
		this._componentId = val;
	}

	get Version() {
		return this._version;
	}
	set Version(val: string) {
		this._version = val;
	}

	get Vulnerabilities() {
		return this._vulnerabilities;
	}
	set Vulnerabilities(val: Array<ComponentVulnerability>) {
		this._vulnerabilities = val;
	}

	public isMitigated() {
		for (var i = 0; i < this._vulnerabilities.length; i++) {
			if (this._vulnerabilities[i].IsMitigation) {
				return false;
			}
		}
		return true;
	}

	public get FilePathsList(): Array<string> {
		return this._FilePathsList;
	}
	public set FilePathsList(value: Array<string>) {
		this._FilePathsList = value;
	}
}

/**
 * Holds Constants used throughout extension
 */
export class Constants {

	//user metadata
	public static get usermetadata_ExtensionVersion(): string {	return "1.0.0" }
	public static get usermetadata_Name(): string { return "VeracodeVSTSExtension"; }
	public static get usermetadata_Unknown(): string { return "Unknown"; }

	// Build Status related constants
	public static get BuildStatus_incomplete(): string { return "Incomplete"; }
	public static get BuildStatus_notsubmitted(): string { return "Not Submitted to Engine"; }
	public static get BuildStatus_submitted(): string { return "Submitted to Engine"; }
	public static get BuildStatus_scanerrors(): string { return "Scan Errors"; }
	public static get BuildStatus_scaninprocess(): string { return "Scan In Process"; }
	public static get BuildStatus_scancancelled(): string { return "Scan Cancelled"; }
	public static get BuildStatus_internalerror(): string { return "Scan Internal Error"; }
	public static get BuildStatus_pendinginternalreview(): string { return "Pending Internal Review"; }
	public static get BuildStatus_resultsready(): string { return "Results Ready"; }
	public static get BuildStatus_preflightsubmitted(): string { return "Pre-Scan Submitted"; }
	public static get BuildStatus_preflightfailed(): string { return "Pre-Scan Failed"; }
	public static get BuildStatus_preflightsuccess(): string { return "Pre-Scan Success"; }
	public static get BuildStatus_preflightnomodules(): string { return "No Modules Defined"; }
	public static get BuildStatus_pendingvendoracceptance(): string { return "Pending Vendor Confirmation"; }
	public static get BuildStatus_preflightcancelled(): string { return "Pre-Scan Cancelled"; }
	public static get BuildStatus_scanonhold(): string { return "Scan On Hold"; }
	public static get BuildStatus_timeframepending(): string { return "Timeframe Pending"; }
	public static get BuildStatus_paused(): string { return "Paused"; }
	public static get BuildStatus_stopping(): string { return "Stopping"; }
	public static get BuildStatus_pausing(): string { return "Pausing"; }
	public static get BuildStatus_NoModulesDefined(): string { return "No Modules Defined"; }

	// Policy Compliance Status related constants
	public static get policycompliancestatus_determining(): string { return "Calculating..."; }
	public static get policycompliancestatus_not_assessed(): string { return "Not Assessed"; }
	public static get policycompliancestatus_did_not_pass(): string { return "Did Not Pass"; }
	public static get policycompliancestatus_conditional_pass(): string { return "Conditional Pass"; }
	public static get policycompliancestatus_passed(): string { return "Pass"; }
	public static get policycompliancestatus_vendor_review(): string { return "Under Vendor Review"; }

	public static get status_passed(): string { return "Passed"; }
	public static get status_failed(): string { return "Failed"; }
	public static get status_False_TitleCase(): string { return "False"; }
	public static get status_False_LowerCase(): string { return "false"; }
	public static get status_False_UpperCase(): string { return "FALSE"; }
	public static get status_True_TitleCase(): string { return "True"; }
	public static get status_True_LowerCase(): string { return "true"; }
	public static get status_True_UpperCase(): string { return "TRUE"; }

	public static get string_NotAvailable(): string { return "NA"; }
	public static get string_Empty(): string { return ""; }
	public static get string_undefined(): string { return 'undefined'; }

	public static get application_Criticality_VeryHigh(): string { return "VeryHigh"; }

	public static get processTemplate_Agile(): string { return 'Agile'; }
	public static get processTemplate_Scrum(): string { return 'Scrum'; }
	public static get processTemplate_CMMI(): string { return 'CMMI'; }
	public static get processTemplate_Basic(): string { return 'Basic'; }
	public static get processTemplate_Custom(): string { return 'Custom'; }

	public static get wiType_Issue(): string { return 'Issue'; }
	public static get wiType_Bug(): string { return 'Bug'; }
	public static get wiType_Task(): string { return 'Task'; }
	public static get wiType_TestCase(): string { return 'Test Case'; }

	public static get veracodePlatformResultPage_Infix(): string { return "/auth/index.jsp#HomeAppProfile:" }
	public static get componentProfilePage_Infix(): string { return "/auth/index.jsp#ReviewResultsSCA:" }

	public static get request_Prefix(): string { return "https://"; }
	public static get flawURL_Infix(): string { return "/auth/index.jsp#ReviewResultsFlaw:" }
	public static get policyPageURL_Infix(): string { return "/auth/index.jsp#Policies" }
	public static get cwePageURL_prefix(): string { return "http://cwe.mitre.org/data/definitions/" }
	public static get cvePageURL_prefix(): string { return "https://nvd.nist.gov/vuln/detail/" }
	public static get cwePageURL_postFix(): string { return ".html" }
	// File paths and names	
	public static get apiWrapperName(): string { return 'VeracodeJavaAPI.jar' }
	public static get detailedReportFolderLocation(): string { return path.join(__dirname, "reports"); }
	public static get detailedReportFileName(): string { return "detailedReportdata_FI.xml" }

	// API Actions	
	public static get apiAction_GetApplist(): string { return 'getapplist' }
	public static get apiAction_GetBuildInfo(): string { return 'getbuildinfo' }
	public static get apiAction_GetBuildList(): string { return 'getbuildlist' }
	public static get apiAction_GetSandBoxlist(): string { return 'getsandboxlist' }
	public static get apiAction_GetDetailedReport(): string { return 'detailedreport' }
	public static get apiAction_GetRegion(): string { return 'getregion' }
	public static get apiAction_GetBuildDetailsByApplicationId(): string { return 'getapplications' }

	public static get serverEndpointAuth_UnPw(): string { return 'UsernamePassword' }
	public static get connectionDetailsSelection_ServiceConnection(): string { return 'Service Connection' }
	public static get connectionDetailsSelection_Endpoint(): string { return 'Endpoint' }

	public static get excludedExtentions(): string { return 'xml,config' }
	public static get filteredFileDirectory(): string { return 'StagingFiles' }

	public static get summaryReportType_UploadandScanOnly(): string { return 'Upload and Scan Only' }
	public static get summaryReportType_GetFullSummary(): string { return 'Get Full Summary' }

	public static get bug_severity_Critical(): string { return '1 - Critical' }
	public static get bug_severity_High(): string { return '2 - High' }
	public static get bug_severity_Medium(): string { return '3 - Medium' }
	public static get bug_severity_Low(): string { return '4 - Low' }

	public static get remediation_status_New(): string { return 'New' }
	public static get remediation_status_Open(): string { return 'Open' }
	public static get remediation_status_Fixed(): string { return 'Fixed' }
	public static get remediation_status_CannotReproduce(): string { return 'Cannot Reproduce' }
	public static get remediation_status_Reopened(): string { return 'Reopened' }
	public static get remediation_status_PotentialFalsePositive(): string { return 'Potential False Positive' }
	public static get remediation_status_Re_Opened(): string { return 'Re-Open' }

	public static get mitigation_Status_Accepted(): string { return 'accepted' }
	public static get mitigation_Status_None(): string { return 'none' }

	//Work Item import filter constants
	public static get WorkItemImport_None(): string { return 'None' }
	public static get WorkItemImport_AllFlaws(): string { return 'All Flaws' }
	public static get WorkItemImport_AllUnmitigatedFlaws(): string { return 'All Unmitigated Flaws' }
	public static get WorkItemImport_AllFlawsThatViolatingPolicy(): string { return 'All Flaws Violating Policy' }
	public static get WorkItemImport_AllUnmitigatedFlawsThatViolatingPolicy(): string { return 'All Unmitigated Flaws Violating Policy' }

	//Optional Parameters
	public static get optionalArgument_sandboxid(): string { return 'sandboxid' }
	public static get optionalArgument_sandboxname(): string { return 'sandboxname' }
	public static get optionalArgument_phost(): string { return 'phost' }
	public static get optionalArgument_ppassword(): string { return 'ppassword' }
	public static get optionalArgument_pport(): string { return 'pport' }
	public static get optionalArgument_puser(): string { return 'puser' }

	public static get flawType_Static(): string { return 'Static' }
	public static get flawType_Dynamic(): string { return 'Dynamic' }

	public static get staticFlawWorkItem_TitlePrefix(): string { return 'Veracode Flaw (Static):' }
	public static get dynamicFlawWorkItem_TitlePrefix(): string { return 'Veracode Flaw (Dynamic):' }

	//Regex Patterns
	public static get wascURL_RegEX(): string { return 'WASC\\s*\\(http:\\/\\/webappsec.pbworks.com\\/.*\\)' }
	public static get flawLimitNumberValidation_RegEX(): string { return "^[0-9]*$" }

	public static get ServerReturnedHTTPResponseCode524(): string { return "Server returned HTTP response code: 524" }

	public static get html_LineBreak(): string { return "<br>" }
	public static get newLine(): string { return "\n" }
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
	public static get wiStatus_Active(): string { return 'Active' }
	public static get wiStatus_Closed(): string { return 'Closed' }
	public static get wiStatus_Design(): string { return 'Design' }
	public static get wiStatus_New(): string { return 'New' }
	public static get wiStatus_Resolved(): string { return 'Resolved' }
	public static get wiStatus_Committed(): string { return 'Committed' }
	public static get wiStatus_Done(): string { return 'Done' }
	public static get wiStatus_Proposed(): string { return 'Proposed' }
	public static get wiStatus_ToDo(): string { return 'To Do' }
	public static get wiStatus_Doing(): string { return 'Doing' }

	public static get FlawImporter_InvalidYAMLPropertiesMessage(): string { return "One or more YAML properties for Veracode Upload and Scan task has empty or invalid value. Please correct these values and, then, try again." }
	public static get MaxCharactersAllowedInApplicationName(): number { return 256 }
	public static get MaxCharactersAllowedInSandboxName(): number { return 247 }
	public static get ApplicationNameTooLong(): string { return "The Application Name cannot have more than 256 characters" }
	public static get SandboxNameTooLong(): string { return "The Sandbox Name cannot have more than 247 characters" }
	public static get GreaterThanSymbol(): string { return ">" }
	public static get LessThanSymbol(): string { return "<" }
	public static get InvalidVeracodeApplicationName(): string { return "You can only use standard alphabetic, numeric, and punctuation characters in the Application Name field. You have tried to use unsupported characters." }
	public static get InvalidCredentialsPrefix(): string { return "The credentials contain invalid prefix." }
	public static get PlatformAccessError(): string { return "Error occurred while accessing the Veracode Platform." }

	// Types of Findings menu options
	public static get scanType_DASTAndSAST_Old(): string { return 'Dynamic and Static Analysis' }
	public static get scanType_OnlySCA_Old(): string { return 'Software Composition Analysis' }
	public static get scanType_DASTAndSASTAndSCA_Old(): string { return 'Dynamic, Static, and Software Composition Analysis' }
	public static get scanType_StaticAndSCA_Old(): string { return 'Static and SCA Analysis' }
	public static get scanType_DASTAndSAST(): string { return 'Dynamic, Static' }
	public static get scanType_OnlySCA(): string { return 'SCA' }
	public static get scanType_DASTAndSASTAndSCA(): string { return 'Dynamic, Static, SCA' }
	public static get scanType_StaticAndSCA(): string { return 'Static, SCA' }

	public static get SCAMitigationCommentPrefix(): string { return 'This Vulnerability has been mitigated. Reason is' }
	public static get SCAIssueReOpenCommentPrefix(): string { return 'Reopen issue because the vulnerability is unmitigated in build' }
	public static get StaticAndDynamicCommentPrefix(): string { return `Mitigation Status:` }

	//system variables
	public static get VIdVariable(): string { return "VERACODE_API_KEY_ID" }
	public static get VKeyVariable(): string { return "VERACODE_API_KEY_SECRET" }
	public static get ProxyVariable(): string { return "VERACODE_HTTPS_PROXY" }
}
/**
 * Contains helper methods use in flaw importer
 */
export class CommonHelper {
	/**
	 * Check whether flaw is reopened
	 * @param processTemplate - TFS/VSTS process template 
	 * @param flawItem Current flaw data
	 * @param retrievedWi workitem data
	 * @param workItemStateNew new status related to current process template
	 * @param workItemStateClosed close status related to current process template
	 * @param workItemStateResolved ressolved status related to current process template
	 */
	public isReopened(processTemplate: string, flawItem: WorkItemDto, retrievedWi: wi.WorkItem, workItemStateNew: any, workItemStateClosed: any, workItemStateResolved: any): boolean {
		var flag: boolean = false;
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
	public setTaskFailure(message: string) {
		throw new Error(`Build Failed: ${message}`);
	}

	/**
	 * Filter work items by flaw types selected by user
	 * @param flawData Veracode flaw related data
	 * @param workItem Work item data
	 * @param workItemsCreationData Work item creation data
	 * @param importParameters user inputs
	 */
	public filterWorkItemsByFlawType(
		flawData: FlawDto,
		workItem: WorkItemDto,
		workItemsCreationData: workItemsDataDto,
		importParameters: FlawImporterParametersDto) {
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
	private handleFlaws(
		flawData: FlawDto,
		workItem: WorkItemDto,
		workItemsCreationData: workItemsDataDto) {

		actionsCore.debug("Class Name: CommonHelper, Method Name: handleFlaws");
		if (flawData.MitigationStatus != Constants.mitigation_Status_Accepted) {
			workItemsCreationData.WorkItemList.push(workItem);
		} else {
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
	public handleError(error: any, message: string, failBuildIfFlawImporterBuildStepFails: boolean) {
		if (error) {
			console.error(`Error: ${error}`);
		}
		if (failBuildIfFlawImporterBuildStepFails) {
			this.setTaskFailure(message);
		} else {
			console.log(message);
		}
	}
}

/**
 * Holds the team project reference data
 * */
export class TeamProjectDto implements core.TeamProjectReference {
	abbreviation: string = "";
	description: string = "";
	id: string = "";
	name: string = "";
	revision: number = 0;
	state: any;
	url: string = "";
}
