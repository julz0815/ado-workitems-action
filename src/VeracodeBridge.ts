/*******************************************************************************
* Copyright (c) 2017 Veracode, Inc. All rights observed.
*
* Available for use by Veracode customers as described in the accompanying license agreement.
*
* Send bug reports or enhancement requests to support@veracode.com.
*
* See the license agreement for conditions on submitted materials.
******************************************************************************/
/// <reference types="q" />
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';
import * as path from 'path';
import * as q from 'q';
import * as Facilitator from './Common';
let xmlDom = require('@xmldom/xmldom').DOMParser;

// XMLDocument type from xmldom library
type XMLDocument = any;
/**
 * Perform intermediates actions to link VSTS and Veracode platform via JAVA API
 */
export class VeracodeBridge {

    private failBuildIfFlawImporterBuildStepFails: boolean;
    commonHelper: Facilitator.CommonHelper;
    constructor(importParameters: Facilitator.FlawImporterParametersDto) {
        this.commonHelper = new Facilitator.CommonHelper();
        this.failBuildIfFlawImporterBuildStepFails = importParameters.FailBuildIfFlawImporterBuildStepFails;
        process.env[Facilitator.Constants.VIdVariable] = importParameters.VID;
        process.env[Facilitator.Constants.VKeyVariable] = importParameters.VKey;
        if (importParameters.Phost && importParameters.Pport) {
            process.env[Facilitator.Constants.ProxyVariable] = this.generateProxyString(importParameters);
        }
    }

    /**
     * Execute Java command and return result
     */
    private async executeJavaCommand(args: string[]): Promise<{ code: number; stdout: string; stderr: string; error?: Error }> {
        let stdout = '';
        let stderr = '';
        let exitCode = 0;
        let error: Error | undefined;

        try {
            exitCode = await exec.exec('java', args, {
                listeners: {
                    stdout: (data: Buffer) => {
                        stdout += data.toString();
                    },
                    stderr: (data: Buffer) => {
                        stderr += data.toString();
                    }
                },
                silent: true
            });
        } catch (err) {
            error = err instanceof Error ? err : new Error(String(err));
            exitCode = 1;
        }

        return { code: exitCode, stdout, stderr, error };
    }

    //--Public methods--//

    /**
     * Retrieve Application details from veracode platform according to user provided app ID
     * @param {Facilitator.ScanDto} scanDetails - Consists of details required to obtain app information.
     * @param {Facilitator.FlawImporterParametersDto} importParameters - All parameters required to call wrapper methods.
     */
    public async getAppInfo(
        scanDetails: Facilitator.ScanDto,
        importParameters: Facilitator.FlawImporterParametersDto): Promise<Facilitator.ScanDto | null> {
        core.debug("Class Name: VeracodeBridge, Method Name: getAppInfo");

        try {
            console.log("Start Obtaining App Info");
            const args = [
                '-jar',
                importParameters.VeracodeAPIWrapper,
                '-action',
                importParameters.ApiAction
            ];
            if (importParameters.IsDebugEnabled) {
                args.push('-debug');
                args.push(Facilitator.Constants.status_True_LowerCase);
            }
            args.push('-useragent');
            args.push(this.getDefaultUserAgentHeaderValue());
            const applistData = await this.executeJavaCommand(args);
            core.debug(`Response Code: ${applistData.code}`);
            if (applistData.code == 2) {
                if (applistData.stderr.includes(Facilitator.Constants.InvalidCredentialsPrefix)) {
                    this.commonHelper.handleError(null, `${Facilitator.Constants.PlatformAccessError} ${Facilitator.Constants.InvalidCredentialsPrefix}`, this.failBuildIfFlawImporterBuildStepFails);
                } else {
                    this.commonHelper.handleError(null, Facilitator.Constants.PlatformAccessError, this.failBuildIfFlawImporterBuildStepFails);
                }
                return null;
            }
            if (applistData.stderr.length > 0) {
                core.debug("Following messages received while obtaining application details");
                core.debug(applistData.stderr);
            }
            if (applistData.error) {
                console.log("Errors occurred while trying to access Veracode platform");
                this.displayPlatformConnectivityIssueMessage();
                core.debug(`Error Name: ${applistData.error.name}`);
                core.debug(`Error Message: ${applistData.error.message}`);
                core.debug(`Error Stack: ${applistData.error.stack}`);
                this.commonHelper.handleError(null, Facilitator.Constants.PlatformAccessError, this.failBuildIfFlawImporterBuildStepFails);
                return null;
            }
            // obtain result object and map details to dto
            let applistDataXmlDoc: XMLDocument;
            let applistParser = new xmlDom();
            applistDataXmlDoc = applistParser.parseFromString(applistData.stdout, 'text/xml');
            this.retrieveApplicationDetails(applistDataXmlDoc, importParameters, scanDetails);
            this.performApplicationAvailabilityValidation(scanDetails);
            console.log("End Obtaining App Info");
            return scanDetails;
        } catch (error) {
            this.displayPlatformConnectivityIssueMessage();
            this.commonHelper.handleError(error, "Error occurred while obtaining application information", this.failBuildIfFlawImporterBuildStepFails);
            return null;
        }
    }

