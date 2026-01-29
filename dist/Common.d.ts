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
/**
 * Holds Data About Custom process templates
 */
export declare class CustomProcessTemplateDataDto {
    private _customPTActiveStatus;
    private _customPTCloseStatus;
    private _customPTNewStatus;
    private _customPTRessolvedStatus;
    private _customPTDesignStatus;
    private _templateType;
    private _workItemType;
    private _customFields;
    get WorkItemType(): string;
    set WorkItemType(val: string);
    get TemplateType(): string;
    set TemplateType(val: string);
    get CustomPTActiveStatus(): string;
    set CustomPTActiveStatus(val: string);
    get CustomPTCloseStatus(): string;
    set CustomPTCloseStatus(val: string);
    get CustomPTRessolvedStatus(): string;
    set CustomPTRessolvedStatus(val: string);
    get CustomPTNewStatus(): string;
    set CustomPTNewStatus(val: string);
    get CustomPTDesignStatus(): string;
    set CustomPTDesignStatus(val: string);
    get CustomFields(): Map<string, string>;
    set CustomFields(val: Map<string, string>);
}
/**
 * Holds Detailed Report details  and work Item details
 */
export declare class workItemsDataDto {
    private _severityDTOList;
    private _appID;
    private _BuildId;
    private _workItemList;
    private _rawImportLimit;
    private _area;
    private _flawImportLimit;
    private _buildVersion;
    private _importType;
    private _overwriteAreaPathInWorkItemsOnImport;
    private _iterationPath;
    private _overwriteIterationPathInWorkItemsOnImport;
    constructor();
    get ImportType(): string;
    set ImportType(val: string);
    get BuildVersion(): string;
    set BuildVersion(val: string);
    get FlawImportLimit(): number;
    set FlawImportLimit(val: number);
    get WorkItemList(): Array<WorkItemDto>;
    set WorkItemList(val: Array<WorkItemDto>);
    get Appid(): string;
    set Appid(val: string);
    get BuildID(): string;
    set BuildID(val: string);
    get SeverityDTOList(): Array<SeverityDetailedReportDto>;
    set SeverityDTOList(val: Array<SeverityDetailedReportDto>);
    get RawImportLimit(): number;
    set RawImportLimit(val: number);
    get Area(): string;
    set Area(val: string);
    get IterationPath(): string;
    set IterationPath(val: string);
    get OverwriteAreaPathInWorkItemsOnImport(): boolean;
    set OverwriteAreaPathInWorkItemsOnImport(val: boolean);
    get OverwriteIterationPathInWorkItemsOnImport(): boolean;
    set OverwriteIterationPathInWorkItemsOnImport(val: boolean);
}
/**
 * workItemDto holds work items
 */
export declare class WorkItemDto {
    private _title;
    private _severity;
    private _severityValue;
    private _tags;
    private _isOpenAccordingtoMitigationStatus;
    private _html;
    private _flawStatus;
    private _affectedbyPolicy;
    private _flawComments;
    private _fixByDate;
    private _scanTypeAsTag;
    private _severityAsTag;
    constructor();
    get FlawComments(): string;
    set FlawComments(val: string);
    get AffectedbyPolicy(): boolean;
    set AffectedbyPolicy(val: boolean);
    get FlawStatus(): string;
    set FlawStatus(val: string);
    get Html(): string;
    set Html(val: string);
    get IsOpenAccordingtoMitigationStatus(): boolean;
    set IsOpenAccordingtoMitigationStatus(val: boolean);
    get Tags(): Array<string>;
    set Tags(val: Array<string>);
    get SeverityValue(): string;
    set SeverityValue(val: string);
    get Title(): string;
    set Title(val: string);
    get Severity(): number;
    set Severity(val: number);
    get FixByDate(): string;
    set FixByDate(val: string);
    get ScanTypeTag(): string;
    set ScanTypeTag(val: string);
    get SeverityTag(): string;
    set SeverityTag(val: string);
}
/**
 * ScanDTO : Holds Scan Results /Application Related Data
 */
