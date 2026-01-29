import * as Facilitator from './Common';
/**
 * Perform intermediates actions to link VSTS and Veracode platform via JAVA API
 */
export declare class VeracodeBridge {
    private failBuildIfFlawImporterBuildStepFails;
    commonHelper: Facilitator.CommonHelper;
    constructor(importParameters: Facilitator.FlawImporterParametersDto);
    /**
     * Execute Java command and return result
     */
    private executeJavaCommand;
    /**
     * Retrieve Application details from veracode platform according to user provided app ID
     * @param {Facilitator.ScanDto} scanDetails - Consists of details required to obtain app information.
     * @param {Facilitator.FlawImporterParametersDto} importParameters - All parameters required to call wrapper methods.
     */
    getAppInfo(scanDetails: Facilitator.ScanDto, importParameters: Facilitator.FlawImporterParametersDto): Promise<Facilitator.ScanDto | null>;
    /**
     * Checks whether required application data available
     * @param scanDetails - Scan details
     */
    private performApplicationAvailabilityValidation;
    /**
     * Retrieve Sandbox details from veracode platform according to user provided app ID
     * @param {string} appID - Application ID
     * @param {Facilitator.FlawImporterParametersDto} importerParameters - All parameters required to call Wrapper Methods.
     */
    getSandboxInfo(appID: string, importParameters: Facilitator.FlawImporterParametersDto): Promise<void>;
    /**
     * Retrieve BuildInfo from veracode platform*
     * @param {Facilitator.FlawImporterParametersDto} importParameters - All parameters required to call Wrapper Methods.
     * @param {string} appID - application ID
     * @param {string} buildId - Build Id of the scan.
     * @return {Facilitator.ScanDto} - Scan details
     */
    getBuildDetailsbyId(importParameters: Facilitator.FlawImporterParametersDto, scanDetails: Facilitator.ScanDto, buildId: string): Promise<Facilitator.ScanDto>;
    /**
     * Download detail report data to defined location ,
     * read data in it and send back
     * @param {string} buildID - build which we reprecent detail report
     * @param {Facilitator.FlawImporterParametersDto} importerParameters - All parameters required to call Wrapper Methods.
     */
    downloadAndReadDetailedReportData(buildID: string, importParameters: Facilitator.FlawImporterParametersDto): Promise<string>;
    /**
     * Get Analysis center URL based on provided credentials
     * @param {Facilitator.ScanParametersDto} importerParameters - All parameters required to call Wrapper Methods.
     * @return {string} - Send Analysis center URL
     */
    getAnalysisCenterUrl(importerParameters: Facilitator.FlawImporterParametersDto): Promise<string>;
    /**
     * Obtain latest scan details of policy or sandbox scan
     * @param scanDetails - Scan details
     * @param importParameters - User imputs
     * @returns - Latest scan details
     */
    getLatestBuild(scanDetails: Facilitator.ScanDto, importParameters: Facilitator.FlawImporterParametersDto): Promise<Facilitator.ScanDto>;
    /**
     * Get latest scan details of given sandbox
     * @param scanDetails - Scan details
     * @param importerParameters - User inputs
     * @returns - Latest scan details of given sandbox
     */
    private getLatestSandboxScanDetails;
    /**
     * Extract build Ids from XML document
     * @param buildIdList build Id list
     * @param scanlistDataXmlDoc build list XML data
     * @returns list of build Ids
     */
    private extractFullBuildIdListFromXMLDocument;
    /**
     * Retrieve all Build ids in Application according to provided Applid from veracode platform
     * @param {Facilitator.ScanDto} scanDetails - scan details.
     * @param {Facilitator.FlawImporterParametersDto} importerParameters - All parameters required to call Wrapper Methods.
     * @return {Facilitator.ScanDto} -  details of latest scan
     */
    private getLatestPolicyScanDetailsByApplicationId;
    /**
     * Select latest Build by published date and build status ("result ready"")
     * @param {string[]} buildList - Builds data of all the builds in scan
     * @return {Facilitator.ScanDto} - Latest build in result ready status
     */
    private obtainLatestBuildoutofBuildList;
    /**
     * Get list of build ids
     * @param {string[]} buildList - Build ids
     * @param {any} appScanObj  - latest scan details of the application
     * @return {string[]} - Build Ids
     */
    private getLatestBuildIdList;
    /**
     * Provide metadata about the task
     */
    private getDefaultUserAgentHeaderValue;
    private displayPlatformConnectivityIssueMessage;
    /**
     * Retrieve application details from xml file
     * @param {xmlDocument} xml - XML document consist of application details
     * @param {Facilitator.ScanDto} scanDetails - Consists of details required to obtain application information.
     * @param {Facilitator.FlawImporterParametersDto} importerParametersDto - All parameters required to call Wrapper Methods.
     */
    private retrieveApplicationDetails;
    /**
    * Retrieve Sandbox details from xml file
    * @param {xmlDocument} xml - XML document consist of Sandbox details
    * @param {Facilitator.FlawImporterParametersDto}importerParametersDto - All parameters required to call Wrapper Methods.
    */
    private retrieveSandboxDetails;
    /**
     * Generates proxy variable string
     * @param importParameters - user entered parameters
     * @returns proxy variable string
     */
    private generateProxyString;
}
//# sourceMappingURL=VeracodeBridge.d.ts.map