    /**
     * Checks whether required application data available
     * @param scanDetails - Scan details
     */
    private performApplicationAvailabilityValidation(scanDetails: Facilitator.ScanDto) {

        core.debug("Class Name: VeracodeBridge, Method Name: performApplicationAvailabilityValidation");
        if (scanDetails.Appid != undefined || scanDetails.Appid != null) {
            console.log(`App ID: ${scanDetails.Appid} App Name: ${scanDetails.AppName}`);
        } else {
            console.log("Problem occurred while accessing application name \n" +
                "Please make sure that either one of following is true, \n" +
                "1. Application with given name available in Veracode account.");
            this.commonHelper.handleError(null, "Invalid application name", this.failBuildIfFlawImporterBuildStepFails);
        }
    }

    /**
     * Retrieve Sandbox details from veracode platform according to user provided app ID
     * @param {string} appID - Application ID
     * @param {Facilitator.FlawImporterParametersDto} importerParameters - All parameters required to call Wrapper Methods.
     */
    public async getSandboxInfo(
        appID: string,
        importParameters: Facilitator.FlawImporterParametersDto): Promise<void> {
        core.debug("Class Name: VeracodeBridge, Method Name: getSandboxInfo");

        try {
            console.log("Start Obtaining Sandbox Info");
            const args = [
                '-jar',
                importParameters.VeracodeAPIWrapper,
                '-action',
                importParameters.ApiAction,
                '-appid',
                appID
            ];
            if (importParameters.IsDebugEnabled) {
                args.push('-debug');
                args.push(Facilitator.Constants.status_True_LowerCase);
            }
            args.push('-useragent');
            args.push(this.getDefaultUserAgentHeaderValue());
            const sandboxlistData = await this.executeJavaCommand(args);
            if (sandboxlistData.stderr.length > 0) {
                core.debug("Following Messages Received While Obtaining Sandbox Details");
                core.debug(sandboxlistData.stderr);
            }
            if (sandboxlistData.error) {
                core.debug(`Error Name: ${sandboxlistData.error.name}`);
                core.debug(`Error Message: ${sandboxlistData.error.message}`);
                core.debug(`Error Stack: ${sandboxlistData.error.stack}`);
                this.commonHelper.handleError(null, "Obtaining sandbox list failed", this.failBuildIfFlawImporterBuildStepFails);
            }
            // obtain result object and map details to dto 
            let sandboxlistDataXmlDoc: XMLDocument;
            let sandboxlistParser = new xmlDom();
            sandboxlistDataXmlDoc = sandboxlistParser.parseFromString(sandboxlistData.stdout, 'text/xml');
            this.retrieveSandboxDetails(sandboxlistDataXmlDoc, importParameters);

            console.log(` Sandbox ID: ${importParameters.SandboxId} \n Sandbox Name : ${importParameters.SandboxName} \n End Obtaining Sandbox Info`);
        } catch (error) {
            this.commonHelper.handleError(error, "Error occurred while obtaining sandbox information", this.failBuildIfFlawImporterBuildStepFails);
        }
    }

