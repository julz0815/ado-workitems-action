# Veracode Flaw Importer GitHub Action

This GitHub Action imports security flaws from Veracode Platform and creates work items in Azure DevOps.

## Features

- Import flaws from Veracode scans (Static, Dynamic, and SCA)
- Create work items in Azure DevOps
- Support for multiple scan types and import filters
- Configurable work item types, tags, and custom fields

## Usage

```yaml
name: Import Veracode Flaws

on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight

jobs:
  import-flaws:
    runs-on: ubuntu-latest
    steps:
      - name: Import Veracode Flaws to ADO
        uses: ./
        with:
          # Azure DevOps Connection
          ado-token: ${{ secrets.ADO_PAT }}
          ado-org: 'your-org'
          ado-project: 'your-project'
          
          # Veracode API Credentials
          veracode-api-id: ${{ secrets.VERACODE_API_ID }}
          veracode-api-key: ${{ secrets.VERACODE_API_KEY }}
          
          # Flaw Source
          veracode-app-profile: 'MyApplication'
          sandbox-name: ''  # Optional
          
          # Work Item Settings
          scan-type: 'Dynamic and Static Analysis'
          import-type: 'All Unmitigated Flaws Violating Policy'
          work-item-type: 'Bug'
          area-path: 'your-project'
          overwrite-area-path: 'true'
          iteration-path: 'your-project'
          overwrite-iteration-path: 'true'
          flaw-import-limit: '1000'
          
          # Tags (all optional, default: true)
          add-cwe-as-tag: 'true'
          add-cve-as-tag: 'true'
          add-build-id-as-tag: 'true'
          add-scan-name-as-tag: 'true'
          add-scan-type-tag: 'true'
          add-severity-tag: 'true'
          add-due-date-tag: 'true'
          
          # Advanced
          fail-on-error: 'false'
          debug: 'false'
```

## Inputs

### Azure DevOps Connection
- `ado-token` (required): Azure DevOps Personal Access Token (PAT) with Work Items Read & Write permissions
- `ado-org` (required): Azure DevOps organization name
- `ado-project` (required): Azure DevOps project name

### Veracode Connection
- `veracode-api-id` (required): Veracode API ID
- `veracode-api-key` (required): Veracode API Key

### Flaw Source
- `veracode-app-profile` (required): Application Name in Veracode Platform
- `sandbox-name` (optional): Sandbox Name

### Work Item Settings
- `scan-type` (required): Scan Type - Options: 'Dynamic and Static Analysis', 'Software Composition Analysis (SCA)', 'Static Analysis and SCA', 'Dynamic, Static, and SCA'
- `import-type` (required): Import Type - Options: 'All Flaws', 'All Unmitigated Flaws', 'All Flaws Violating Policy', 'All Unmitigated Flaws Violating Policy'
- `work-item-type` (required): Work Item Type - Options: 'Bug', 'Issue', 'Task', 'Epic', 'Feature', 'Test Case', 'User Story'
- `area-path` (required): Area Path
- `overwrite-area-path` (required): Overwrite Area Path in Work Items on Import (true/false)
- `iteration-path` (required): Iteration Path
- `overwrite-iteration-path` (required): Overwrite Iteration Path in Work Items on Import (true/false)
- `flaw-import-limit` (required): Maximum number of flaws to import (default: 1000)

### Tags
- `add-cwe-as-tag`: Add CWE as a Tag (default: true)
- `add-cve-as-tag`: Add CVE as a Tag (default: true)
- `add-custom-tag`: Add Custom Tag (optional)
- `add-build-id-as-tag`: Add Build ID as a Tag (default: true)
- `add-scan-name-as-tag`: Add Scan Name as a Tag (default: true)
- `add-scan-type-tag`: Add Scan Type as a Tag (default: true)
- `add-severity-tag`: Add Severity as a Tag (default: true)
- `add-due-date-tag`: Add Due Date as a Tag (default: true)

### Custom Fields
- `custom-fields`: Custom Fields (key:value pairs, one per line)

### Advanced
- `proxy-settings`: Proxy Settings (optional)
- `fail-on-error`: Fail action if flaw importer fails (default: false)
- `debug`: Enable debug logging (default: false)

## Requirements

- Java must be installed and available in PATH
- Veracode Java API JAR file (included in the action)

## Building

```bash
npm install
npm run build
```

## License

Copyright (c) 2017 Veracode, Inc. All rights observed.

Available for use by Veracode customers as described in the accompanying license agreement.
