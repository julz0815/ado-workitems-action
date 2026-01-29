"use strict";
/*******************************************************************************
* Copyright (c) 2017 Veracode, Inc. All rights observed.
*
* Available for use by Veracode customers as described in the accompanying license agreement.
*
* Send bug reports or enhancement requests to support@veracode.com.
*
* See the license agreement for conditions on submitted materials.
******************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cleanser = void 0;
class Cleanser {
    /**
     * Cleanse the tainted text passing from Logs
     * @param {any} taintedText - Tainted text.
     * @returns {string} - returning the cleansed text
     */
    getCleansedText(taintedText) {
        if (taintedText == null) {
            return "";
        }
        var cleansedText = String(taintedText);
        cleansedText = cleansedText.replace("\n", "\\n");
        cleansedText = cleansedText.replace("\r", "\\r");
        cleansedText = cleansedText.replace("%0D", "%250D");
        cleansedText = cleansedText.replace("%0A", "%250A");
        cleansedText = cleansedText.replace("%0d", "%250d");
        cleansedText = cleansedText.replace("%0a", "%250a");
        return cleansedText;
    }
}
exports.Cleanser = Cleanser;
//# sourceMappingURL=EscapeTextUtility.js.map