    /**
     * Retrieve BuildInfo from veracode platform*
     * @param {Facilitator.FlawImporterParametersDto} importParameters - All parameters required to call Wrapper Methods.
     * @param {string} appID - application ID
     * @param {string} buildId - Build Id of the scan.
     * @return {Facilitator.ScanDto} - Scan details
     */
    public async getBuildDetailsbyId(
        importParameters: Facilitator.FlawImporterParametersDto,
        scanDetails: Facilitator.ScanDto,
        buildId: string): Promise<Facilitator.ScanDto> {
        core.debug("Class Name: VeracodeBridge, Method Name: getBuildDetailsbyId");

        try {
            let currentScanDetails = new Facilitator.ScanDto();
            console.log("Start Obtaining Build Info");
            const args = [
                '-jar',
                importParameters.VeracodeAPIWrapper,
                '-action',
                importParameters.ApiAction,
                '-appid',
                scanDetails.Appid,
                '-buildid',
                buildId
            ];
            if (importParameters.SandboxId) {
                args.push('-sandboxid');
                args.push(importParameters.SandboxId);
            }
            if (importParameters.IsDebugEnabled) {
                args.push('-debug');
                args.push(Facilitator.Constants.status_True_LowerCase);
            }
            args.push('-useragent');
            args.push(this.getDefaultUserAgentHeaderValue());
            const buildDetails = await this.executeJavaCommand(args);
            if (buildDetails.stderr.length > 0) {
                core.debug("Following Messages Received While Obtaining Build Details");
                core.debug(buildDetails.stderr);
            }
            if (buildDetails.error) {
                core.debug(`Error Name: ${buildDetails.error.name}`);
                core.debug(`Error Message: ${buildDetails.error.message}`);
                core.debug(`Error Stack: ${buildDetails.error.stack}`);
                return currentScanDetails;
            }

            // obtain result object and map details to dto
            let xmlDoc: XMLDocument;
            let parser = new xmlDom();
            xmlDoc = parser.parseFromString(buildDetails.stdout, 'text/xml');
            let elementAU = xmlDoc.getElementsByTagName('analysis_unit')[0];
            currentScanDetails.BuildStatus = elementAU.getAttribute('status');
            currentScanDetails.AnalysisType = elementAU.getAttribute('analysis_type');
            currentScanDetails.PublishedDate = elementAU.getAttribute('published_date');
            let elementBuild = xmlDoc.getElementsByTagName('build')[0];
            currentScanDetails.BuildId = elementBuild.getAttribute('build_id');
            let elementBuildInfo = xmlDoc.getElementsByTagName('buildinfo')[0];
            currentScanDetails.AccountID = elementBuildInfo.getAttribute('account_id');

            currentScanDetails.Appid = scanDetails.Appid;
            currentScanDetails.ResultPageURL = `${Facilitator.Constants.request_Prefix}${scanDetails.AnalysisCenterUrl}${Facilitator.Constants.veracodePlatformResultPage_Infix}${currentScanDetails.AccountID}:${currentScanDetails.Appid}:${currentScanDetails.BuildId}`;

            console.log(`Build ID: ${currentScanDetails.BuildId}`);
            console.log("End Obtaining Build Info");
            return currentScanDetails;
        } catch (error) {
            this.commonHelper.handleError(error, "Error occurred while obtaining build information", this.failBuildIfFlawImporterBuildStepFails);
            return new Facilitator.ScanDto();
        }
    }

