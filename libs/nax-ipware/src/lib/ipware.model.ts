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
  routable: boolean;
  trustedRoute?: boolean;
}

export interface IpwareData {
  ips: string[];
  count: number;
}
export type IpwareClientIpOrder = 'left-most' | 'right-most';

export interface IpwareProxyOptions {
  enabled: boolean;
  proxyIpPrefixes?: string[];
  count?: number;
  order?: string;
}

export interface IpwareConfigOptions {
  requestHeadersOrder?: string[];
  privateIpPrefixes?: string[];
  loopbackIpPrefixes?: string[];
  proxy?: IpwareProxyOptions;
}

export interface IpwareCallOptions {
  requestHeadersOrder?: string[];
  proxy?: IpwareProxyOptions;
}
