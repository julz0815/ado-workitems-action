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
import * as https from 'https';
import * as http from 'http';
import { URL } from 'url';
import { calculateAuthorizationHeader } from './VeracodeHMAC';
import * as CommonData from './Common';

// Try to use proxy agents if available
let HttpsProxyAgent: any, HttpProxyAgent: any;
try {
    HttpsProxyAgent = require('https-proxy-agent');
    HttpProxyAgent = require('http-proxy-agent');
} catch (e) {
    // Packages not available, will use direct connection
    HttpsProxyAgent = null;
    HttpProxyAgent = null;
}

/**
 * Get proxy configuration from environment variables
 */
function getProxyConfig(targetUrl: string): { hostname: string; port: number; protocol: string } | null {
    const urlObj = new URL(targetUrl);
    const isHttps = urlObj.protocol === 'https:';
    
    // Check NO_PROXY
    const noProxy = process.env.NO_PROXY || process.env.no_proxy || '';
    if (noProxy) {
        const noProxyList = noProxy.split(',').map(host => host.trim().toLowerCase());
        const hostname = urlObj.hostname.toLowerCase();
        if (noProxyList.some(proxy => hostname === proxy || hostname.endsWith('.' + proxy))) {
            return null; // Don't use proxy for this host
        }
    }
    
    // Get proxy URL from environment
    const proxyUrl = isHttps 
        ? (process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy)
        : (process.env.HTTP_PROXY || process.env.http_proxy);
    
    if (!proxyUrl) {
        return null;
    }
    
    try {
        const proxy = new URL(proxyUrl);
        return {
            hostname: proxy.hostname,
            port: parseInt(proxy.port) || (proxy.protocol === 'https:' ? 443 : 80),
            protocol: proxy.protocol
        };
    } catch (e) {
        // Invalid proxy URL, ignore
        return null;
    }
}

/**
 * Make an authenticated Veracode API request
 */
async function veracodeApiRequest(
    apiKeyId: string,
    apiKeySecret: string,
    method: string,
    url: string,
    queryParams: Record<string, any> = {},
    debug: boolean = false
): Promise<any> {
    const urlObj = new URL(url);
    const host = urlObj.hostname;
    const path = urlObj.pathname;
    
    // Build query string for the URL
    const queryString = Object.keys(queryParams)
        .filter(key => queryParams[key] !== undefined && queryParams[key] !== null)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
        .join('&');
    
    // Build query string for signature
    const queryStringForSignature = Object.keys(queryParams)
        .filter(key => queryParams[key] !== undefined && queryParams[key] !== null)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
        .join('&');
    
    const urlQueryParams = queryStringForSignature ? `?${queryStringForSignature}` : '';
    
    // Generate authorization header
    if (debug) {
        core.debug(`Generating authorization header for: ${host}, ${path}, ${urlQueryParams}, ${method}`);
    }
    const authorization = calculateAuthorizationHeader(apiKeyId, apiKeySecret, host, path, urlQueryParams, method);
    
    const fullPath = queryString ? `${path}?${queryString}` : path;
    
    // Choose http or https module
    const httpModule = urlObj.protocol === 'https:' ? https : http;
    const isHttps = urlObj.protocol === 'https:';
    
    // Get proxy configuration
    const proxyConfig = getProxyConfig(url);
    
    return new Promise((resolve, reject) => {
        const options: any = {
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            path: fullPath,
            method: method,
            headers: {
                'Authorization': authorization,
                'Content-Type': 'application/json',
                'Host': urlObj.host
            }
        };

        if (debug) {
            core.debug(`Request options: ${JSON.stringify(options)}`);
        }
        
        // Configure proxy agent if proxy is detected
        if (proxyConfig) {
            const proxyUrl = `${proxyConfig.protocol}//${proxyConfig.hostname}:${proxyConfig.port}`;
            if (isHttps && HttpsProxyAgent) {
                options.agent = new HttpsProxyAgent(proxyUrl);
            } else if (!isHttps && HttpProxyAgent) {
                options.agent = new HttpProxyAgent(proxyUrl);
            } else if (proxyConfig && (!HttpsProxyAgent || !HttpProxyAgent)) {
                core.warning(`Proxy detected but proxy agent packages not available. Install them for proxy support: npm install https-proxy-agent http-proxy-agent`);
            }
        }
        
        const req = httpModule.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk.toString();
            });
            
            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const jsonData = JSON.parse(data);
                        if (debug) {
                            core.debug(`Response: ${JSON.stringify(jsonData)}`);
                        }
                        resolve(jsonData);
                    } catch (parseError: any) {
                        reject(new Error(`Failed to parse JSON response: ${parseError.message}`));
                    }
                } else {
                    let errorMessage = `Veracode API error: ${res.statusCode} ${res.statusMessage}`;
                    try {
                        const errorData = JSON.parse(data);
                        errorMessage += ` - ${JSON.stringify(errorData)}`;
                    } catch (e) {
                        errorMessage += ` - ${data}`;
                    }
                    reject(new Error(errorMessage));
                }
            });
        });
        
        req.on('error', (error) => {
            reject(new Error(`Veracode API request failed: ${error.message}`));
        });
        
        req.end();
    });
}

