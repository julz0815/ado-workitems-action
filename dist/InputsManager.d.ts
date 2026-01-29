/*******************************************************************************
* Copyright (c) 2017 Veracode, Inc. All rights observed.
*
* Available for use by Veracode customers as described in the accompanying license agreement.
*
* Send bug reports or enhancement requests to support@veracode.com.
*
* See the license agreement for conditions on submitted materials.
******************************************************************************/
import * as commonData from './Common';
export declare class InputsManager {
    commonHelper: commonData.CommonHelper;
    constructor();
    retrieveInputs(): commonData.FlawImporterParametersDto;
    private setCustomFields;
    private adjustOptionalArguments;
    private validateEmptyInputBoxes;
}
//# sourceMappingURL=InputsManager.d.ts.map