    /**
     * Download detail report data to defined location , 
     * read data in it and send back 
     * @param {string} buildID - build which we reprecent detail report
     * @param {Facilitator.FlawImporterParametersDto} importerParameters - All parameters required to call Wrapper Methods.
     */
    public async downloadAndReadDetailedReportData(
        buildID: string,
        importParameters: Facilitator.FlawImporterParametersDto): Promise<string> {
        core.debug("Class Name: VeracodeBridge, Method Name: downloadAndReadDetailedReportData");

        try {
            console.log("Started retrieving detailed flaw data");
            let folderLocation: string = Facilitator.Constants.detailedReportFolderLocation;
            let fullPath: string = path.join(folderLocation, Facilitator.Constants.detailedReportFileName);
            fs.mkdirSync(folderLocation, { recursive: true });
            const args = [
                '-jar',
                importParameters.VeracodeAPIWrapper,
                '-action',
                importParameters.ApiAction,
                '-buildid',
                buildID,
                '-outputfilepath',
                fullPath
            ];
            if (importParameters.SandboxId) {
                args.push('-sandboxid');
                args.push(importParameters.SandboxId);
            }
            if (importParameters.IsDebugEnabled) {
                args.push('-debug');
                args.push(Facilitator.Constants.status_True_LowerCase);
            }
            args.push('-useragent');
            args.push(this.getDefaultUserAgentHeaderValue());
            const detailedReportResult = await this.executeJavaCommand(args);

            if (detailedReportResult.stderr.length > 0) {
                core.debug("Following messages received while downloading report from Analysiscenter");
                core.debug(detailedReportResult.stderr);
                if (detailedReportResult.stderr.includes(Facilitator.Constants.ServerReturnedHTTPResponseCode524)) {
                    this.commonHelper.handleError(null, Facilitator.Constants.ServerReturnedHTTPResponseCode524, this.failBuildIfFlawImporterBuildStepFails);
                }
            }
            if (detailedReportResult.error) {
                core.debug(`Error Name : ${detailedReportResult.error.name}`);
                core.debug(`Error Message : ${detailedReportResult.error.message}`);
                core.debug(`Error Stack : ${detailedReportResult.error.stack}`);
                this.commonHelper.handleError(null, "Obtaining detailed flaw details failed", this.failBuildIfFlawImporterBuildStepFails);
            }
            // Read file and obtain data as string
            try {
                const data = fs.readFileSync(fullPath, 'utf8');
                console.log('Successfully retrieved detailed flaw details');
                return data;
            } catch (err) {
                console.log(`Error: ${err}`);
                this.commonHelper.handleError(null, "Obtaining detailed flaw details failed", this.failBuildIfFlawImporterBuildStepFails);
                throw err;
            }
        } catch (ex) {
            throw ex;
        }
    }

    /**
     * Get Analysis center URL based on provided credentials
     * @param {Facilitator.ScanParametersDto} importerParameters - All parameters required to call Wrapper Methods.
     * @return {string} - Send Analysis center URL
     */
    public async getAnalysisCenterUrl(
        importerParameters: Facilitator.FlawImporterParametersDto): Promise<string> {

        core.debug("Class Name: VeracodeBridge, Method Name: getAnalysisCenterUrl");
        try {
            console.log("Start obtaining region details");
            const args = [
                '-jar',
                importerParameters.VeracodeAPIWrapper,
                '-action',
                Facilitator.Constants.apiAction_GetRegion
            ];
            if (importerParameters.IsDebugEnabled) {
                args.push('-debug');
                args.push(Facilitator.Constants.status_True_LowerCase);
            }
            args.push('-useragent');
            args.push(this.getDefaultUserAgentHeaderValue());
            const regionData = await this.executeJavaCommand(args);
            if (regionData.stderr.length > 0) {
                core.debug("Following messages received while trying to get Analysis Center URL");
                core.debug(regionData.stderr);
            }
            if (regionData.error) {
                console.log("Get Analysis Center URL Failed");
                core.debug(`Error Name: ${regionData.error.name}`);
                core.debug(`Error Message: ${regionData.error.message}`);
                core.debug(`Error Stack: ${regionData.error.stack}`);
                return Facilitator.Constants.string_Empty;
            }
            // obtain result string
            let platformUrl: any;
            if (importerParameters.IsDebugEnabled) {
                let jsonStart = regionData.stdout.indexOf("{");
                let jsonEnd = regionData.stdout.indexOf("}");
                platformUrl = JSON.parse(regionData.stdout.substring(jsonStart, jsonEnd + 1));
            } else {
                platformUrl = JSON.parse(regionData.stdout);
            }
            console.log(`Platform URL is: ${platformUrl.xmlApiHost}`);
            return platformUrl.xmlApiHost || '';
        } catch (error) {
            this.commonHelper.handleError(error, "Error occurred while obtaining platform URL", this.failBuildIfFlawImporterBuildStepFails);
            return '';
        }
    }

