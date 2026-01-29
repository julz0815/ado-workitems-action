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
import * as exec from '@actions/exec';
import * as flawImportActivity from './FlawImportActivity';

async function run(): Promise<void> {
  try {
    // Check if Java exists
    try {
      await exec.exec('java', ['-version']);
    } catch (error) {
      core.setFailed('Java is not installed or not in PATH. Please ensure Java is correctly installed.');
      return;
    }

    const flawImporter = new flawImportActivity.FlawImporter();
    await flawImporter.createWorkItems();
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unknown error occurred');
    }
  }
}

run();