export declare class ScanDto {
    private _buildStatus;
    private _policyComplianceStatus;
    private _buildId;
    private _oldBuildId;
    private _appID;
    private _appName;
    private _accountID;
    private _resultPageURL;
    private _FileCount;
    private _published_date;
    private _analysis_type;
    private _analysisCenterUrl;
    private _staticAnalysisUnitId;
    private _analysisId;
    private _componentProfileUrl;
    get AnalysisType(): string;
    set AnalysisType(val: string);
    get PublishedDate(): string;
    set PublishedDate(val: string);
    get ScanFileCount(): number;
    set ScanFileCount(val: number);
    get BuildStatus(): string;
    set BuildStatus(val: string);
    get PolicyComplianceStatus(): string;
    set PolicyComplianceStatus(val: string);
    get BuildId(): string;
    set BuildId(val: string);
    get OldBuildId(): string;
    set OldBuildId(val: string);
    get Appid(): string;
    set Appid(val: string);
    get AppName(): string;
    set AppName(val: string);
    get AccountID(): string;
    set AccountID(val: string);
    get ResultPageURL(): string;
    set ResultPageURL(val: string);
    get AnalysisCenterUrl(): string;
    set AnalysisCenterUrl(val: string);
    get AnalysisId(): string;
    set AnalysisId(val: string);
    get StaticAnalysisUnitId(): string;
    set StaticAnalysisUnitId(val: string);
    get ComponentProfileUrl(): string;
    set ComponentProfileUrl(val: string);
}
/**
 * BuildDTO : Holds Build Scan Data
 */
