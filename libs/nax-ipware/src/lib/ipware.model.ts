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
export type IpwareMultiIpDirection = 'left-most' | 'right-most';

export interface IpwareConfigOptions {
  requestHeadersOrder?: string[];
  privateIpPrefixes?: string[];
  loopbackIpPrefixes?: string[];
  proxyIpPrefixes?: string[];
  proxyCount?: number;
  ipOrder?: string;
}

export interface IpwareCallOptions {
  requestHeadersOrder?: string[];
  proxyIpPrefixes?: string[];
  proxyCount?: number;
  ipOrder?: string;
}