    /**
     * Obtain latest scan details of policy or sandbox scan
     * @param scanDetails - Scan details
     * @param importParameters - User imputs
     * @returns - Latest scan details
     */
    public async getLatestBuild(scanDetails: Facilitator.ScanDto, importParameters: Facilitator.FlawImporterParametersDto): Promise<Facilitator.ScanDto> {
        if (!importParameters.SandboxName) {
            return await this.getLatestPolicyScanDetailsByApplicationId(scanDetails, importParameters);
        } else {
            return await this.getLatestSandboxScanDetails(scanDetails, importParameters);
        }
    }

    //--End Public methods--//

    //-- Private methods--//

    /**
     * Get latest scan details of given sandbox
     * @param scanDetails - Scan details
     * @param importerParameters - User inputs
     * @returns - Latest scan details of given sandbox
     */
    private async getLatestSandboxScanDetails(scanDetails: Facilitator.ScanDto, importerParameters: Facilitator.FlawImporterParametersDto): Promise<Facilitator.ScanDto> {
        core.debug("Class Name: VeracodeBridge, Method Name: getLatestSandboxScanDetails");

        try {

            console.log("Start obtaining build list");
            importerParameters.ApiAction = Facilitator.Constants.apiAction_GetBuildList;
            const args = [
                '-jar',
                importerParameters.VeracodeAPIWrapper,
                '-action',
                importerParameters.ApiAction,
                '-appid',
                scanDetails.Appid
            ];
            if (importerParameters.SandboxId) {
                args.push('-sandboxid');
                args.push(importerParameters.SandboxId);
            }
            if (importerParameters.IsDebugEnabled) {
                args.push('-debug');
                args.push(Facilitator.Constants.status_True_LowerCase);
            }
            args.push('-useragent');
            args.push(this.getDefaultUserAgentHeaderValue());
            const buildListData = await this.executeJavaCommand(args);
            if (buildListData.stderr.length > 0) {
                core.debug("Following messages received while obtaining build list");
                core.debug(buildListData.stderr);
            }
            if (buildListData.error) {
                core.debug(`Error Name: ${buildListData.error.name}`);
                core.debug(`Error Message: ${buildListData.error.message}`);
                core.debug(`Error Stack: ${buildListData.error.stack}`);
                this.commonHelper.handleError(null, "Obtaining build list failed.", this.failBuildIfFlawImporterBuildStepFails);
            }

            // obtain result object and map details to string list
            let buildIdList: string[] = [];
            let scanlistDataXmlDoc: XMLDocument;
            let buildlistParser = new xmlDom();
            let buildlist = new Array<Facilitator.ScanDto>();
            scanlistDataXmlDoc = buildlistParser.parseFromString(buildListData.stdout, 'text/xml');

            this.extractFullBuildIdListFromXMLDocument(buildIdList, scanlistDataXmlDoc);
            // populated build info list
            for (const buildId of buildIdList) {
                console.log(`Obtaining details related to build ID: ${buildId}`);
                importerParameters.ApiAction = Facilitator.Constants.apiAction_GetBuildInfo;
                let scanData = await this.getBuildDetailsbyId(importerParameters, scanDetails, buildId);
                buildlist.push(scanData);
            }
            console.log("End obtaining build list");

            return this.obtainLatestBuildoutofBuildList(buildlist);
        } catch (error) {
            this.commonHelper.handleError(error, "Error occurred during manipulating build list", this.failBuildIfFlawImporterBuildStepFails);
            return new Facilitator.ScanDto();
        }
    }

