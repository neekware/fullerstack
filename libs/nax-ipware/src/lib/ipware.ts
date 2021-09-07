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

import { IpwareConfigOptionsDefault } from './ipware.default';
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
  private nonPublicIpPrefixes: string[] = [];

  constructor(options?: IpwareConfigOptions) {
    this.options = ldMergeWith(ldDeepClone(this.options), options, (dest, src) =>
      Array.isArray(dest) ? src : undefined
    );

    this.nonPublicIpPrefixes = [
      ...this.options.privateIpPrefixes,
      ...this.options.loopbackIpPrefixes,
    ];
  }

  /**
   * Returns the IP address of the request headers ip attribute
   * @param {ip} string containing an ip address
   * @returns an object of type IpwareIpInfo if ip address is valid, else undefined
   */
  private getInfo(ip: string): IpwareIpInfo {
    const cleanedIp = cleanUpIP(ip);
    if (isValidIP(cleanedIp)) {
      const isPublic = this.isPublic(cleanedIp);
      return { ip: cleanedIp, isPublic, isRouteTrusted: false };
    }
    return undefined;
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

    for (const prefix of this.nonPublicIpPrefixes) {
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
  getClientIP(request: any, callOptions?: IpwareCallOptions): IpwareIpInfo | null {
    const options = ldMergeWith(ldDeepClone(this.options), callOptions, (dest, src) =>
      Array.isArray(dest) ? src : undefined
    );

    const privateIPList: IpwareIpInfo[] = [];
    const loopbackIPList: IpwareIpInfo[] = [];
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
            // ip spoofing is always possible if the hacker guess our proxy's ip address or subnet, and sends in a fake ip address
            // to prevent ip spoofing, ipware must be combined with ip filtering at firewall level
            // alternatively you can configure your proxy to send a customer header attribute that is hard to guess, but your server is aware of it
            if (ipData.ips[ipData.count - 1].startsWith(proxy)) {
              ipInfo = this.getInfo(clientIp);
              if (ipInfo?.ip) {
                ipInfo.isRouteTrusted = true;

                // configuration is strictly looking for a public ip address only, or none at all, continue processing ...
                if (options.publicOnly && !ipInfo.isPublic) {
                  continue;
                }

                return ipInfo;
              }
            }
          }
        } else {
          ipInfo = this.getInfo(clientIp);
          if (ipInfo?.ip) {
            // configuration is strictly looking for a public ip address only, or none at all
            if (options.publicOnly && !ipInfo.isPublic) {
              this.isLoopback(ipInfo.ip) ? loopbackIPList.push(ipInfo) : privateIPList.push(ipInfo);
            } else {
              return ipInfo;
            }
          }
        }
      }
    }

    // in strict mode, we either return an ip that comes through the matching proxy/count or none
    if (options.proxy.strict && (options.proxy.proxyList.length > 0 || options.proxy.count > 0)) {
      return null;
    }

    // no ip address from headers, let's fallback to the request itself
    const reqIp = getIpFromRequest(request);
    ipInfo = this.getInfo(reqIp);
    if (ipInfo?.ip) {
      // configuration is strictly looking for a public ip address only, or none at all
      if (options.publicOnly && ipInfo.isPublic) {
        return ipInfo;
      } else {
        this.isLoopback(ipInfo.ip) ? loopbackIPList.push(ipInfo) : privateIPList.push(ipInfo);
      }
    }

    // no public ip address at this point, return empty ip info if configuration is publicOnly
    if (options.publicOnly) {
      return null;
    }

    // the best private ip address is the first one in the list
    if (privateIPList.length > 0) {
      return privateIPList[0];
    }

    // the best loopback ip address is the first one in the list
    if (loopbackIPList.length > 0) {
      return loopbackIPList[0];
    }

    // unable to find any ip, return empty and let the caller decide what to do
    return null;
  }
}
