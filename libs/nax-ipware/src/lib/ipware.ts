/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { cloneDeep as ldDeepClone, mergeWith as ldMergeWith } from 'lodash';
import { DeepReadonly } from 'ts-essentials';

import { IPWARE_DEFAULT_IP_INFO, IpwareConfigOptionsDefault } from './ipware.default';
import { IpwareCallOptions, IpwareConfigOptions, IpwareIpInfo } from './ipware.model';
import {
  cleanUpIP,
  getHeadersAttribute,
  getIPsFromString,
  getIpFromRequest,
  isValidIP,
} from './ipware.util';

export class Ipware {
  readonly options: DeepReadonly<IpwareConfigOptions> = IpwareConfigOptionsDefault;

  constructor(options?: IpwareConfigOptions) {
    this.options = ldMergeWith(ldDeepClone(this.options), options, (dest, src) =>
      Array.isArray(dest) ? src : undefined
    );
  }

  /**
   * Given a string, it returns an object of IpwareIpInfo.
   */
  private getInfo(ip: string): IpwareIpInfo {
    const cleanedIp = cleanUpIP(ip);
    if (isValidIP(cleanedIp)) {
      const routable = this.isPublic(cleanedIp);
      return { ip: cleanedIp, routable, trustedRoute: false };
    }
    return IPWARE_DEFAULT_IP_INFO;
  }

  /**
   * Given two IP addresses, it returns the the best match ip
   * Best match order: precedence is (Public, Private, Loopback, null)
   */
  private bestMatched(firstIp: string, secondIP: string): string {
    if (!firstIp) {
      return secondIP;
    }

    if (!secondIP) {
      return firstIp;
    }

    if (this.isPublic(firstIp) && this.isPublic(secondIP)) {
      return firstIp;
    }

    if (this.isPublic(firstIp) && this.isPrivate(secondIP)) {
      return firstIp;
    }

    if (this.isPrivate(firstIp) && this.isPublic(secondIP)) {
      return secondIP;
    }

    if (this.isPrivate(firstIp) && this.isLoopback(firstIp)) {
      return firstIp;
    }

    return secondIP;
  }

  /**
   * Determines if IP is loopback
   * @param {string} ip Ip address
   * @returns {boolean} true if ip is loopback, else false
   */
  isLoopback(ip: string): boolean {
    ip = ip.toLowerCase();
    for (const prefix of this.options.loopbackIpPrefixes) {
      return ip.startsWith(prefix);
    }
    return false;
  }

  /**
   * Determines if IP is private (non-routable on the internet)
   * @param {string} ip Ip address
   * @returns {boolean} true if ip is private, else false
   */
  isPrivate(ip: string): boolean {
    ip = ip.toLowerCase();

    const nonPublicIpPrefixes = [
      ...this.options.privateIpPrefixes,
      ...this.options.loopbackIpPrefixes,
    ];

    for (const prefix of nonPublicIpPrefixes) {
      if (ip.startsWith(prefix)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Determines if IP is public (routable on the internet)
   * @param {string} ip Ip address
   * @returns {boolean} true if ip is public, else false
   */
  isPublic(ip: string): boolean {
    return !this.isPrivate(ip);
  }

  /**
   * Return the client IP address as per best matched IP address
   * @param request HTTP request
   * @param options ipware call options
   * @returns IpwareIpInfo
   */
  getClientIP(request: any, callOptions?: IpwareCallOptions): IpwareIpInfo {
    const options = ldMergeWith(ldDeepClone(this.options), callOptions, (dest, src) =>
      Array.isArray(dest) ? src : undefined
    );

    const nonRoutableIpList: string[] = [];
    let ipInfo: IpwareIpInfo;

    for (const key of options.requestHeadersOrder) {
      const ipString = getHeadersAttribute(request.headers, key);
      if (ipString) {
        // process the header attribute, we can have multiple ip addresses in the same attribute
        const ipData = getIPsFromString(ipString, options.proxy.order);

        // we are expecting at least `1` ip address
        if (ipData.count < 1) {
          continue;
        }

        const clientIp = ipData.ips[0];

        // we are expecting `x` number of ips as per `proxy.count`
        if (options.proxy.count > 0 && options.proxy.count !== ipData.count - 1) {
          continue;
        }

        // we are expecting at least `1` ip address as per `proxy.proxyList`
        if (options.proxy.proxyList.length > 0 && ipData.count < 2) {
          continue;
        }

        if (options.proxy.proxyList.length > 0) {
          for (const proxy of options.proxy.proxyList) {
            // the right most ip address is the most trusted proxy
            // ip spoofing is possible if the hacker gets to send in a fake ip address
            // ip filtering at firewall level is required to prevent this
            if (ipData.ips[ipData.count - 1].startsWith(proxy)) {
              ipInfo = this.getInfo(clientIp);
              if (ipInfo.ip && ipInfo.routable) {
                ipInfo.trustedRoute = true;
                return ipInfo;
              }
            }
          }
        } else {
          ipInfo = this.getInfo(clientIp);
          if (ipInfo.routable) {
            return ipInfo;
          } else {
            nonRoutableIpList.push(ipInfo.ip);
          }
        }
      }
    }

    // no ip address from headers, let's fallback to the request itself
    const reqIp = getIpFromRequest(request);
    ipInfo = this.getInfo(reqIp);
    if (ipInfo.routable) {
      return ipInfo;
    } else {
      nonRoutableIpList.push(ipInfo.ip);
    }

    // not `trusted` public IP so far, let's return the first private IP
    for (let idx = 0; idx < nonRoutableIpList.length; idx++) {
      ipInfo = this.getInfo(nonRoutableIpList[idx]);
      if (this.isPrivate(ipInfo.ip)) {
        return ipInfo;
      }
    }

    // not public, or private IP so far, let's return the first loopback IP
    for (let idx = 0; idx < nonRoutableIpList.length; idx++) {
      ipInfo = this.getInfo(nonRoutableIpList[idx]);
      if (this.isLoopback(ipInfo.ip)) {
        return ipInfo;
      }
    }

    // unable to find any ip, return empty and let the caller decide what to do
    return IPWARE_DEFAULT_IP_INFO;
  }
}
