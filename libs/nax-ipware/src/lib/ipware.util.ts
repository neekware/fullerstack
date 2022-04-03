/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { IpwareClientIpOrder, IpwareData, IpwareHeaders } from './ipware.model';

/**
 * Check the validity of an IPv4 address
 */
export function isValidIPv4(ip: string): boolean {
  const ipv4_pattern =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  return ipv4_pattern.test(ip);
}

/**
 * Check the validity of an IPv6 address
 */
export function isValidIPv6(ip: string): boolean {
  const ipv6_pattern =
    /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/gi;

  return ipv6_pattern.test(ip);
}

/**
 * Check the validity of an IP address
 */
export function isValidIP(ip: string): boolean {
  return isValidIPv4(ip) || isValidIPv6(ip);
}

/**
 * Given ip address string, it cleans it up
 */
export function cleanUpIP(ip: string): string {
  ip = ip.toLowerCase().trim();
  if (ip.startsWith('::ffff:')) {
    return ip.replace('::ffff:', '');
  }
  return ip;
}

/**
 * Given a string, it returns a list of one or more valid IP addresses
 * @param str - string to be parsed
 * @param order - client ip order (default is `left-most`)
 */
export function getIPsFromString(
  str: string,
  order: IpwareClientIpOrder = 'left-most'
): IpwareData {
  const ipList: IpwareData = { ips: [], count: 0 };
  for (const ip of str
    .toLowerCase()
    .split(',')
    .map(cleanUpIP)
    .filter((ip) => ip)) {
    order === 'left-most' ? ipList.ips.push(ip) : ipList.ips.unshift(ip);
  }
  ipList.count = ipList.ips.length;

  return ipList;
}

/**
 * Returns HTTP request headers attribute by key
 * @param headers HTTP request headers
 * @param key HTTP request header key
 */
export function getHeadersAttribute(headers: IpwareHeaders, attr: string): string {
  for (const key of Object.keys(headers)) {
    if (key === attr) {
      return headers[key];
    }

    const upperCaseAttr = attr.toUpperCase();
    if (key === upperCaseAttr) {
      return headers[key];
    }

    const lowerCaseAttr = attr.toLowerCase();
    if (key === lowerCaseAttr) {
      return headers[key];
    }

    const dashedAttr = attr.replace(/_/g, '-');
    if (key === dashedAttr) {
      return headers[key];
    }

    const dashedCapitalizedSnakeCaseAttr = dashedAttr
      .split('-')
      .map((part) => `${part.charAt(0).toUpperCase()}${part.substr(1).toLowerCase()}`)
      .join('-');
    if (key === dashedCapitalizedSnakeCaseAttr) {
      return headers[key];
    }

    const underscoredAttr = attr.replace(/-/g, '_');
    if (key === underscoredAttr) {
      return headers[key];
    }

    const underscoredCapitalizedSnakeCaseAttr = underscoredAttr
      .split('_')
      .map((part) => `${part.charAt(0).toUpperCase()}${part.substr(1).toLowerCase()}`)
      .join('_');
    if (key === underscoredCapitalizedSnakeCaseAttr) {
      return headers[key];
    }

    const dashedAttrUpperCase = dashedAttr.toUpperCase();
    if (key === dashedAttrUpperCase) {
      return headers[key];
    }

    const underscoredAttrLowerCase = underscoredAttr.toLowerCase();
    if (key === underscoredAttrLowerCase) {
      return headers[key];
    }
  }

  return '';
}

/**
 * Returns ip address information from the request itself
 */
export function getIpFromRequest(request: any): string {
  let ip = '127.0.0.1';
  try {
    ip = request.connection.remoteAddress;
  } catch (e) {
    try {
      ip = request.socket.remoteAddress;
    } catch (e) {
      try {
        ip = request.connection.socket.remoteAddress;
      } catch (e) {
        try {
          ip = request.info.remoteAddress;
        } catch (e) {
          try {
            ip = request.requestContext.identity.sourceIp; // AWS Lambda
          } catch (e) {
            ip = '127.0.0.1';
          }
        }
      }
    }
  }
  return ip || '127.0.0.1';
}
