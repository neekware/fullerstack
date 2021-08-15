/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Ipware } from './ipware';
import {
  IPWARE_ERROR_MESSAGE,
  IPWARE_HEADERS_IP_ATTRIBUTES_ORDER,
  IPWARE_LOOPBACK_PREFIX,
  IPWARE_PRIVATE_IP_PREFIX,
} from './ipware.default';
import { IpwareConfigOptions } from './ipware.model';

describe('Ipware', () => {
  let ipware: Ipware;

  beforeAll(() => {
    ipware = new Ipware();
  });

  afterAll(() => {
    ipware = null;
  });

  it('should initialize', () => {
    expect(ipware).toBeTruthy();
  });

  it('should have default options', () => {
    expect(ipware.options.proxy.order).toEqual('left-most');
    expect(ipware.options.requestHeadersOrder.length).toEqual(
      IPWARE_HEADERS_IP_ATTRIBUTES_ORDER.length
    );
    expect(ipware.options.privateIpPrefixes.length).toEqual(IPWARE_PRIVATE_IP_PREFIX.length);
    expect(ipware.options.proxy.proxyIpPrefixes.length).toEqual(0);
    expect(ipware.options.loopbackIpPrefixes.length).toEqual(IPWARE_LOOPBACK_PREFIX.length);
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

  it('should throw on enabled proxy with mis-configured calls/config options', () => {
    const request = {
      headers: {
        HTTP_X_REAL_IP: '177.139.233.132',
      },
    };

    try {
      ipware.getClientIpViaProxies(request, {
        proxy: { enabled: true, order: 'right-most' },
      });
      expect(true).toBe(false); // we should never get here due to mis-configuration exception
    } catch (e) {
      expect(e.message).toBe(IPWARE_ERROR_MESSAGE.proxyEnabledButMisconfigured);
    }
  });

  it('should throw on disabled proxy configuration via proxy-aware api calls', () => {
    const request = {
      headers: {
        HTTP_X_REAL_IP: '177.139.233.132',
      },
    };

    try {
      ipware.getClientIpViaProxies(request, {
        proxy: { enabled: false, order: 'right-most' },
      });
      expect(true).toBe(false); // we should never get here due to mis-configuration exception
    } catch (e) {
      expect(e.message).toBe(IPWARE_ERROR_MESSAGE.proxyDisabledOnCallViaProxy);
    }
  });
});

describe('Ipware: IPv4', () => {
  let ipware: Ipware;

  beforeAll(() => {
    ipware = new Ipware();
  });

  afterAll(() => {
    ipware = null;
  });

  it('should skip multiple ips if invalid pattern', function () {
    const request = {
      headers: {
        HTTP_X_FORWARDED_FOR: '192.168.255.182, 10.0.0.0, 177.139.233.22, 177.139.233.139',
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    const ipInfo = ipware.getClientIP(request);
    expect(ipInfo.ip).toEqual('177.139.233.22');
    expect(ipInfo.routable).toBeTruthy();
  });

  it('should return correct public from HTTP_X_FORWARDED_FOR with multiple ips, with right-most', function () {
    const request = {
      headers: {
        HTTP_X_FORWARDED_FOR: '177.139.233.137, 177.139.233.138, 177.139.233.139',
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    const ipInfo = ipware.getClientIpViaProxies(request, {
      proxy: { enabled: true, order: 'right-most', proxyIpPrefixes: ['177.139.233.'] },
    });
    expect(ipInfo.ip).toEqual('177.139.233.139');
    expect(ipInfo.routable).toBeTruthy();
  });

  it('should return correct public from HTTP_X_FORWARDED_FOR with multiple ips', function () {
    const request = {
      headers: {
        HTTP_X_FORWARDED_FOR:
          '192.168.255.182, 10.0.0.0, 127.0.0.1, 198.84.193.157, 177.139.233.139',
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    const ipInfo = ipware.getClientIP(request);
    expect(ipInfo.ip).toEqual('177.139.233.139');
    expect(ipInfo.routable).toBeTruthy();
  });

  it('should return correct public IPv4 HTTP_X_FORWARDED_FOR with invalid multiple ips', function () {
    const request = {
      headers: {
        HTTP_X_FORWARDED_FOR:
          'unknown, 192.168.255.182, 10.0.0.0, 127.0.0.1, 198.84.193.157, 177.139.233.139',
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    const ipInfo = ipware.getClientIP(request);
    expect(ipInfo.ip).toEqual('177.139.233.132');
    expect(ipInfo.routable).toBeTruthy();
  });

  it('should return correct public IPv4 HTTP_X_FORWARDED_FOR with singleton ip', function () {
    const request = {
      headers: {
        HTTP_X_FORWARDED_FOR: '177.139.233.139',
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    const ipInfo = ipware.getClientIP(request);
    expect(ipInfo.ip).toEqual('177.139.233.139');
    expect(ipInfo.routable).toBeTruthy();
  });

  it('should return correct public IPv4 HTTP_X_FORWARDED_FOR with singleton private ip', function () {
    const request = {
      headers: {
        HTTP_X_FORWARDED_FOR: '192.168.255.182',
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    const ipInfo = ipware.getClientIP(request);
    expect(ipInfo.ip).toEqual('177.139.233.132');
    expect(ipInfo.routable).toBeTruthy();
  });

  it('should return correct public IPv4 HTTP_X_FORWARDED_FOR fallback on HTTP_X_REAL_IP', function () {
    const request = {
      headers: {
        HTTP_X_FORWARDED_FOR: 'unknown 192.168.255.182',
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    const ipInfo = ipware.getClientIP(request);
    expect(ipInfo.ip).toEqual('177.139.233.132');
    expect(ipInfo.routable).toBeTruthy();
  });

  it('should return correct public IPv4 empty HTTP_X_FORWARDED_FOR fallback on HTTP_X_REAL_IP', function () {
    const request = {
      headers: {
        HTTP_X_FORWARDED_FOR: '',
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    const ipInfo = ipware.getClientIP(request);
    expect(ipInfo.ip).toEqual('177.139.233.132');
    expect(ipInfo.routable).toBeTruthy();
  });

  it('should return correct public IPv4 missing HTTP_X_FORWARDED_FOR fallback on HTTP_X_REAL_IP', function () {
    const request = {
      headers: {
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    const ipInfo = ipware.getClientIP(request);
    expect(ipInfo.ip).toEqual('177.139.233.132');
    expect(ipInfo.routable).toBeTruthy();
  });

  it('should return correct public IPv4 X-Forwarded-For', function () {
    const request = {
      headers: {
        'X-Forwarded-For': '177.139.233.139',
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    const ipInfo = ipware.getClientIP(request);
    expect(ipInfo.ip).toEqual('177.139.233.139');
    expect(ipInfo.routable).toBeTruthy();
  });

  it('should return correct public IPv4 with custom headers precedence', function () {
    const request = {
      headers: {
        HTTP_X_FORWARDED_FOR:
          '192.168.255.182, 10.0.0.0, 127.0.0.1, 198.84.193.157, 177.139.233.139',
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    const ipInfo = ipware.getClientIP(request, {
      requestHeadersOrder: ['HTTP_X_REAL_IP', 'REMOTE_ADDR', 'HTTP_X_FORWARDED_FOR'],
    });
    expect(ipInfo.ip).toEqual('177.139.233.132');
    expect(ipInfo.routable).toBeTruthy();
  });
});

describe('Ipware', () => {
  let ipware: Ipware;
  const options: IpwareConfigOptions = {
    proxy: {
      enabled: true,
      order: 'right-most',
      proxyIpPrefixes: ['10.0.0.0', '172.16.0.0', '192.168.0.0'],
    },
    requestHeadersOrder: ['X-Forwarded-For', 'X-Real-IP'],
  };

  beforeAll(() => {
    ipware = new Ipware(options);
  });

  afterAll(() => {
    ipware = null;
  });

  it('should overwrite options', () => {
    expect(ipware.options.proxy.order).toEqual('right-most');
    expect(ipware.options.requestHeadersOrder.length).toEqual(options.requestHeadersOrder.length);
    expect(ipware.options.proxy.proxyIpPrefixes.length).toEqual(
      options.proxy.proxyIpPrefixes.length
    );
    expect(ipware.options.loopbackIpPrefixes.length).toEqual(IPWARE_LOOPBACK_PREFIX.length);
  });
});
