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
import * as path from 'path';
import * as commonData from './Common';

export class InputsManager {
  commonHelper: commonData.CommonHelper;

  constructor() {
    this.commonHelper = new commonData.CommonHelper();
  }

  retrieveInputs(): commonData.FlawImporterParametersDto {
    const importerParameters = new commonData.FlawImporterParametersDto();
    try {
      importerParameters.IsValidationsSuccess = true;

      // Veracode API credentials
      importerParameters.VID = core.getInput('veracode-api-id', { required: true });
      importerParameters.VKey = core.getInput('veracode-api-key', { required: true });

      // Azure DevOps connection
      importerParameters.AdoToken = core.getInput('ado-token', { required: true });
      importerParameters.AdoOrg = core.getInput('ado-org', { required: true });
      importerParameters.AdoProject = core.getInput('ado-project', { required: true });
      
      // Work item state settings
      importerParameters.AdoOpenState = core.getInput('open-state', { required: false }) || 'New';
      importerParameters.AdoCloseState = core.getInput('close-state', { required: false }) || 'Closed';
      importerParameters.AdoReopenState = core.getInput('reopen-state', { required: false }) || 'New';
      core.info(`Open State: ${importerParameters.AdoOpenState}`);
      core.info(`Close State: ${importerParameters.AdoCloseState}`);
      core.info(`Reopen State: ${importerParameters.AdoReopenState}`);

      // Application details
      importerParameters.VeracodeAppProfile = core.getInput('veracode-app-profile', { required: true });
      core.info(`Application Name: ${importerParameters.VeracodeAppProfile}`);

      importerParameters.SandboxName = core.getInput('sandbox-name', { required: false });
      if (importerParameters.SandboxName) {
        core.info(`Sandbox Name: ${importerParameters.SandboxName}`);
      }

      // Import settings
      importerParameters.ImportType = core.getInput('import-type', { required: true });
      core.info(`Import: ${importerParameters.ImportType}`);

      importerParameters.WorkItemType = core.getInput('work-item-type', { required: true });
      core.info(`Work Item Type: ${importerParameters.WorkItemType}`);

      importerParameters.AreaPath = core.getInput('area-path', { required: true });
      core.info(`Area: ${importerParameters.AreaPath}`);

      importerParameters.IterationPath = core.getInput('iteration-path', { required: true });
      core.info(`Iteration Path: ${importerParameters.IterationPath}`);

      // Tags
      importerParameters.AddCweTag = core.getBooleanInput('add-cwe-as-tag', { required: false });
      core.info(`Add CWE as a Tag: ${importerParameters.AddCweTag}`);

      importerParameters.AddCveTag = core.getBooleanInput('add-cve-as-tag', { required: false });
      core.info(`Add CVE as a Tag: ${importerParameters.AddCveTag}`);

      importerParameters.AddCustomTag = core.getInput('add-custom-tag', { required: false });
      if (importerParameters.AddCustomTag) {
        core.info(`Add Custom Tag: ${importerParameters.AddCustomTag}`);
      }

      importerParameters.FoundInBuild = core.getBooleanInput('add-build-id-as-tag', { required: false });
      core.info(`Add Build ID as a Tag: ${importerParameters.FoundInBuild}`);

      importerParameters.AddScanNameAsATag = core.getBooleanInput('add-scan-name-as-tag', { required: false });
      core.info(`Add Scan Name as a Tag: ${importerParameters.AddScanNameAsATag}`);

      importerParameters.ScanTypeTag = core.getBooleanInput('add-scan-type-tag', { required: false });
      core.info(`Add Scan Type as Tag: ${importerParameters.ScanTypeTag}`);

      importerParameters.SeverityTag = core.getBooleanInput('add-severity-tag', { required: false });
      core.info(`Add Severity as Tag: ${importerParameters.SeverityTag}`);

      importerParameters.DueDateTag = core.getBooleanInput('add-due-date-tag', { required: false });
      core.info(`Add Due Date as Tag: ${importerParameters.DueDateTag}`);

      // Flaw import limit
      const flawLimitInput = core.getInput('flaw-import-limit', { required: true });
      importerParameters.FlawImportLimit = parseInt(flawLimitInput, 10);
      const validateFlawLimitNumber = new RegExp(commonData.Constants.flawLimitNumberValidation_RegEX);
      if (validateFlawLimitNumber.test(importerParameters.FlawImportLimit.toString())) {
        core.info(`Flaw Import Limit: ${importerParameters.FlawImportLimit}`);
      } else {
        importerParameters.IsValidationsSuccess = false;
        this.commonHelper.setTaskFailure('Invalid flaw import limit');
      }

      // Proxy settings
      const proxySettings = core.getInput('proxy-settings', { required: false });
      if (proxySettings) {
        this.adjustOptionalArguments(proxySettings.split(' '), importerParameters);
      }

      // Debug
      importerParameters.IsDebugEnabled = core.getBooleanInput('debug', { required: false });
      core.info(`Debug Logs Enabled: ${importerParameters.IsDebugEnabled}`);

      // Custom fields
      const customFieldsRaw = core.getInput('custom-fields', { required: false });
      this.setCustomFields(customFieldsRaw, importerParameters);
      core.info(`Custom Fields: ${importerParameters.CustomFields.size > 0 ? 'Set' : 'None'}`);

      // Overwrite settings
      importerParameters.OverwriteAreaPathInWorkItemsOnImport = core.getBooleanInput('overwrite-area-path', { required: true });
      core.info(`Overwrite Area Path in Work Items on Import: ${importerParameters.OverwriteAreaPathInWorkItemsOnImport}`);

      importerParameters.OverwriteIterationPathInWorkItemsOnImport = core.getBooleanInput('overwrite-iteration-path', { required: true });
      core.info(`Overwrite Iteration Path in Work Items on Import: ${importerParameters.OverwriteIterationPathInWorkItemsOnImport}`);

      // Scan type
      importerParameters.ScanType = core.getInput('scan-type', { required: true });
      core.info(`Scan Type: ${importerParameters.ScanType}`);

      // Fail on error
      importerParameters.FailBuildIfFlawImporterBuildStepFails = core.getBooleanInput('fail-on-error', { required: false });
      core.info(`Fail action if flaw importer fails: ${importerParameters.FailBuildIfFlawImporterBuildStepFails}`);

      // Veracode API Wrapper path
      importerParameters.VeracodeAPIWrapper = path.join(__dirname, '..', 'common', commonData.Constants.apiWrapperName);

      return importerParameters;
    } catch (error) {
      // Log the actual error first for debugging
      if (error instanceof Error) {
        core.error(`Input retrieval error: ${error.message}`);
        core.debug(`Error stack: ${error.stack}`);
      } else {
        core.error(`Input retrieval error: ${error}`);
      }
      
      if (this.validateEmptyInputBoxes(importerParameters)) {
        core.error('Validation failed: One or more required inputs are empty or invalid.');
        core.error(`VeracodeAppProfile: ${importerParameters.VeracodeAppProfile || 'MISSING'}`);
        core.error(`ImportType: ${importerParameters.ImportType || 'MISSING'}`);
        core.error(`FlawImportLimit: ${importerParameters.FlawImportLimit || 'MISSING'}`);
        core.error(`WorkItemType: ${importerParameters.WorkItemType || 'MISSING'}`);
        core.error(`AreaPath: ${importerParameters.AreaPath || 'MISSING'}`);
        this.commonHelper.setTaskFailure(commonData.Constants.FlawImporter_InvalidYAMLPropertiesMessage);
      }
      this.commonHelper.setTaskFailure('Error occurred during input detail retrieval process');
      throw error;
    }
  }