    /**
     * Extract build Ids from XML document
     * @param buildIdList build Id list
     * @param scanlistDataXmlDoc build list XML data
     * @returns list of build Ids
     */
    private extractFullBuildIdListFromXMLDocument(buildIdList: string[], scanlistDataXmlDoc: XMLDocument) {
        core.debug("Class Name: VeracodeBridge, Method Name: getFullBuildList");

        try {
            let buildlistElements = scanlistDataXmlDoc.getElementsByTagName('build');
            let listNumber = 0;
            for (let i = buildlistElements.length; i > 0; i--) {
                buildIdList[listNumber] = buildlistElements[i - 1].getAttribute('build_id');
                listNumber++;
            }
            core.debug("buildList :" + buildIdList);
            return buildIdList;

        } catch (error) {
            this.commonHelper.handleError(error, "Error occurred while mapping build information", this.failBuildIfFlawImporterBuildStepFails);
        }
    }

    /**
     * Retrieve all Build ids in Application according to provided Applid from veracode platform 
     * @param {Facilitator.ScanDto} scanDetails - scan details.
     * @param {Facilitator.FlawImporterParametersDto} importerParameters - All parameters required to call Wrapper Methods.
     * @return {Facilitator.ScanDto} -  details of latest scan
     */
    private async getLatestPolicyScanDetailsByApplicationId(scanDetails: Facilitator.ScanDto,
        importerParameters: Facilitator.FlawImporterParametersDto): Promise<Facilitator.ScanDto> {

        core.debug("Class Name: VeracodeBridge, Method Name: getLatestScanDetailsByApplicationId");

        try {

            console.log("Start obtaining latest build");
            importerParameters.ApiAction = Facilitator.Constants.apiAction_GetApplist;
            const args = [
                '-jar',
                importerParameters.VeracodeAPIWrapper,
                '-action',
                importerParameters.ApiAction,
                '-rest',
                '-appid',
                scanDetails.Appid
            ];
            if (importerParameters.IsDebugEnabled) {
                args.push('-debug');
                args.push(Facilitator.Constants.status_True_LowerCase);
            }
            args.push('-useragent');
            args.push(this.getDefaultUserAgentHeaderValue());
            const applicationScanData = await this.executeJavaCommand(args);
            if (applicationScanData.stderr.length > 0) {
                core.debug("Following messages received while obtaining application scan details");
                core.debug(applicationScanData.stderr);
            }
            if (applicationScanData.error) {
                core.debug(`Error Name: ${applicationScanData.error.name}`);
                core.debug(`Error Message: ${applicationScanData.error.message}`);
                core.debug(`Error Stack: ${applicationScanData.error.stack}`);
                this.commonHelper.handleError(null, "Obtaining application scan details failed.", this.failBuildIfFlawImporterBuildStepFails);
            }

            let appScanObj: any;
            if (importerParameters.IsDebugEnabled) {
                let jsonStart = applicationScanData.stdout.indexOf("[{");
                let jsonEnd = applicationScanData.stdout.lastIndexOf("}]");
                appScanObj = JSON.parse(applicationScanData.stdout.substring(jsonStart, jsonEnd + 2));
            } else {
                appScanObj = JSON.parse(applicationScanData.stdout);
            }

            let buildIdList: string[] = [];
            let buildlist = new Array<Facilitator.ScanDto>();

            this.getLatestBuildIdList(buildIdList, appScanObj[0]);
            // populated build info list
            for (const buildId of buildIdList) {
                console.log(`Obtaining details related to build ID: ${buildId}`);
                importerParameters.ApiAction = Facilitator.Constants.apiAction_GetBuildInfo;
                let scanData = await this.getBuildDetailsbyId(importerParameters, scanDetails, buildId);
                buildlist.push(scanData);
            }

            return this.obtainLatestBuildoutofBuildList(buildlist);
        } catch (error) {
            this.commonHelper.handleError(error, "Obtaining application scan details failed.", this.failBuildIfFlawImporterBuildStepFails);
            return new Facilitator.ScanDto();
        }
    }

