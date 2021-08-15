/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { cloneDeep as ldDeepClone, mergeWith as ldNestedMergeWith } from 'lodash';
import { DeepReadonly } from 'ts-essentials';

import {
  IPWARE_CLIENT_IP_ORDER_DEFAULT,
  IPWARE_DEFAULT_IP_INFO,
  IPWARE_ERROR_MESSAGE,
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
  readonly options: DeepReadonly<IpwareConfigOptions> = ldDeepClone(IpwareConfigOptionsDefault);

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
    return IPWARE_DEFAULT_IP_INFO;
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
   * Return the client IP address as per proxies and configuration
   * @param request HTTP request
   * @param options ipware call options
   * @returns IpwareIpInfo
   */
  getClientIpViaProxies(request: any, callOptions?: IpwareCallOptions): IpwareIpInfo {
    const options = ldNestedMergeWith(ldDeepClone(this.options), callOptions, (dest, src) =>
      Array.isArray(dest) ? src : undefined
    );

    let ipInfo: IpwareIpInfo;

    for (const key of options.requestHeadersOrder) {
      const ipString = getHeadersAttribute(request.headers, key);
      if (ipString) {
        // process the header attribute, we can have multiple ip addresses in the same attribute
        const ipData = getIPsFromString(ipString);

        // expecting at least one IP address, let's look for the next header
        if (ipData.count < 1) {
          continue;
        }

        // proxy options not configured, we can't continue
        if (!options.proxy.enabled) {
          throw new Error(IPWARE_ERROR_MESSAGE.proxyDisabledOnCallViaProxy);
        }

        // proxy check enabled, but not configured properly, we can't continue
        if (options.proxy.count < 1 && options.proxy.proxyIpPrefixes.length < 1) {
          throw new Error(IPWARE_ERROR_MESSAGE.proxyEnabledButMisconfigured);
        }

        // we are expecting requests via `x` number of proxies, but the IP counts don't match
        if (options.proxy.count > 0 && options.proxy.count !== ipData.count - 1) {
          continue;
        }

        // we are expecting requests via specific trusted proxy, but the IP counts don't match
        if (
          options.proxy.proxyIpPrefixes.length > 0 &&
          options.proxy.proxyIpPrefixes.length !== ipData.count - 1
        ) {
          continue;
        }

        // some configuration may be `custom` & reverse in direction (`proxy2, proxy1, client`)
        // the default configuration for most servers is `left-most` (`client, <proxy1, proxy2`)
        if (options.proxy.order !== IPWARE_CLIENT_IP_ORDER_DEFAULT && ipData.count > 1) {
          ipData.ips = ipData.ips.reverse();
        }

        if (options.proxy.enabled && options.proxy.proxyIpPrefixes.length > 0) {
          for (let idx = 1; idx < options.proxy.proxyIpPrefixes.length; idx++) {
            // using startWith to allow for partial matches (e.g. `10.`, `10.0.`)
            // the `right-most` IP is the most trusted proxy, however, we check all proxy prefixes
            // bail out on first unmatched proxy ip address
            if (!ipData.ips[idx].startsWith(options.proxy.proxyIpPrefixes[idx])) {
              return IPWARE_DEFAULT_IP_INFO;
            }
          }

          // we matched the proxy information, however, the client IP still may be private
          // we let the caller to decide what to do a private client IP
          ipInfo = this.getInfo(ipData.ips[0]);
          ipInfo.trustedRoute = true;
          return ipInfo;
        }
      }
    }

    // we did not find any ip address based on the caller requirement
    return IPWARE_DEFAULT_IP_INFO;
  }

  /**
   * Return the client IP address as per best matched IP address
   * @param request HTTP request
   * @param options ipware call options
   * @returns IpwareIpInfo
   */
  getClientIP(request: any, callOptions?: IpwareCallOptions): IpwareIpInfo {
    const options = ldNestedMergeWith(ldDeepClone(this.options), callOptions, (dest, src) =>
      Array.isArray(dest) ? src : undefined
    );

    let ipInfo: IpwareIpInfo;

    for (const key of options.requestHeadersOrder) {
      const ipString = getHeadersAttribute(request.headers, key);
      if (ipString) {
        // process the header attribute, we can have multiple ip addresses in the same attribute
        const ipData = getIPsFromString(ipString);

        // expecting at least one IP address, let's look for the next header
        if (ipData.count < 1) {
          continue;
        }

        // proxy check enabled, but not wrong api is called, better not continue for maximum security
        if (options.proxy.enabled) {
          throw new Error(IPWARE_ERROR_MESSAGE.proxyEnabledButWrongApiCalled);
        }

        // handle custom ip order
        if (options.proxy.order !== IPWARE_CLIENT_IP_ORDER_DEFAULT && ipData.count > 1) {
          ipData.ips = ipData.ips.reverse();
        }

        // we return the first public and routable IP address, based on headers precedence order
        for (const ip of ipData.ips) {
          ipInfo = this.getInfo(ip);
          if (ipInfo.ip && ipInfo.routable) {
            ipInfo.trustedRoute = true;
            return ipInfo;
          }
        }
      }
    }

    // no ip address from headers, let's fallback to the request itself
    const reqIp = getIpFromRequest(request);

    ipInfo = this.getInfo(reqIp);
    if (ipInfo.ip && ipInfo.routable) {
      return ipInfo;
    }

    return IPWARE_DEFAULT_IP_INFO;
  }
}