  private setCustomFields(customFieldsRaw: string, importerParameters: commonData.FlawImporterParametersDto): void {
    try {
      if (customFieldsRaw && customFieldsRaw !== '') {
        const customFieldsArray = customFieldsRaw.split('\n');
        customFieldsArray.forEach(function (customField) {
          const customFieldSplit = customField.split(':');
          if (customFieldSplit != null && customFieldSplit.length == 2) {
            importerParameters.CustomFields.set(customFieldSplit[0].trim(), customFieldSplit[1].trim());
          }
        });
      }
    } catch (error) {
      core.error(`Error parsing custom fields: ${error}`);
      this.commonHelper.setTaskFailure('Invalid custom field data');
    }
  }

  private adjustOptionalArguments(
    proxySettings: string[],
    importerParameters: commonData.FlawImporterParametersDto
  ): void {
    let argument: string;
    for (let index = 0; index < proxySettings.length; index++) {
      argument = proxySettings[index].toLowerCase();

      if (argument.substring(0, 1) == '-') {
        switch (argument.substring(1, argument.length)) {
          case commonData.Constants.optionalArgument_sandboxid:
            if (!importerParameters.SandboxName) {
              importerParameters.SandboxId = proxySettings[index + 1];
              core.info(`Sandbox Id: ${importerParameters.SandboxId}`);
            } else {
              core.info(`You have already provided Sandbox Name, Sandbox Id '${proxySettings[index + 1]}' in optional Argument Will be Ignored`);
            }
            break;
          case commonData.Constants.optionalArgument_sandboxname:
            if (!importerParameters.SandboxName) {
              importerParameters.SandboxName = proxySettings[index + 1];
              core.info(`SandboxName: ${importerParameters.SandboxName}`);
            } else {
              core.info(`You have already provided Sandbox Name, Sandbox Name '${proxySettings[index + 1]}' in optional Argument Will be Ignored`);
            }
            break;
          case commonData.Constants.optionalArgument_phost:
            importerParameters.Phost = proxySettings[index + 1];
            core.info(`Proxy Host: ${importerParameters.Phost}`);
            break;
          case commonData.Constants.optionalArgument_ppassword:
            importerParameters.Ppassword = proxySettings[index + 1];
            core.info(`Proxy Password: [REDACTED]`);
            break;
          case commonData.Constants.optionalArgument_pport:
            importerParameters.Pport = proxySettings[index + 1];
            core.info(`Proxy Port: ${importerParameters.Pport}`);
            break;
          case commonData.Constants.optionalArgument_puser:
            importerParameters.Puser = proxySettings[index + 1];
            core.info(`Proxy User: ${importerParameters.Puser}`);
            break;
          default:
            core.warning(`Invalid optional argument: ${argument}`);
            break;
        }
      }
    }
  }

  private validateEmptyInputBoxes(flawImporterParameters: commonData.FlawImporterParametersDto): boolean {
    if (
      !flawImporterParameters.VeracodeAppProfile ||
      !flawImporterParameters.ImportType ||
      !flawImporterParameters.FlawImportLimit ||
      !flawImporterParameters.WorkItemType ||
      !flawImporterParameters.AreaPath
    ) {
      return true;
    }
    return false;
  }
}