export declare class ScanParametersDto {
    private _apiAction;
    private _isSAndboxScan;
    private _filepath;
    private _idKeyString;
    private _veracodeAppProfile;
    private _createProfile;
    private _credentialType;
    private _isUsernamePasswordCredentialType;
    private _username;
    private _password;
    private _version;
    private _sandboxId;
    private _sandboxName;
    private _optArgs;
    private _failBuildOnPolicyFail;
    private _vID;
    private _vKey;
    private _veracodeAPIWrapper;
    private _scanStatusCheckInterval;
    private _importResults;
    private _isMainSummaryReport;
    private _stagingFilesPath;
    get StagingFilesPath(): string;
    set StagingFilesPath(val: string);
    get SandboxName(): string;
    set SandboxName(val: string);
    get IsMainSummaryReport(): boolean;
    set IsMainSummaryReport(val: boolean);
    get ApiAction(): string;
    set ApiAction(val: string);
    get IsScandboxScan(): boolean;
    set IsScandboxScan(val: boolean);
    get Filepath(): string;
    set Filepath(val: string);
    get IdKeyString(): string;
    set IdKeyString(val: string);
    get VeracodeAppProfile(): string;
    set VeracodeAppProfile(val: string);
    get CreateProfile(): string;
    set CreateProfile(val: string);
    get CredentialType(): boolean;
    set CredentialType(val: boolean);
    get IsUsernamePasswordCredentialType(): boolean;
    set IsUsernamePasswordCredentialType(val: boolean);
    get Username(): string;
    set Username(val: string);
    get Password(): string;
    set Password(val: string);
    get Version(): string;
    set Version(val: string);
    get SandboxId(): string;
    set SandboxId(val: string);
    get OptArgs(): string[];
    set OptArgs(val: string[]);
    get FailBuildOnPolicyFail(): boolean;
    set FailBuildOnPolicyFail(val: boolean);
    get ImportResults(): boolean;
    set ImportResults(val: boolean);
    get VID(): string;
    set VID(val: string);
    get VKey(): string;
    set VKey(val: string);
    get VeracodeAPIWrapper(): string;
    set VeracodeAPIWrapper(val: string);
    get ScanStatusCheckInterval(): number;
    set ScanStatusCheckInterval(val: number);
}
export declare class FlawImporterParametersDto {
    private _importType;
    private _workItemType;
    private _areaPath;
    private _addCweTag;
    private _addCustomTag;
    private _foundInBuild;
    private _flawImportLimit;
    private _apiAction;
    private _isValidationsSuccess;
    private _veracodeAppProfile;
    private _sandboxId;
    private _sandboxName;
    private _vID;
    private _vKey;
    private _veracodeAPIWrapper;
    private _customFields;
    private _overwriteAreaPathInWorkItemsOnImport;
    private _addScanNameAsATag;
    private _scanType;
    private _failBuildIfFlawImporterBuildStepFails;
    private _iterationPath;
    private _overwriteIterationPathInWorkItemsOnImport;
    private _scanTypeAsTag;
    private _severityAsTag;
    private _dueDateAsTag;
    private _addCveTag;
    private _adoToken;
    private _adoOrg;
    private _adoProject;
    private _pport;
    private _phost;
    private _puser;
    private _ppassword;
    private _isDebugEnabled;
    get IsValidationsSuccess(): boolean;
    set IsValidationsSuccess(val: boolean);
    get Pport(): string;
    set Pport(val: string);
    get Phost(): string;
    set Phost(val: string);
    get Puser(): string;
    set Puser(val: string);
    get Ppassword(): string;
    set Ppassword(val: string);
    get ApiAction(): string;
    set ApiAction(val: string);
    get VID(): string;
    set VID(val: string);
    get VKey(): string;
    set VKey(val: string);
    get VeracodeAppProfile(): string;
    set VeracodeAppProfile(val: string);
    get SandboxName(): string;
    set SandboxName(val: string);
    get SandboxId(): string;
    set SandboxId(val: string);
    get ImportType(): string;
    set ImportType(val: string);
    get WorkItemType(): string;
    set WorkItemType(val: string);
    get AreaPath(): string;
    set AreaPath(val: string);
    get IterationPath(): string;
    set IterationPath(val: string);
    get AddCweTag(): boolean;
    set AddCweTag(val: boolean);
    get AddCveTag(): boolean;
    set AddCveTag(val: boolean);
    get AddCustomTag(): string;
    set AddCustomTag(val: string);
    get FoundInBuild(): boolean;
    set FoundInBuild(val: boolean);
    get FlawImportLimit(): number;
    set FlawImportLimit(val: number);
    get VeracodeAPIWrapper(): string;
    set VeracodeAPIWrapper(val: string);
    get IsDebugEnabled(): boolean;
    set IsDebugEnabled(val: boolean);
    get CustomFields(): Map<string, string>;
    set CustomFields(val: Map<string, string>);
    get OverwriteAreaPathInWorkItemsOnImport(): boolean;
    set OverwriteAreaPathInWorkItemsOnImport(val: boolean);
    get OverwriteIterationPathInWorkItemsOnImport(): boolean;
    set OverwriteIterationPathInWorkItemsOnImport(val: boolean);
    get AddScanNameAsATag(): boolean;
    set AddScanNameAsATag(val: boolean);
    get ScanType(): string;
    set ScanType(val: string);
    get FailBuildIfFlawImporterBuildStepFails(): boolean;
    set FailBuildIfFlawImporterBuildStepFails(val: boolean);
    get ScanTypeTag(): boolean;
    set ScanTypeTag(val: boolean);
    get SeverityTag(): boolean;
    set SeverityTag(val: boolean);
    get DueDateTag(): boolean;
    set DueDateTag(val: boolean);
    get AdoToken(): string;
    set AdoToken(val: string);
    get AdoOrg(): string;
    set AdoOrg(val: string);
    get AdoProject(): string;
    set AdoProject(val: string);
}
/**
 * Holds Data About Security Vulnerability Category
 */
