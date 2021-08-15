/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { mergeWith as ldNestedMergeWith } from 'lodash';
import { DeepReadonly } from 'ts-essentials';

import {
  IPWARE_MULTI_IP_DIRECTION,
  IpwareCallOptionsDefault,
  IpwareConfigOptionsDefault,
} from './ipware.default';
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
    this.options = ldNestedMergeWith(this.options, options, (dest, src) =>
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
    return { ip: '', routable: false, trustedRoute: false };
  }

  /**
   * Given two IP addresses, it returns the the best match ip
   * Best match order: precedence is (Public, Private, Loopback, null)
   */
  private bestMatched(lastIP: string, nextIp: string): string {
    if (!lastIP) {
      return nextIp;
    }

    if (this.isPublic(lastIP) && this.isPrivate(nextIp)) {
      return lastIP;
    }

    if (this.isPrivate(lastIP) && this.isLoopback(nextIp)) {
      return lastIP;
    }

    return nextIp;
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
   * Return the best matched IP, given an optional trusted proxy IP list
   * @param request HTTP request
   * @param options ipware call options
   * @returns IpwareIpInfo
   */
  getClientIP(request: any, callOptions?: IpwareCallOptions): IpwareIpInfo {
    callOptions = ldNestedMergeWith(
      {
        ...IpwareCallOptionsDefault,
        ...{
          requestHeadersOrder: this.options.requestHeadersOrder,
          proxyIpPrefixes: this.options.proxyIpPrefixes,
          proxyCount: this.options.proxyCount,
          ipOrder: this.options.ipOrder,
        },
      },
      callOptions,
      (dest, src) => (Array.isArray(dest) ? src : undefined)
    );

    let ipInfo: IpwareIpInfo;

    for (const key of callOptions.requestHeadersOrder) {
      const ipString = getHeadersAttribute(request.headers, key);
      if (ipString) {
        // process the ip string, we can have multiple ip addresses in the same string
        const ipData = getIPsFromString(ipString);

        // expecting at least one IP address, let's look for the next header
        if (ipData.count < 1) {
          continue;
        }

        // we are not expecting requests via any proxies, but got multiple IPs
        if (callOptions.proxyCount === 0 && ipData.count > 1) {
          continue;
        }

        // we are expecting requests via `x` number of proxies, but the IP counts don't match
        if (callOptions.proxyCount > 0 && callOptions.proxyCount !== ipData.count - 1) {
          continue;
        }

        // we are expecting requests via at least one trusted proxy, but we did not get multiple IPs
        if (callOptions.proxyIpPrefixes.length > 0 && ipData.count < 2) {
          continue;
        }

        // some configuration may be `custom` & reverse in direction (`proxy2, proxy1, client`)
        // default is configuration for most servers is `left-most` (`client, <proxy1, proxy2`)
        if (callOptions.ipOrder === IPWARE_MULTI_IP_DIRECTION && ipData.count > 1) {
          ipData.ips = ipData.ips.reverse();
        }

        if (callOptions.proxyIpPrefixes.length > 0) {
          for (const proxy in callOptions.proxyIpPrefixes) {
            // startWith to allow for partial matches (e.g. `10.`, `10.0.`)
            // the `right-most` IP is the most trusted proxy, if so, we trust the ip address
            if (ipData.ips[ipData.count - 1].startsWith(callOptions.proxyIpPrefixes[proxy])) {
              ipInfo = this.getInfo(ipData.ips[0]);
              if (ipInfo.ip && ipInfo.routable) {
                ipInfo.trustedRoute = true;
                return ipInfo;
              }
            }
          }
        } else {
          ipInfo = this.getInfo(this.bestMatched(ipInfo.ip, ipData.ips[0]));
          if (ipInfo.ip && ipInfo.routable) {
            return ipInfo;
          }
        }
      }
    }

    // no ip address from headers, let's fallback to the request itself
    const reqIp = getIpFromRequest(request);

    ipInfo = this.getInfo(reqIp);
    if (ipInfo.ip && ipInfo.routable) {
      if (callOptions.proxyCount < 1 || callOptions.proxyIpPrefixes.length < 1) {
        // caller didn't specify any proxy ip/count, so we trust the ip address
        ipInfo.trustedRoute = true;
      }
      return ipInfo;
    }

    return { ip: '', routable: false, trustedRoute: false };
  }
}
