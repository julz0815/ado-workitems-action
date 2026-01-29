/*******************************************************************************
* Copyright (c) 2017 Veracode, Inc. All rights observed.
*
* Available for use by Veracode customers as described in the accompanying license agreement.
*
* Send bug reports or enhancement requests to support@veracode.com.
*
* See the license agreement for conditions on submitted materials.
******************************************************************************/

import * as crypto from 'crypto';
import * as sjcl from 'sjcl';

const authorizationScheme = "VERACODE-HMAC-SHA-256";
const requestVersion = "vcode_request_version_1";
const nonceSize = 16;

function computeHashHex(message: string, keyHex: string): string {
    const keyBits = sjcl.codec.hex.toBits(keyHex);
    const hmacBits = (new sjcl.misc.hmac(keyBits, sjcl.hash.sha256)).mac(message);
    const hmac = sjcl.codec.hex.fromBits(hmacBits);
    return hmac;
}

function calculateDataSignature(apiKeyBytes: string, nonceBytes: string, dateStamp: string, data: string): string {
    const kNonce = computeHashHex(nonceBytes, apiKeyBytes);
    const kDate = computeHashHex(dateStamp, kNonce);
    const kSig = computeHashHex(requestVersion, kDate);
    const kFinal = computeHashHex(data, kSig);
    return kFinal;
}

function newNonce(): string {
    return crypto.randomBytes(nonceSize).toString('hex').toUpperCase();
}

function toHexBinary(input: string): string {
    return sjcl.codec.hex.fromBits(sjcl.codec.utf8String.toBits(input));
}

export function calculateAuthorizationHeader(
    id: string,
    key: string,
    hostName: string,
    uriString: string,
    urlQueryParams: string,
    httpMethod: string
): string {
    uriString += urlQueryParams;
    const data = `id=${id}&host=${hostName}&url=${uriString}&method=${httpMethod}`;
    const dateStamp = Date.now().toString();
    const nonceBytes = newNonce();
    const dataSignature = calculateDataSignature(key, nonceBytes, dateStamp, data);
    const authorizationParam = `id=${id},ts=${dateStamp},nonce=${toHexBinary(nonceBytes)},sig=${dataSignature}`;
    const header = authorizationScheme + " " + authorizationParam;
    return header;
}