    /**
     * Select latest Build by published date and build status ("result ready"")
     * @param {string[]} buildList - Builds data of all the builds in scan
     * @return {Facilitator.ScanDto} - Latest build in result ready status
     */
    private obtainLatestBuildoutofBuildList(
        buildlist: Array<Facilitator.ScanDto>): Facilitator.ScanDto {
        core.debug("Class Name: VeracodeBridge, Method Name: obtainLatestBuildoutofBuildList");

        let latestScan: Facilitator.ScanDto = new Facilitator.ScanDto();
        try {

            console.log("Start filtering the latest build");
            buildlist = buildlist.filter(e => e.BuildStatus == Facilitator.Constants.BuildStatus_resultsready);
            console.log(`Total latest scans: ${buildlist.length}`);

            //Sort by the publish date descending
            buildlist.sort(function (x, y) {
                let dateOne = new Date(x.PublishedDate).getTime();
                let dateTwo = new Date(y.PublishedDate).getTime();
                return dateOne > dateTwo ? -1 : dateOne < dateTwo ? 1 : 0;
            });

            console.log("Listing down the sorted and result ready build list");
            buildlist.forEach(element => {
                console.log(`Build: ${element.BuildId} Published date: ${new Date(element.PublishedDate).getTime()} Build status: ${element.BuildStatus} Analysis type: ${element.AnalysisType}`);
            });

            if (null != buildlist && buildlist.length > 0) {
                latestScan = buildlist[0];
            }

            if (!latestScan || !latestScan.BuildId) {
                console.info("For Current Application, There is no Builds Found in Result Ready Status");
            } else {
                console.log(`Build ID in 'Result Ready' Status with Latest Published Date : ${latestScan.BuildId}`);
                console.log("End Filtering the Latest Build");
            }
            return latestScan;
        } catch (error) {
            this.commonHelper.handleError(error, "Error occurred while trying to filter latest build", this.failBuildIfFlawImporterBuildStepFails);
            return latestScan;
        }
    }

    /**
     * Get list of build ids
     * @param {string[]} buildList - Build ids
     * @param {any} appScanObj  - latest scan details of the application
     * @return {string[]} - Build Ids
     */
    private getLatestBuildIdList(
        buildList: string[],
        appScanObj: any): string[] {
        core.debug("Class Name: VeracodeBridge, Method Name: getLatestBuildIdList");

        try {

            for (let index = 0; index < appScanObj.scans.length; index++) {
                buildList[index] = appScanObj.scans[index].scan_url.split(":")[3];
            }
            core.debug("buildList :" + buildList);
            return buildList;

        } catch (error) {
            this.commonHelper.handleError(error, "Error occurred while mapping build information", this.failBuildIfFlawImporterBuildStepFails);
            return buildList;
        }
    }

    /**
     * Provide metadata about the task
     */
    private getDefaultUserAgentHeaderValue(): string {
        core.debug("Class Name: VeracodeBridge, Method Name: getDefaultUserAgentHeaderValue");

        let nodeVersion: string = process.version;
        if (nodeVersion == null || nodeVersion == "") {
            nodeVersion = Facilitator.Constants.usermetadata_Unknown;
        }
        return `${Facilitator.Constants.usermetadata_Name}/${Facilitator.Constants.usermetadata_ExtensionVersion} (Node/${nodeVersion})`;
    }

