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
import * as CommonData from './Common';

// XMLDocument type from xmldom library
type XMLDocument = any;
type HTMLCollectionOf<T> = any;
type Element = any;

/**
 * Extracting SCA data and composing work item data
 */
export class SCAFlawManager {

    private commonHelper: CommonData.CommonHelper;
    constructor() {
        this.commonHelper = new CommonData.CommonHelper();
    }

    /**
     * Obtains SCA flaw data
     * @param xmlDoc - Flaw data
     * @param workItemDetails - WorkItem details
     * @param importerParameters - import parameters
     */
    public captureSCAFlawData(xmlDoc: XMLDocument, workItemDetails: CommonData.workItemsDataDto, importParameters: CommonData.FlawImporterParametersDto, scanDetails: CommonData.ScanDto) {

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
     * Process SCA findings from Veracode API (JSON format) directly
     */
    public captureSCAFlawDataFromAPI(
        findingsData: any,
        workItemDetails: CommonData.workItemsDataDto,
        importParameters: CommonData.FlawImporterParametersDto,
        scanDetails: CommonData.ScanDto
    ): void {
        core.debug("Class Name: SCAFlawManager, Method Name: captureSCAFlawDataFromAPI");
        
        const findings = findingsData._embedded?.findings || [];
        console.log(`***Processing ${findings.length} SCA findings from API***`);
        
        // Group findings by component (using component_filename as the key)
        const componentsMap: Map<string, any[]> = new Map();
        
        for (const finding of findings) {
            // Use component_filename as the key to group findings by component
            const componentKey = finding.finding_details?.component_filename || 'unknown';
            if (!componentsMap.has(componentKey)) {
                componentsMap.set(componentKey, []);
            }
            componentsMap.get(componentKey)!.push(finding);
        }
        
        // Process each component
        for (const [componentKey, componentFindings] of componentsMap.entries()) {
            const vulnerableComponent = this.populateComponentDataFromAPI({}, componentFindings);
            
            if (vulnerableComponent && vulnerableComponent.Vulnerabilities.length > 0) {
                console.log(`Vulnerabilities count: ${vulnerableComponent.Vulnerabilities.length}`);
                // Match vulnerabilities with their raw findings
                for (let i = 0; i < vulnerableComponent.Vulnerabilities.length; i++) {
                    const vulnerability = vulnerableComponent.Vulnerabilities[i];
                    const rawFinding = componentFindings[i]; // Get corresponding raw finding
                    
                    let flawData = new CommonData.FlawDto();
                    if (vulnerability.IsMitigation) {
                        flawData.MitigationStatus = CommonData.Constants.mitigation_Status_Accepted;
                    } else {
                        flawData.MitigationStatus = CommonData.Constants.mitigation_Status_None;
                    }
                    flawData.FlawAffectedbyPolicy = vulnerability.DoesAffectPolicy;
                    vulnerability.FilePathList = vulnerableComponent.FilePathsList;
                    
                    // Create work item with annotations from raw finding
                    const workItem = this.vulnerabilityToWorkItem(vulnerableComponent, vulnerability, importParameters, scanDetails, workItemDetails.BuildVersion);
                    
                    // Store annotations and resolution status for mitigation handling
                    if (rawFinding) {
                        workItem.Annotations = rawFinding.annotations || [];
                        workItem.ResolutionStatus = rawFinding.finding_status?.resolution_status || '';
                    }
                    
                    this.commonHelper.filterWorkItemsByFlawType(
                        flawData,
                        workItem,
                        workItemDetails,
                        importParameters
                    );
                }
            }
        }
    }

    /**
     * Populate component data from API findings
     */
    private populateComponentDataFromAPI(component: any, vulnerabilities: any[]): CommonData.VulnerableComponentDetailedReportDto {
        core.debug("Class Name: SCAFlawManager, Method Name: populateComponentDataFromAPI");
        
        const vulnerableComponent = new CommonData.VulnerableComponentDetailedReportDto();
        
        // Get component info from the first vulnerability's finding_details
        // The API structure has component info in finding_details, not a separate component object
        if (vulnerabilities.length > 0) {
            const firstFinding = vulnerabilities[0];
            const details = firstFinding.finding_details || {};
            
            // Component filename is the library/component name
            vulnerableComponent.Library = details.component_filename || '';
            vulnerableComponent.ComponentId = details.component_id || '';
            vulnerableComponent.Version = details.version || '';
            
            // Extract file paths from component_path
            vulnerableComponent.FilePathsList = details.component_path || [];
        } else {
            // Fallback if no vulnerabilities
            vulnerableComponent.Library = '';
            vulnerableComponent.ComponentId = '';
            vulnerableComponent.Version = '';
            vulnerableComponent.FilePathsList = [];
        }
        
        // Convert vulnerabilities
        vulnerableComponent.Vulnerabilities = [];
        for (const vuln of vulnerabilities) {
            const vulnerability = this.convertVulnerabilityFromAPI(vuln);
            vulnerableComponent.Vulnerabilities.push(vulnerability);
        }
        
        return vulnerableComponent;
    }

    /**
     * Convert API vulnerability JSON to ComponentVulnerability
     */
    private convertVulnerabilityFromAPI(vulnerability: any): CommonData.ComponentVulnerability {
        const details = vulnerability.finding_details || {};
        const status = vulnerability.finding_status || {};
        
        const vuln = new CommonData.ComponentVulnerability();
        // CVE is an object with a 'name' property
        vuln.CveId = details.cve?.name || '';
        vuln.CveSummary = vulnerability.description || '';
        vuln.CweId = details.cwe?.id?.toString() || '';
        // Severity can be from cve.severity or finding_details.severity
        vuln.Severity = details.cve?.severity?.toString() || details.severity?.toString() || '5';
        vuln.FirstFoundDate = status.first_found_date || '';
        vuln.DoesAffectPolicy = vulnerability.violates_policy || false;
        
        // Determine if mitigated based on annotations
        vuln.IsMitigation = false;
        vuln.MitigationType = '';
        if (vulnerability.annotations && vulnerability.annotations.length > 0) {
            const sortedAnnotations = vulnerability.annotations.sort((a: any, b: any) => 
                new Date(b.created).getTime() - new Date(a.created).getTime()
            );
            const latestAnnotation = sortedAnnotations[0];
            if (latestAnnotation.action === 'APPROVED') {
                vuln.IsMitigation = true;
                vuln.MitigationType = latestAnnotation.action;
            }
        }
        
        if (vuln.IsMitigation) {
            vuln.MitigationCommentOnFlawClosure = `${CommonData.Constants.SCAMitigationCommentPrefix} ${vuln.MitigationType}`;
        } else {
            vuln.MitigationCommentOnFlawClosure = "";
        }
        
        return vuln;
    }

    /**
     * Filter vulnerability from detailed report by flaw type and preapare flaws for work item creation
     * @param vulnerableComponentsList Vulnerability component list
     * @param vulnerabilityIndex Current vulnerability index
     * @param importParameters User inputs
     * @param scanDetails Veracode scan details
     * @param workItemDetails Work item creation data
     */
    private filterVulnerabilityByFlawTypeAndAssignForWorkItemCreation(vulnerableComponentsList: HTMLCollectionOf<Element>, vulnerabilityIndex: number, importParameters: CommonData.FlawImporterParametersDto, scanDetails: CommonData.ScanDto, workItemDetails: CommonData.workItemsDataDto) {

        core.debug("Class Name: SCAFlawManager, Method Name: filterVulnerabilityByFlawTypeAndAssignForWorkItemCreation");
        let vulnerableComponent = this.populateComponentData(vulnerableComponentsList[vulnerabilityIndex]);
        if (vulnerableComponent != null && vulnerableComponent.Vulnerabilities != null && vulnerableComponent.Vulnerabilities.length > 0) {
            console.log(`Vulnerabilities count: ${vulnerableComponent.Vulnerabilities.length}`);
            vulnerableComponent.Vulnerabilities.forEach(vulnerability => {
                let flawData = new CommonData.FlawDto();
                if (vulnerability.IsMitigation) {
                    flawData.MitigationStatus = CommonData.Constants.mitigation_Status_Accepted;
                } else {
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
    private populateVulnerabilities(
        vulnerabilityItem: any,
        vulnerableComponent: CommonData.VulnerableComponentDetailedReportDto) {

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
                } else {
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
    private populateComponentData(
        elementComponentItem: any): CommonData.VulnerableComponentDetailedReportDto {

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
    private populateComponentFilePaths(filePathsNode: any, filePathsList: Array<string>) {

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
    private getSeverityAsString(
        severity: number): string {

        core.debug("Class Name: SCAFlawManager, Method Name: getSeverityAsString");
        if (severity >= 5) {
            return CommonData.Constants.bug_severity_Critical;
        } else if (severity == 4) {
            return CommonData.Constants.bug_severity_High;
        } else if (severity == 3) {
            return CommonData.Constants.bug_severity_Medium;
        } else {
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
    private vulnerabilityToWorkItem(
        vulnerableComponent: CommonData.VulnerableComponentDetailedReportDto,
        vulnerability: CommonData.ComponentVulnerability,
        importParameters: CommonData.FlawImporterParametersDto,
        scanDetails: CommonData.ScanDto,
        buildVersion: string): CommonData.WorkItemDto {

        core.debug("Class Name: SCAFlawManager, Method Name: vulnerabilityToWorkItem");
        let workItem = new CommonData.WorkItemDto();
        
        // Ensure all values are strings to avoid "[object Object]" in title
        const library = String(vulnerableComponent.Library || '').trim();
        const version = String(vulnerableComponent.Version || '').trim();
        const cveId = String(vulnerability.CveId || '').trim();
        const appProfile = String(importParameters.VeracodeAppProfile || '').trim();
        
        workItem.Title = `Component: ${library}${version ? '-' + version : ''} has CVE Vulnerability ${cveId || 'Unknown'} detected in Application: ${appProfile}`;
        workItem.Html = this.generateWorkItemBody(vulnerability, scanDetails, vulnerableComponent.ComponentId);
        
        // Ensure severity is always set - default to 5 (Critical) if not available
        let severity = Number(vulnerability.Severity);
        if (isNaN(severity) || severity < 0 || severity > 5) {
            severity = 5; // Default to Critical if invalid
        }
        workItem.SeverityValue = this.getSeverityAsString(severity);
        workItem.Severity = severity;
        workItem.IsOpenAccordingtoMitigationStatus = !vulnerability.IsMitigation;
        workItem.AffectedbyPolicy = vulnerability.DoesAffectPolicy;
        workItem.FlawComments = vulnerability.MitigationCommentOnFlawClosure;
        if (workItem.IsOpenAccordingtoMitigationStatus) {
            workItem.FlawStatus = CommonData.Constants.remediation_status_Open;
        } else {
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
    private addTags(workItem: CommonData.WorkItemDto, importParameters: CommonData.FlawImporterParametersDto, scanDetails: CommonData.ScanDto, cveId: string, buildVersion: string) {
        
        core.debug("Class Name: SCAFlawManager, Method Name: addTags");
        //Add CVE As Tag - ensure it's a string
        if (importParameters.AddCveTag && cveId) {
            const cveTag = String(cveId).trim();
            if (cveTag) {
                core.debug(`Value for cve tag identified. Value is ${cveTag}`);
                workItem.Tags.push(cveTag);
            }
        }
        //Add Custom Tag
        if (importParameters.AddCustomTag) {
            const customTag = String(importParameters.AddCustomTag).trim();
            if (customTag) {
                core.debug(`Value for Custom tag identified. Value is ${customTag}`);
                workItem.Tags.push(customTag);
            }
        }
        //Add build Id as Tag - ensure BuildId is a string
        if (importParameters.FoundInBuild && scanDetails.BuildId) {
            const buildTag = `Build_${String(scanDetails.BuildId)}`;
            core.debug(`Value for build is tag identified. Value is ${buildTag}`);
            workItem.Tags.push(buildTag);
        }
        //Add scan name as Tag
        if (importParameters.AddScanNameAsATag && buildVersion) {
            const scanTag = String(buildVersion).trim();
            if (scanTag) {
                core.debug(`Value for scan name tag identified. Value is ${scanTag}`);
                workItem.Tags.push(scanTag);
            }
        }
        //Scan Type as Tag
        if (importParameters.ScanTypeTag) {
            core.debug(`Value for scan type tag identified. Value is SCA`);
            workItem.Tags.push("SCA");
        }
        //Severity as Tag - ensure SeverityValue is a string
        if (importParameters.SeverityTag && workItem.SeverityValue) {
            const severityTag = String(workItem.SeverityValue).trim();
            if (severityTag) {
                core.debug(`Value for severity tag identified. Value is ${severityTag}`);
                workItem.Tags.push(severityTag);
            }
        }
    }

    /**
     * Composes the work item body
     * @param vulnerability - vulnerability details
     * @param scanDetails - scan details
     * @param componentId - SCA component details
     * @returns - body of the work item
     */
    private generateWorkItemBody(vulnerability: CommonData.ComponentVulnerability, scanDetails: CommonData.ScanDto, componentId: string): string {

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