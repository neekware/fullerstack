/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import {
  cleanUpIP,
  getHeadersAttribute,
  getIPsFromString,
  getIpFromRequest,
  isValidIP,
  isValidIPv4,
  isValidIPv6,
} from './ipware.util';

describe('ipware.util', () => {
  it('should verify valid IPv4 address', () => {
    expect(isValidIPv4('177.139.100.100')).toBeTruthy();
  });

  it('should verify invalid IPv4 address', () => {
    expect(isValidIPv4('177.139.100.256')).toBeFalsy();
    expect(isValidIPv4('unknown')).toBeFalsy();
  });

  it('should verify valid IPv6 address', () => {
    expect(isValidIPv6('3ffe:1900:4545:3:200:f8ff:fe21:67cf')).toBeTruthy();
  });

  it('should verify invalid IPv6 address', () => {
    expect(isValidIPv6('fe80:2030:31:24')).toBeFalsy();
    expect(isValidIPv6('177.139.100.100')).toBeFalsy();
  });

  it('should verify valid IPv4/IPv6 addresses', () => {
    expect(isValidIP('177.139.100.100')).toBeTruthy();
    expect(isValidIP('3ffe:1900:4545:3:200:f8ff:fe21:67cf')).toBeTruthy();
  });

  it('should verify invalid IPv4/IPv6 addresses', () => {
    expect(isValidIP('fe80:2030:31:24')).toBeFalsy();
    expect(isValidIP('unknown')).toBeFalsy();
  });

  it('should clean up IP address', () => {
    expect(cleanUpIP('::fffF: ')).toEqual('');
    expect(cleanUpIP('unknown ')).toEqual('unknown');
    expect(cleanUpIP(' 177.139.100.256 ')).toEqual('177.139.100.256');
  });

  it('should clean up IP address', () => {
    const request = { headers: { 'X-Forwarded-For': '177.139.100.256' } };
    expect(getHeadersAttribute(request.headers, 'X-Forwarded-For')).toEqual('177.139.100.256');
    expect(getHeadersAttribute(request.headers, 'X_FORWARDED_FOR')).toEqual('177.139.100.256');
  });

  it('should return ip address list from string', () => {
    const str = '177.139.100.255, 177.139.100.254,177.139.100.253';
    const ips = ['177.139.100.255', '177.139.100.254', '177.139.100.253'];
    expect(JSON.stringify(getIPsFromString(str).ips)).toEqual(JSON.stringify(ips));
  });

  it('should return ip address from request', () => {
    const request = { requestContext: { identity: { sourceIp: '177.139.100.255' } } };
    expect(getIpFromRequest(request)).toEqual('177.139.100.255');
    expect(getIpFromRequest({})).toEqual('127.0.0.1');
  });
});
