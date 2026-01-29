import * as CommonData from './Common';
type XMLDocument = any;
export declare class StaticAndDynamicFlawManager {
    private commonHelper;
    constructor();
    /**
    * Gererate workitem details from SAST and DAST flaw data
    * @param xmlDoc - Flaw data
    * @param workItemDetails - WorkItem details
    * @param scanDetails - Scan specific details
    * @param importParameters - user entered paraeters
    */
    captureDASTAndSASTFlawData(xmlDoc: XMLDocument, workItemDetails: CommonData.workItemsDataDto, scanDetails: CommonData.ScanDto, importParameters: CommonData.FlawImporterParametersDto): void;
    /**
     * Extract xml based severity data and map same to  DTO
     * @param {any} severityListItem - xml based severity data.
     * @param {CommonData.ScanDto} scanDetails - veracode scan related details.
     * @param {CommonData.FlawImporterParametersDto} importParameters - user provided parameters.
     * @param {CommonData.workItemsDataDto} workItemsCreationData - work Items generation data.
     * @return {CommonData.SeverityDetailedReportDto} - Mapped severity details .
     */
    private populateSeverityData;
    /**
     * Extract xml based cew data and map same to  DTO
     * @param {CommonData.CategoryDetailedReportDto} categoryDetails - Category Details.
     * @param {any} currentCategoryListItem - xml based category data.
     * @param {CommonData.SeverityDetailedReportDto} sevData - flaw severity related details.
     * @param {CommonData.ScanDto} scanDetails - veracode scan related details.
     * @param {CommonData.FlawImporterParametersDto} importParameters - user provided parameters.
     * @param {CommonData.workItemsDataDto} workItemsCreationData - work Items generation data.
     */
    private populateCategoryData;
    /**
     * Composes text from category recomandations
     * @param paraList Pragraphs
     * @param catRecomendation category recomandations
     * @returns String composed with category recomandations
     */
    private getRecommendationParagraphText;
    /**
     * composes text from decription
     * @param paraList Get pragraph text
     * @param catDescription - Category details
     * @returns pragraph text
     */
    private getMainParagraphText;
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
    private populateCweData;
    private populateDynamicFlawData;
    private populateStaticFlawData;
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
    private populateFlawData;
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
    private generateWorkItemData;
    /**
     * Obtain annotation data from flaw
     * @param flaw - flaw that contains annotation data
     * @param commentsList - flaw comments list
     */
    private populateFlawAnnotationData;
    /**
     * Obtain mitigation data from flaw
     * @param flaw - flaw that contains mitigation data
     * @param commentsList - flaw comments list
     */
    private populateFlawMitigationData;
    /**
     * Compose WorkItem comments based on flaw data
     * @param flawData - flaw data retrieved from detailed report
     */
    private composeWorkItemComments;
    /**
    *  Adjust WorkItem tags based on user inputs
    *  @param {CommonData.cweDto} cweData - veracode flaw CWE related data
    *  @param {CommonData.WorkItemDto} workItem - VSTS WorkItem related data
    *  @param {CommonData.ScanDto} scanDetails - Veracode Scan related data
    *  @param {CommonData.FlawImporterParametersDto} importParameters - inputs provided in VSTS UI
    *  @param  {CommonData.workItemsDataDto} workItemsCreationData - Contains data required for WorkItem creation
    *  @param  scanTypeAsTag - Scan type
    */
    private manipulateWorkItemTags;
    /**
     * Adjust Work Item by Flaw Type (Dynamic , Static)
     *  @param {CommonData.FlawDto} flawData - veracode flaw related data
     *  @param {CommonData.cweDto} cweData - veracode flaw CWE related data
     *  @param {CommonData.WorkItemDto} workItem - VSTS Work Item related data
     *  @param {CommonData.CategoryDetailedReportDto} catData - veracode flaw category related data
     *  @param {CommonData.ScanDto} scanDetails - Veracode Scan related data
     *  @param {CommonData.FlawImporterParametersDto} importParameters - inputs provided in VSTS UI
     */
    private adjustWorkItemDataByType;
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
    private generateWorkItemBody;
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
    private generateWorkItemTitle;
    /**
    * Compose and arrange flaw comments
    * @param flaw - flaw that contains annotation data
    */
    private populateFlawComments;
    /**
     * Format the due date
     * @param gracePeriodExpires - Grace period expire date
     * @returns - formatted date
     */
    private formatDueDate;
}
export {};
//# sourceMappingURL=StaticAndDynamicFlawManager.d.ts.map