export declare class CategorySummaryReportDto {
    private _categoryname;
    private _count;
    get CategoryName(): string;
    set CategoryName(val: string);
    get Count(): number;
    set Count(val: number);
}
/**
 * Holds data about Severity
 */
export declare class SeveritySummaryReportDto {
    private _level;
    private _totalFailedCount;
    private _categoryList;
    private _severityName;
    constructor();
    get TotalFailedCount(): number;
    set TotalFailedCount(val: number);
    get SeverityName(): string;
    set SeverityName(val: string);
    get Level(): number;
    set Level(val: number);
    get CategoryList(): Array<CategorySummaryReportDto>;
    set CategoryList(val: Array<CategorySummaryReportDto>);
}
/**
 * Holds SummaryReport details
 */
export declare class SummaryReportDto {
    private _severityDTOList;
    private _policy_name;
    private _veracode_level;
    private _version;
    private _score;
    private _summaryReportbuildID;
    private _policyComplianceStatus;
    private _staticAnalysisFrequency;
    private _resultPageURL;
    private _appID;
    private _totalFlaws;
    private _totalNewFlaws;
    private _graphDTO;
    private _reportType;
    constructor();
    get ReportType(): string;
    set ReportType(val: string);
    get GraphDTO(): GraphDto;
    set GraphDTO(val: GraphDto);
    get TotalFlaws(): string;
    set TotalFlaws(val: string);
    get TotalNewFlaws(): string;
    set TotalNewFlaws(val: string);
    get Appid(): string;
    set Appid(val: string);
    get ResultPageURL(): string;
    set ResultPageURL(val: string);
    get StaticAnalysisFrequency(): string;
    set StaticAnalysisFrequency(val: string);
    get PolicyComplianceStatus(): string;
    set PolicyComplianceStatus(val: string);
    get SummaryReportbuildID(): string;
    set SummaryReportbuildID(val: string);
    get SeverityDTOList(): Array<SeveritySummaryReportDto>;
    set SeverityDTOList(val: Array<SeveritySummaryReportDto>);
    get PolicyName(): string;
    set PolicyName(val: string);
    get VeracodeLevel(): string;
    set VeracodeLevel(val: string);
    get Version(): string;
    set Version(val: string);
    get Score(): number;
    set Score(val: number);
}
export declare class GraphListItemsDto {
    private _buildDate;
    private _totalFlaws;
    private _flawPrecentage;
    get FlawPrecentage(): string;
    set FlawPrecentage(val: string);
    get TotalFlaws(): string;
    set TotalFlaws(val: string);
    get BuildDate(): string;
    set BuildDate(val: string);
}
/**
* Holds Graph details to display on Summary Report
*/
export declare class GraphDto {
    private _appID;
    private _buildID;
    private _allBuildIDs;
    private _currentBuildIDs;
    private _graphListItemsDTOList;
    constructor();
    get GraphListItemsDTOList(): Array<GraphListItemsDto>;
    set GraphListItemsDTOList(val: Array<GraphListItemsDto>);
    get APPID(): string;
    set APPID(val: string);
    get BuildID(): string;
    set BuildID(val: string);
    get AllBuildIDs(): string[];
    set AllBuildIDs(val: string[]);
    get CurrentBuildIDs(): string[];
    set CurrentBuildIDs(val: string[]);
}
/**
 * Holds work item Comments Data
 */
export declare class CommentsDTO {
    private _date;
    private _comment;
    get Date(): string;
    set Date(val: string);
    get Comment(): string;
    set Comment(val: string);
}
/**
 * Holds Data About Security Flaws of Details report
 */