/**
 * Find application profile by name (exact match)
 */
async function findApplicationProfile(
    apiKeyId: string,
    apiKeySecret: string,
    profileName: string,
    debug: boolean = false
): Promise<{ guid: string; name: string; id: number }> {
    const url = 'https://api.veracode.com/appsec/v1/applications';
    const response = await veracodeApiRequest(apiKeyId, apiKeySecret, 'GET', url, { name: profileName }, debug);
    
    if (!response._embedded || !response._embedded.applications) {
        throw new Error(`No applications found for profile name: ${profileName}`);
    }
    
    // Find exact match
    const exactMatch = response._embedded.applications.find((app: any) => app.profile.name === profileName);
    
    if (!exactMatch) {
        throw new Error(`No exact match found for profile name: ${profileName}. Found ${response._embedded.applications.length} profiles starting with this name.`);
    }
    
    return {
        guid: exactMatch.guid,
        name: exactMatch.profile.name,
        id: exactMatch.id
    };
}

/**
 * Find sandbox by name (exact match)
 */
async function findSandbox(
    apiKeyId: string,
    apiKeySecret: string,
    applicationGuid: string,
    sandboxName: string,
    debug: boolean = false
): Promise<{ guid: string; name: string; id: number }> {
    const url = `https://api.veracode.com/appsec/v1/applications/${applicationGuid}/sandboxes`;
    const response = await veracodeApiRequest(apiKeyId, apiKeySecret, 'GET', url, {}, debug);
    
    if (!response._embedded || !response._embedded.sandboxes) {
        throw new Error(`No sandboxes found for application: ${applicationGuid}`);
    }
    
    // Find exact match
    const exactMatch = response._embedded.sandboxes.find((sandbox: any) => sandbox.name === sandboxName);
    
    if (!exactMatch) {
        throw new Error(`No exact match found for sandbox name: ${sandboxName}. Found ${response._embedded.sandboxes.length} sandboxes.`);
    }
    
    return {
        guid: exactMatch.guid,
        name: exactMatch.name,
        id: exactMatch.id
    };
}

/**
 * Get all static findings (handles pagination)
 */
