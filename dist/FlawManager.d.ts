import * as q from 'q';
import * as CommonData from './Common';
import { StaticAndDynamicFlawManager } from './StaticAndDynamicFlawManager';
import { SCAFlawManager } from './SCAFlawManager';
/**
 * Arranging flaw data for work item creation
 * Extract data from detailedreport object and populate data in Work item object
 */
export declare class FlawManager {
    sCAFlawManager: SCAFlawManager | undefined;
    staticAndDynamicFlawManager: StaticAndDynamicFlawManager | undefined;
    manageFlaws(scanDetails: CommonData.ScanDto, importParameters: CommonData.FlawImporterParametersDto, reportDetails: string): q.Promise<CommonData.workItemsDataDto>;
    /**
     * Makes necessary adjustments to support SCA flaw importing
     * @param scanDetails - scan details
     * @param xmlDoc - detailed report data
     * @param importParameters - user inputs
     */
    private adjustSCAParameters;
}
//# sourceMappingURL=FlawManager.d.ts.map