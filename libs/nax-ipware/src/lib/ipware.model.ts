/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

export interface IpwareHeaders {
  [key: string]: string;
}

export interface IpwareIpInfo {
  ip: string;
  isPublic: boolean; // routable on the internet
  isRouteTrusted?: boolean;
}

export interface IpwareData {
  ips: string[];
  count: number;
}
export type IpwareClientIpOrder = 'left-most' | 'right-most';

export interface IpwareProxyOptions {
  proxyList?: string[];
  count?: number;
  order?: IpwareClientIpOrder;
  strict?: boolean;
}

export interface IpwareConfigOptions {
  requestHeadersOrder?: string[];
  privateIpPrefixes?: string[];
  loopbackIpPrefixes?: string[];
  proxy?: IpwareProxyOptions;
  publicOnly?: boolean;
}

export interface IpwareCallOptions {
  requestHeadersOrder?: string[];
  proxy?: IpwareProxyOptions;
  publicOnly?: boolean;
}