async function getAllStaticFindings(
    apiKeyId: string,
    apiKeySecret: string,
    applicationGuid: string,
    sandboxGuid: string | null = null,
    importType: string,
    debug: boolean = false
): Promise<any> {
    const size = 20;
    let page = 0;
    let allFindings: any[] = [];
    let totalPages = 1;
    
    // Determine query parameters based on import type
    const baseParams: Record<string, any> = {
        scan_type: 'STATIC',
        include_annot: 'TRUE',
        page: page,
        size: size
    };
    
    // Add violates_policy filter based on import type
    if (importType.includes('Violating Policy')) {
        baseParams.violates_policy = 'True';
    }
    
    // Add context if sandbox
    if (sandboxGuid) {
        baseParams.context = sandboxGuid;
    }
    
    do {
        baseParams.page = page;
        const url = `https://api.veracode.com/appsec/v2/applications/${applicationGuid}/findings`;
        const response = await veracodeApiRequest(apiKeyId, apiKeySecret, 'GET', url, baseParams, debug);
        
        if (page === 0) {
            totalPages = response.page?.total_pages || 1;
        }
        
        if (response._embedded && response._embedded.findings) {
            allFindings = allFindings.concat(response._embedded.findings);
        }
        
        page++;
    } while (page < totalPages);
    
    // Return in the same format as a single page response
    return {
        _embedded: {
            findings: allFindings
        },
        page: {
            size: allFindings.length,
            total_elements: allFindings.length,
            total_pages: 1,
            number: 0
        },
        _links: sandboxGuid ? {} : {}
    };
}

/**
 * Get all SCA findings (handles pagination)
 */
async function getAllSCAFindings(
    apiKeyId: string,
    apiKeySecret: string,
    applicationGuid: string,
    sandboxGuid: string | null = null,
    debug: boolean = false
): Promise<any> {
    const size = 20;
    let page = 0;
    let allFindings: any[] = [];
    let totalPages = 1;
    
    do {
        const baseParams: Record<string, any> = {
            scan_type: 'SCA',
            page: page,
            size: size
        };
        
        if (sandboxGuid) {
            baseParams.context = sandboxGuid;
        }
        
        const url = `https://api.veracode.com/appsec/v2/applications/${applicationGuid}/findings`;
        const response = await veracodeApiRequest(apiKeyId, apiKeySecret, 'GET', url, baseParams, debug);
        
        if (page === 0) {
            totalPages = response.page?.total_pages || 1;
        }
        
        if (response._embedded && response._embedded.findings) {
            allFindings = allFindings.concat(response._embedded.findings);
        }
        
        page++;
    } while (page < totalPages);
    
    // Return in the same format as a single page response
    return {
        _embedded: {
            findings: allFindings
        },
        page: {
            size: allFindings.length,
            total_elements: allFindings.length,
            total_pages: 1,
            number: 0
        },
        _links: sandboxGuid ? {} : {}
    };
}

/**
 * Veracode API Client - replaces VeracodeBridge
 */
export class VeracodeAPIClient {
    private apiKeyId: string;
    private apiKeySecret: string;
    private debug: boolean;
    private commonHelper: CommonData.CommonHelper;
    private failBuildIfFlawImporterBuildStepFails: boolean;

    constructor(importParameters: CommonData.FlawImporterParametersDto) {
        this.commonHelper = new CommonData.CommonHelper();
        this.failBuildIfFlawImporterBuildStepFails = importParameters.FailBuildIfFlawImporterBuildStepFails;
        this.apiKeyId = importParameters.VID;
        this.apiKeySecret = importParameters.VKey;
        this.debug = importParameters.IsDebugEnabled;
        
        // Set proxy environment variables if configured
        if (importParameters.Phost && importParameters.Pport) {
            const proxyUrl = importParameters.Puser && importParameters.Ppassword
                ? `http://${importParameters.Puser}:${importParameters.Ppassword}@${importParameters.Phost}:${importParameters.Pport}`
                : `http://${importParameters.Phost}:${importParameters.Pport}`;
            process.env.HTTP_PROXY = proxyUrl;
            process.env.HTTPS_PROXY = proxyUrl;
        }
    }