export declare class FlawDto {
    private _categoryname;
    private _issueID;
    private _flawDescription;
    private _mitigationStatus;
    private _line;
    private _sourcefile;
    private _module;
    private _flawAffectedbyPolicy;
    private _attackVector;
    private _remediation_status;
    private _flawType;
    private _dynamicFlawUrl;
    private _dynamicFlawParameter;
    private _commentsList;
    private _mitigationStatusDescription;
    private _gracePeriodExpires;
    constructor();
    get CommentsList(): Array<CommentsDTO>;
    set CommentsList(val: Array<CommentsDTO>);
    get DynamicFlawURL(): string;
    set DynamicFlawURL(val: string);
    get DynamicFlawParameter(): string;
    set DynamicFlawParameter(val: string);
    get FlawType(): string;
    set FlawType(val: string);
    get RemediationStatus(): string;
    set RemediationStatus(val: string);
    get AttackVector(): string;
    set AttackVector(val: string);
    get FlawAffectedbyPolicy(): boolean;
    set FlawAffectedbyPolicy(val: boolean);
    get Line(): string;
    set Line(val: string);
    get SourceFile(): string;
    set SourceFile(val: string);
    get Module(): string;
    set Module(val: string);
    get IssueID(): number;
    set IssueID(val: number);
    get CategoryName(): string;
    set CategoryName(val: string);
    get FlawDescription(): string;
    set FlawDescription(val: string);
    get MitigationStatus(): string;
    set MitigationStatus(val: string);
    get MitigationStatusDescription(): string;
    set MitigationStatusDescription(val: string);
    get GracePeriodExpires(): string;
    set GracePeriodExpires(val: string);
}
/**
 * Holds Main Category Description of Details report
 */
export declare class CategoryDescriptionDetailedReportDto {
    private _paraList;
    constructor();
    get ParaList(): Array<Para>;
    set ParaList(val: Array<Para>);
}
/**
 * Holds Main Category Recomendations of Details report
 */
export declare class CategoryRecomendationsDetailedReportDto {
    private _paraList;
    constructor();
    get ParaList(): Array<Para>;
    set ParaList(val: Array<Para>);
}
/**
 * Holds paragraph details
 */
export declare class Para {
    private _paraText;
    private _bulletItemList;
    constructor();
    get BulletItemList(): Array<BulletItem>;
    set BulletItemList(val: Array<BulletItem>);
    get ParaText(): string;
    set ParaText(val: string);
}
/**
 * Holds bullet item details
 */
export declare class BulletItem {
    private _bulletText;
    get BulletText(): string;
    set BulletText(val: string);
}
/**
 * Holds Data About cwe Data
 */
export declare class cweDto {
    private _cweId;
    private _cweName;
    private _cweDescription;
    private _flawList;
    constructor();
    get CweDescription(): CweDescription;
    set CweDescription(val: CweDescription);
    get FlawList(): Array<FlawDto>;
    set FlawList(val: Array<FlawDto>);
    get CweId(): string;
    set CweId(val: string);
    get CweName(): string;
    set CweName(val: string);
}
/**
 * Holds Data About cwe description
 */
export declare class CweDescription {
    private _descriptionTextList;
    constructor();
    get DescriptionTextList(): Array<DescriptionText>;
    set DescriptionTextList(val: Array<DescriptionText>);
}
/**
 * Holds Data About cwe description text
 */
export declare class DescriptionText {
    private _text;
    get Text(): string;
    set Text(val: string);
}
/**
 * Holds Data About Security Vulnerability Category of Details report
 */
export declare class CategoryDetailedReportDto {
    private _categoryname;
    private _categoryDescription;
    private _categoryRecomendations;
    private _cweList;
    constructor();
    get CweList(): Array<cweDto>;
    set CweList(val: Array<cweDto>);
    get Recomendations(): CategoryRecomendationsDetailedReportDto;
    set Recomendations(val: CategoryRecomendationsDetailedReportDto);
    get Description(): CategoryDescriptionDetailedReportDto;
    set Description(val: CategoryDescriptionDetailedReportDto);
    get CategoryName(): string;
    set CategoryName(val: string);
}
/**
 * Holds data about Severity of Details report
 */
