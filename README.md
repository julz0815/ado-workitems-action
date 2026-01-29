# Veracode Flaw Importer GitHub Action

This GitHub Action imports security flaws from Veracode Platform and creates work items in Azure DevOps.

## Features

- Import flaws from Veracode scans (Static Analysis and SCA)
- Create, update, close, and reopen work items in Azure DevOps based on mitigation status
- Automatic mitigation comment synchronization
- Support for configurable work item states (open, close, reopen)
- Configurable work item types, tags, and custom fields

## Current Implementation Status

**Supported Scan Types:**
- Static Analysis
- Software Composition Analysis (SCA)
- Static Analysis and SCA

**Supported Import Types:**
- All Unmitigated Flaws Violating Policy

**Note:** Other import types and scan types will be implemented in future releases.

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
- `scan-type` (required): Scan Type - Options: 'Static Analysis', 'Software Composition Analysis (SCA)', 'Static Analysis and SCA'
- `import-type` (required): Import Type - Currently supported: 'All Unmitigated Flaws Violating Policy' (other import types will follow)
- `work-item-type` (required): Work Item Type - Options: 'Bug', 'Issue', 'Task', 'Epic', 'Feature', 'Test Case', 'User Story'
- `area-path` (required): Area Path
- `overwrite-area-path` (required): Overwrite Area Path in Work Items on Import (true/false)
- `iteration-path` (required): Iteration Path
- `overwrite-iteration-path` (required): Overwrite Iteration Path in Work Items on Import (true/false)
- `flaw-import-limit` (required): Maximum number of flaws to import (default: 1000)

### Work Item State Management
- `open-state` (required): State for newly created or reopened work items (default: 'New')
- `close-state` (required): State for closed work items (default: 'Closed')
- `reopen-state` (required): State for reopened work items (default: 'New')

**Note:** The action automatically manages work item states based on mitigation status:
- **Static Findings**: Work items are closed when `resolution_status` is 'APPROVED', and reopened when not mitigated
- **SCA Findings**: Work items are closed when annotation action is 'APPROVED', and reopened for all other statuses (including 'REJECTED')
- Mitigation comments are automatically added to work items and synchronized to avoid duplicates

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

## Usage Example

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
        uses: julz0815/ado-workitems-action@api_and_close
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
          scan-type: 'Static Analysis and SCA'
          import-type: 'All Unmitigated Flaws Violating Policy'
          work-item-type: 'Bug'
          area-path: 'your-project'
          overwrite-area-path: 'true'
          iteration-path: 'your-project'
          overwrite-iteration-path: 'true'
          flaw-import-limit: '1000'
          
          # Work Item State Management
          open-state: 'New'
          close-state: 'Closed'
          reopen-state: 'New'
          
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

## Mitigation Handling

The action automatically handles work item state changes based on mitigation status from the Veracode Platform:

- **Mitigation Comments**: All mitigation annotations are automatically added as comments to work items, avoiding duplicates
- **State Synchronization**: Work item states are synchronized with Veracode mitigation status:
  - Approved mitigations → Work items are closed
  - Rejected or other mitigations → Work items are reopened
- **Comment Format**: Mitigation comments include user, date, action, and details (TSRV format when available)

## Requirements

- Node.js 20.0.0 or higher
- Veracode API credentials (API ID and API Key)
- Azure DevOps Personal Access Token with Work Items Read & Write permissions

## License

Copyright (c) 2017 Veracode, Inc. All rights observed.

Available for use by Veracode customers as described in the accompanying license agreement.