    private displayPlatformConnectivityIssueMessage() {
        console.log(
            "Verify that:\n" +
            "   1.The login credentials are correct\n" +
            "   2.The account is an API account with the necessary permissions.\n" +
            "   3.The account is not locked.\n" +
            "   4.The IP address of the Internet-facing machine is not restricted.\n" +
            "   5.The VSO agent has the necessary permissions.\n" +
            "   6.The port that the VSO agent uses is not restricted.");
    }

    /**
     * Retrieve application details from xml file
     * @param {xmlDocument} xml - XML document consist of application details
     * @param {Facilitator.ScanDto} scanDetails - Consists of details required to obtain application information.
     * @param {Facilitator.FlawImporterParametersDto} importerParametersDto - All parameters required to call Wrapper Methods.
     */
    private retrieveApplicationDetails(
        xml: XMLDocument,
        importerParameters: Facilitator.FlawImporterParametersDto,
        scanDetails: Facilitator.ScanDto) {
        core.debug("Class Name : VeracodeBridge , Method Name : retrieveApplicationDetails");

        try {
            let applistElements = xml.getElementsByTagName('app');
            for (var i = 0; i < applistElements.length; i++) {
                if (importerParameters.VeracodeAppProfile == applistElements[i].getAttribute('app_name')) {
                    scanDetails.AppName = applistElements[i].getAttribute('app_name');
                    scanDetails.Appid = applistElements[i].getAttribute('app_id');
                    break;
                }
            }
            core.debug(`scanDetails.AppName: ${scanDetails.AppName}`);
            core.debug(`scanDetails.Appid: ${scanDetails.Appid}`);
        } catch (error) {
            this.commonHelper.handleError(error, "Error occurred while mapping application information", this.failBuildIfFlawImporterBuildStepFails);
        }
    }

    /**
    * Retrieve Sandbox details from xml file
    * @param {xmlDocument} xml - XML document consist of Sandbox details
    * @param {Facilitator.FlawImporterParametersDto}importerParametersDto - All parameters required to call Wrapper Methods.
    */
    private retrieveSandboxDetails(
        xml: XMLDocument,
        importerParameters: Facilitator.FlawImporterParametersDto) {
        core.debug("Class Name: VeracodeBridge, Method Name: retrieveSandboxDetails");

        try {
            let sandboxId: string = "";
            let sandboxlistElements = xml.getElementsByTagName('sandbox');
            for (var i = 0; i < sandboxlistElements.length; i++) {
                if (importerParameters.SandboxName == sandboxlistElements[i].getAttribute('sandbox_name')) {
                    sandboxId = sandboxlistElements[i].getAttribute('sandbox_id') || "";
                    break;
                }
            }
            if (sandboxId) {
                importerParameters.SandboxId = sandboxId;
            } else {
                console.log("Please recheck sandbox name");
            }
        } catch (error) {
            this.commonHelper.handleError(error, "Error occurred while mapping sandbox information", this.failBuildIfFlawImporterBuildStepFails);
        }
    }

    /**
     * Generates proxy variable string
     * @param importParameters - user entered parameters 
     * @returns proxy variable string
     */
    private generateProxyString(importParameters: Facilitator.FlawImporterParametersDto): string {

        core.debug("Class Name: VeracodeBridge, Method Name: generateProxyString");
        if (importParameters.Puser && importParameters.Ppassword) {
            core.debug("Proxy user, password, host and port idntified");
            return `${encodeURIComponent(importParameters.Puser)}:${encodeURIComponent(importParameters.Ppassword)}@${importParameters.Phost}:${importParameters.Pport}`;
        } else {
            core.debug("Proxy host and port idntified");
            return `${importParameters.Phost}:${importParameters.Pport}`;
        }
    }
    //--End Private methods--//
}