export declare class SeverityDetailedReportDto {
    private _level;
    private _categoryList;
    constructor();
    get Level(): number;
    set Level(val: number);
    get CategoryList(): Array<CategoryDetailedReportDto>;
    set CategoryList(val: Array<CategoryDetailedReportDto>);
}
export declare class FileDto {
    private _sourcePath;
    private _size;
    get SourcePath(): string;
    set SourcePath(val: string);
    get Size(): number;
    set Size(val: number);
}
/**
 * Holds SummaryReport details
 */
export declare class DetailedReportDto {
    private _severityDTOList;
    private _titleList;
    private _appID;
    private _BuildId;
    constructor();
    get TitleList(): Array<string>;
    set TitleList(val: Array<string>);
    get Appid(): string;
    set Appid(val: string);
    get BuildID(): string;
    set BuildID(val: string);
    get SeverityDTOList(): Array<SeverityDetailedReportDto>;
    set SeverityDTOList(val: Array<SeverityDetailedReportDto>);
}
/**
 * Holds SCA Component vulnerability data
 */
export declare class ComponentVulnerability {
    private _cveId;
    private _cveSummary;
    private _cweId;
    private _isMitigation;
    private _mitigationType;
    private _mitigationCommentOnFlawClosure;
    private _severity;
    private _doesAffectPolicy;
    private _firstFoundDate;
    private _filePathList;
    constructor();
    get CveId(): string;
    set CveId(val: string);
    get CveSummary(): string;
    set CveSummary(val: string);
    get CweId(): string;
    set CweId(val: string);
    get IsMitigation(): boolean;
    set IsMitigation(val: boolean);
    get MitigationType(): string;
    set MitigationType(val: string);
    get MitigationCommentOnFlawClosure(): string;
    set MitigationCommentOnFlawClosure(val: string);
    get Severity(): string;
    set Severity(val: string);
    get DoesAffectPolicy(): boolean;
    set DoesAffectPolicy(val: boolean);
    get FirstFoundDate(): string;
    set FirstFoundDate(val: string);
    get FilePathList(): Array<string>;
    set FilePathList(val: Array<string>);
}
/**
* Holds data about Vulnerable Components (SCA findings)
*/
export declare class VulnerableComponentDetailedReportDto {
    private _library;
    private _componentId;
    private _version;
    private _vulnerabilities;
    private _FilePathsList;
    constructor();
    get Library(): string;
    set Library(val: string);
    get ComponentId(): string;
    set ComponentId(val: string);
    get Version(): string;
    set Version(val: string);
    get Vulnerabilities(): Array<ComponentVulnerability>;
    set Vulnerabilities(val: Array<ComponentVulnerability>);
    isMitigated(): boolean;
    get FilePathsList(): Array<string>;
    set FilePathsList(value: Array<string>);
}
/**
 * Holds Constants used throughout extension
 */