    /**
     * Get application and sandbox information
     */
    async getAppInfo(
        scanDetails: CommonData.ScanDto,
        importParameters: CommonData.FlawImporterParametersDto
    ): Promise<CommonData.ScanDto | null> {
        core.debug("Class Name: VeracodeAPIClient, Method Name: getAppInfo");

        try {
            core.info("Start Obtaining App Info via API");
            
            // Find application profile
            const profileInfo = await findApplicationProfile(
                this.apiKeyId,
                this.apiKeySecret,
                importParameters.VeracodeAppProfile,
                this.debug
            );
            
            scanDetails.Appid = profileInfo.guid;
            scanDetails.AppName = profileInfo.name;
            
            // Find sandbox if specified
            if (importParameters.SandboxName) {
                const sandboxInfo = await findSandbox(
                    this.apiKeyId,
                    this.apiKeySecret,
                    profileInfo.guid,
                    importParameters.SandboxName,
                    this.debug
                );
                scanDetails.SandboxId = sandboxInfo.guid;
                scanDetails.SandboxName = sandboxInfo.name;
            }
            
            core.info(`Found application: ${scanDetails.AppName} (GUID: ${scanDetails.Appid})`);
            if (scanDetails.SandboxName) {
                core.info(`Found sandbox: ${scanDetails.SandboxName} (GUID: ${scanDetails.SandboxId})`);
            }
            
            return scanDetails;
        } catch (error: any) {
            this.commonHelper.handleError(error, "Failed to get application info from Veracode API", this.failBuildIfFlawImporterBuildStepFails);
            return null;
        }
    }

    /**
     * Get latest scan/build information
     * For API-based approach, we don't need a separate "build" - we work directly with findings
     */
    async getLatestBuild(
        scanDetails: CommonData.ScanDto,
        importParameters: CommonData.FlawImporterParametersDto
    ): Promise<CommonData.ScanDto | null> {
        core.debug("Class Name: VeracodeAPIClient, Method Name: getLatestBuild");

        try {
            // For API-based approach, we use the application GUID as the "build ID"
            // The actual findings will be fetched separately
            scanDetails.BuildId = scanDetails.Appid;
            scanDetails.BuildName = `API-${scanDetails.AppName}`;
            
            return scanDetails;
        } catch (error: any) {
            this.commonHelper.handleError(error, "Failed to get latest build info", this.failBuildIfFlawImporterBuildStepFails);
            return null;
        }
    }

    /**
     * Get findings data based on scan type
     * Returns findings in a format compatible with the existing FlawManager
     */
    async getFindingsData(
        scanDetails: CommonData.ScanDto,
        importParameters: CommonData.FlawImporterParametersDto
    ): Promise<{ staticFindings?: any; scaFindings?: any } | null> {
        core.debug("Class Name: VeracodeAPIClient, Method Name: getFindingsData");

        try {
            const scanType = importParameters.ScanType;
            const result: { staticFindings?: any; scaFindings?: any } = {};
            
            // Determine which scan types to fetch
            const fetchStatic = scanType === 'Static Analysis' || scanType === 'Static Analysis and SCA';
            const fetchSCA = scanType === 'Software Composition Analysis (SCA)' || scanType === 'Static Analysis and SCA';
            
            if (fetchStatic) {
                core.info("Fetching static findings from Veracode API...");
                const staticFindings = await getAllStaticFindings(
                    this.apiKeyId,
                    this.apiKeySecret,
                    scanDetails.Appid,
                    scanDetails.SandboxId || null,
                    importParameters.ImportType,
                    this.debug
                );
                result.staticFindings = staticFindings;
                core.info(`Fetched ${staticFindings._embedded?.findings?.length || 0} static findings`);
            }
            
            if (fetchSCA) {
                core.info("Fetching SCA findings from Veracode API...");
                const scaFindings = await getAllSCAFindings(
                    this.apiKeyId,
                    this.apiKeySecret,
                    scanDetails.Appid,
                    scanDetails.SandboxId || null,
                    this.debug
                );
                result.scaFindings = scaFindings;
                core.info(`Fetched ${scaFindings._embedded?.findings?.length || 0} SCA findings`);
            }
            
            return result;
        } catch (error: any) {
            this.commonHelper.handleError(error, "Failed to get findings data from Veracode API", this.failBuildIfFlawImporterBuildStepFails);
            return null;
        }
    }
}
