import * as CommonData from './Common';
type XMLDocument = any;
/**
 * Extracting SCA data and composing work item data
 */
export declare class SCAFlawManager {
    private commonHelper;
    constructor();
    /**
     * Obtains SCA flaw data
     * @param xmlDoc - Flaw data
     * @param workItemDetails - WorkItem details
     * @param importerParameters - import parameters
     */
    captureSCAFlawData(xmlDoc: XMLDocument, workItemDetails: CommonData.workItemsDataDto, importParameters: CommonData.FlawImporterParametersDto, scanDetails: CommonData.ScanDto): void;
    /**
     * Filter vulnerability from detailed report by flaw type and preapare flaws for work item creation
     * @param vulnerableComponentsList Vulnerability component list
     * @param vulnerabilityIndex Current vulnerability index
     * @param importParameters User inputs
     * @param scanDetails Veracode scan details
     * @param workItemDetails Work item creation data
     */
    private filterVulnerabilityByFlawTypeAndAssignForWorkItemCreation;
    /**
     * Extract and map vulnerabledata to dto
     * @param vulnerabilityItem - vulnerablity data
     * @param vulnerableComponent - vulnerable component data
     */
    private populateVulnerabilities;
    /**
     * Extract and map component data to dto
     * @param elementComponentItem - component data
     * @returns Vulnerablity component data
     */
    private populateComponentData;
    /**
     * Extract and map file paths to dto
     * @param filePathsNode - extracted file path node from the detailed report
     * @param filePathsList - file path list in the dto, uses to store file paths
     */
    private populateComponentFilePaths;
    /**
     * Converts severity number to string
     * @param severity - severity number
     * @returns severity as a string
     */
    private getSeverityAsString;
    /**
     * Arrange and map vulnerable data in to workitem data
     * @param vulnerableComponent - Vulnerable data
     * @param vulnerability - vulnerability data
     * @param importParameters - import parameters
     * @returns Workitem data
     */
    private vulnerabilityToWorkItem;
    /**
     * Adds tags to the work item
     * @param workItem - work item data
     * @param importParameters - user inputs
     * @param scanDetails - scan details
     * @param cveId - CVE ID
     * @param buildVersion - scan name
     */
    private addTags;
    /**
     * Composes the work item body
     * @param vulnerability - vulnerability details
     * @param scanDetails - scan details
     * @param componentId - SCA component details
     * @returns - body of the work item
     */
    private generateWorkItemBody;
}
export {};
//# sourceMappingURL=SCAFlawManager.d.ts.map