export declare class Constants {
    static get usermetadata_ExtensionVersion(): string;
    static get usermetadata_Name(): string;
    static get usermetadata_Unknown(): string;
    static get BuildStatus_incomplete(): string;
    static get BuildStatus_notsubmitted(): string;
    static get BuildStatus_submitted(): string;
    static get BuildStatus_scanerrors(): string;
    static get BuildStatus_scaninprocess(): string;
    static get BuildStatus_scancancelled(): string;
    static get BuildStatus_internalerror(): string;
    static get BuildStatus_pendinginternalreview(): string;
    static get BuildStatus_resultsready(): string;
    static get BuildStatus_preflightsubmitted(): string;
    static get BuildStatus_preflightfailed(): string;
    static get BuildStatus_preflightsuccess(): string;
    static get BuildStatus_preflightnomodules(): string;
    static get BuildStatus_pendingvendoracceptance(): string;
    static get BuildStatus_preflightcancelled(): string;
    static get BuildStatus_scanonhold(): string;
    static get BuildStatus_timeframepending(): string;
    static get BuildStatus_paused(): string;
    static get BuildStatus_stopping(): string;
    static get BuildStatus_pausing(): string;
    static get BuildStatus_NoModulesDefined(): string;
    static get policycompliancestatus_determining(): string;
    static get policycompliancestatus_not_assessed(): string;
    static get policycompliancestatus_did_not_pass(): string;
    static get policycompliancestatus_conditional_pass(): string;
    static get policycompliancestatus_passed(): string;
    static get policycompliancestatus_vendor_review(): string;
    static get status_passed(): string;
    static get status_failed(): string;
    static get status_False_TitleCase(): string;
    static get status_False_LowerCase(): string;
    static get status_False_UpperCase(): string;
    static get status_True_TitleCase(): string;
    static get status_True_LowerCase(): string;
    static get status_True_UpperCase(): string;
    static get string_NotAvailable(): string;
    static get string_Empty(): string;
    static get string_undefined(): string;
    static get application_Criticality_VeryHigh(): string;
    static get processTemplate_Agile(): string;
    static get processTemplate_Scrum(): string;
    static get processTemplate_CMMI(): string;
    static get processTemplate_Basic(): string;
    static get processTemplate_Custom(): string;
    static get wiType_Issue(): string;
    static get wiType_Bug(): string;
    static get wiType_Task(): string;
    static get wiType_TestCase(): string;
    static get veracodePlatformResultPage_Infix(): string;
    static get componentProfilePage_Infix(): string;
    static get request_Prefix(): string;
    static get flawURL_Infix(): string;
    static get policyPageURL_Infix(): string;
    static get cwePageURL_prefix(): string;
    static get cvePageURL_prefix(): string;
    static get cwePageURL_postFix(): string;
    static get apiWrapperName(): string;
    static get detailedReportFolderLocation(): string;
    static get detailedReportFileName(): string;
    static get apiAction_GetApplist(): string;
    static get apiAction_GetBuildInfo(): string;
    static get apiAction_GetBuildList(): string;
    static get apiAction_GetSandBoxlist(): string;
    static get apiAction_GetDetailedReport(): string;
    static get apiAction_GetRegion(): string;
    static get apiAction_GetBuildDetailsByApplicationId(): string;
    static get serverEndpointAuth_UnPw(): string;
    static get connectionDetailsSelection_ServiceConnection(): string;
    static get connectionDetailsSelection_Endpoint(): string;
    static get excludedExtentions(): string;
    static get filteredFileDirectory(): string;
    static get summaryReportType_UploadandScanOnly(): string;
    static get summaryReportType_GetFullSummary(): string;
    static get bug_severity_Critical(): string;
    static get bug_severity_High(): string;
    static get bug_severity_Medium(): string;
    static get bug_severity_Low(): string;
    static get remediation_status_New(): string;
    static get remediation_status_Open(): string;
    static get remediation_status_Fixed(): string;
    static get remediation_status_CannotReproduce(): string;
    static get remediation_status_Reopened(): string;
    static get remediation_status_PotentialFalsePositive(): string;
    static get remediation_status_Re_Opened(): string;
    static get mitigation_Status_Accepted(): string;
    static get mitigation_Status_None(): string;
    static get WorkItemImport_None(): string;
    static get WorkItemImport_AllFlaws(): string;
    static get WorkItemImport_AllUnmitigatedFlaws(): string;
    static get WorkItemImport_AllFlawsThatViolatingPolicy(): string;
    static get WorkItemImport_AllUnmitigatedFlawsThatViolatingPolicy(): string;
    static get optionalArgument_sandboxid(): string;
    static get optionalArgument_sandboxname(): string;
    static get optionalArgument_phost(): string;
    static get optionalArgument_ppassword(): string;
    static get optionalArgument_pport(): string;
    static get optionalArgument_puser(): string;
    static get flawType_Static(): string;
    static get flawType_Dynamic(): string;
    static get staticFlawWorkItem_TitlePrefix(): string;
    static get dynamicFlawWorkItem_TitlePrefix(): string;
    static get wascURL_RegEX(): string;
    static get flawLimitNumberValidation_RegEX(): string;
    static get ServerReturnedHTTPResponseCode524(): string;
    static get html_LineBreak(): string;
    static get newLine(): string;
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
    static get wiStatus_Active(): string;
    static get wiStatus_Closed(): string;
    static get wiStatus_Design(): string;
    static get wiStatus_New(): string;
    static get wiStatus_Resolved(): string;
    static get wiStatus_Committed(): string;
    static get wiStatus_Done(): string;
    static get wiStatus_Proposed(): string;
    static get wiStatus_ToDo(): string;
    static get wiStatus_Doing(): string;
    static get FlawImporter_InvalidYAMLPropertiesMessage(): string;
    static get MaxCharactersAllowedInApplicationName(): number;
    static get MaxCharactersAllowedInSandboxName(): number;
    static get ApplicationNameTooLong(): string;
    static get SandboxNameTooLong(): string;
    static get GreaterThanSymbol(): string;
    static get LessThanSymbol(): string;
    static get InvalidVeracodeApplicationName(): string;
    static get InvalidCredentialsPrefix(): string;
    static get PlatformAccessError(): string;
    static get scanType_DASTAndSAST_Old(): string;
    static get scanType_OnlySCA_Old(): string;
    static get scanType_DASTAndSASTAndSCA_Old(): string;
    static get scanType_StaticAndSCA_Old(): string;
    static get scanType_DASTAndSAST(): string;
    static get scanType_OnlySCA(): string;
    static get scanType_DASTAndSASTAndSCA(): string;
    static get scanType_StaticAndSCA(): string;
    static get SCAMitigationCommentPrefix(): string;
    static get SCAIssueReOpenCommentPrefix(): string;
    static get StaticAndDynamicCommentPrefix(): string;
    static get VIdVariable(): string;
    static get VKeyVariable(): string;
    static get ProxyVariable(): string;
}
/**
 * Contains helper methods use in flaw importer
 */
