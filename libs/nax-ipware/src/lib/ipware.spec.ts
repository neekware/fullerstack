/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Ipware } from './ipware';
import {
  IPWARE_HEADERS_IP_ATTRIBUTES_ORDER,
  IPWARE_LOOPBACK_PREFIX,
  IPWARE_PRIVATE_IP_PREFIX,
} from './ipware.default';
import { IpwareConfigOptions } from './ipware.model';

describe('Ipware', () => {
  const ipware = new Ipware();
  it('should initialize', () => {
    expect(ipware).toBeTruthy();
  });

  it('should have default options', () => {
    expect(ipware.options.ipOrder).toEqual('left-most');
    expect(ipware.options.requestHeadersOrder.length).toEqual(
      IPWARE_HEADERS_IP_ATTRIBUTES_ORDER.length
    );
    expect(ipware.options.privateIpPrefixes.length).toEqual(IPWARE_PRIVATE_IP_PREFIX.length);
    expect(ipware.options.proxyIpPrefixes.length).toEqual(0);
    expect(ipware.options.loopbackIpPrefixes.length).toEqual(IPWARE_LOOPBACK_PREFIX.length);
  });

  it('should overwrite options', () => {
    const options: IpwareConfigOptions = {
      ipOrder: 'right-most',
      requestHeadersOrder: ['X-Forwarded-For', 'X-Real-IP'],
      proxyIpPrefixes: ['10.0.0.0', '172.16.0.0', '192.168.0.0'],
    };
    const _ipware = new Ipware(options);

    expect(_ipware.options.ipOrder).toEqual('right-most');
    expect(_ipware.options.requestHeadersOrder.length).toEqual(options.requestHeadersOrder.length);
    expect(_ipware.options.proxyIpPrefixes.length).toEqual(options.proxyIpPrefixes.length);
    expect(_ipware.options.loopbackIpPrefixes.length).toEqual(IPWARE_LOOPBACK_PREFIX.length);
  });

  it('should verify loopback ip', () => {
    expect(ipware.isLoopback('127.0.0.1')).toBeTruthy();
  });

  it('should verify private ip', () => {
    expect(ipware.isPrivate('127.0.0.1')).toBeTruthy();
    expect(ipware.isPrivate('10.10.10.10')).toBeTruthy();
    expect(ipware.isPrivate('177.139.100.100')).toBeFalsy();
    expect(ipware.isPrivate('3ffe:1900:4545:3:200:f8ff:fe21:67cf')).toBeFalsy();
  });

  it('should verify public ip', () => {
    expect(ipware.isPublic('127.0.0.1')).toBeFalsy();
    expect(ipware.isPublic('10.10.10.10')).toBeFalsy();
    expect(ipware.isPublic('177.139.100.100')).toBeTruthy();
    expect(ipware.isPublic('3ffe:1900:4545:3:200:f8ff:fe21:67cf')).toBeTruthy();
  });
});