export declare class CommonHelper {
    /**
     * Check whether flaw is reopened
     * @param processTemplate - TFS/VSTS process template
     * @param flawItem Current flaw data
     * @param retrievedWi workitem data
     * @param workItemStateNew new status related to current process template
     * @param workItemStateClosed close status related to current process template
     * @param workItemStateResolved ressolved status related to current process template
     */
    isReopened(processTemplate: string, flawItem: WorkItemDto, retrievedWi: wi.WorkItem, workItemStateNew: any, workItemStateClosed: any, workItemStateResolved: any): boolean;
    /**
     * Failes the task and displays the input message
     * @param message
     */
    setTaskFailure(message: string): void;
    /**
     * Filter work items by flaw types selected by user
     * @param flawData Veracode flaw related data
     * @param workItem Work item data
     * @param workItemsCreationData Work item creation data
     * @param importParameters user inputs
     */
    filterWorkItemsByFlawType(flawData: FlawDto, workItem: WorkItemDto, workItemsCreationData: workItemsDataDto, importParameters: FlawImporterParametersDto): void;
    /**
     * Handle data related to all flaws and flaws that violating policy
     * @param flawData Veracode flaw related data
     * @param workItem Work item data
     * @param workItemsCreationData Work item creation data
     */
    private handleFlaws;
    /**
    * Decides whether fail build or not based on user preference
    * @param error - error
    * @param message - error message
    * @param failBuildIfFlawImporterBuildStepFails - determines whether it should fail the ADO build or not
    */
    handleError(error: any, message: string, failBuildIfFlawImporterBuildStepFails: boolean): void;
}
/**
 * Holds the team project reference data
 * */
export declare class TeamProjectDto implements core.TeamProjectReference {
    abbreviation: string;
    description: string;
    id: string;
    name: string;
    revision: number;
    state: any;
    url: string;
}
//# sourceMappingURL=Common.d.ts.map