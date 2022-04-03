/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { Ipware } from './ipware';
import {
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
    expect(ipware.options.proxy.proxyList.length).toEqual(0);
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
});

describe('Ipware: IPv4', () => {
  let ipware: Ipware;

  beforeAll(() => {
    ipware = new Ipware();
  });

  afterAll(() => {
    ipware = null;
  });

  it('should return public ip via proxy - precedent headers attribute order', function () {
    const request = {
      headers: {
        HTTP_X_FORWARDED_FOR: '177.139.22.20, 177.139.233.21, 177.139.233.22, 177.139.233.139',
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    const ipInfo = ipware.getClientIP(request);
    expect(ipInfo.ip).toEqual('177.139.22.20');
    expect(ipInfo.isPublic).toBeTruthy();
  });

  it('should skip invalid ips received via proxy, fallback onto the next headers attribute', function () {
    const request = {
      headers: {
        HTTP_X_FORWARDED_FOR: 'unknown, 177.139.233.21, 177.139.233.22, 177.139.233.139',
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    const ipInfo = ipware.getClientIP(request);
    expect(ipInfo.ip).toEqual('177.139.233.132');
    expect(ipInfo.isPublic).toBeTruthy();
  });

  it('should return a private client ips received via proxy, of publicOnly is not specified', function () {
    const request = {
      headers: {
        HTTP_X_FORWARDED_FOR: '10.10.10.10, 177.139.233.21, 177.139.233.22, 177.139.233.139',
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    const ipInfo = ipware.getClientIP(request);
    expect(ipInfo.ip).toEqual('10.10.10.10');
    expect(ipInfo.isPublic).toBeFalsy();
  });

  it('should skip a private client ips received via proxy, of publicOnly is true', function () {
    const request = {
      headers: {
        HTTP_X_FORWARDED_FOR: '10.10.10.10, 177.139.233.21, 177.139.233.22, 177.139.233.139',
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    const ipInfo = ipware.getClientIP(request, {
      publicOnly: true,
    });
    expect(ipInfo.ip).toEqual('177.139.233.132');
    expect(ipInfo.isPublic).toBeTruthy();
  });

  it('should return correct public from HTTP_X_FORWARDED_FOR with multiple ips, with right-most', function () {
    const request = {
      headers: {
        HTTP_X_FORWARDED_FOR: '177.139.233.137, 177.139.233.138, 177.139.233.139',
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    const ipInfo = ipware.getClientIP(request, {
      proxy: { order: 'right-most', proxyList: ['177.139.233.'] },
    });
    expect(ipInfo.ip).toEqual('177.139.233.139');
    expect(ipInfo.isPublic).toBeTruthy();
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
    expect(ipInfo.ip).toEqual('192.168.255.182');
    expect(ipInfo.isPublic).toBeFalsy();
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
    expect(ipInfo.isPublic).toBeTruthy();
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
    expect(ipInfo.isPublic).toBeTruthy();
  });

  it('should return correct private IPv4 HTTP_X_FORWARDED_FOR with singleton private ip', function () {
    const request = {
      headers: {
        HTTP_X_FORWARDED_FOR: '192.168.255.182',
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    const ipInfo = ipware.getClientIP(request);
    expect(ipInfo.ip).toEqual('192.168.255.182');
    expect(ipInfo.isPublic).toBeFalsy();
  });

  it('should skip private IPv4 HTTP_X_FORWARDED_FOR with singleton private ip, return the next public', function () {
    const request = {
      headers: {
        HTTP_X_FORWARDED_FOR: '192.168.255.182',
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    const ipInfo = ipware.getClientIP(request, { publicOnly: true });
    expect(ipInfo.ip).toEqual('177.139.233.132');
    expect(ipInfo.isPublic).toBeTruthy();
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
    expect(ipInfo.isPublic).toBeTruthy();
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
    expect(ipInfo.isPublic).toBeTruthy();
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
    expect(ipInfo.isPublic).toBeTruthy();
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
    expect(ipInfo.isPublic).toBeTruthy();
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
    expect(ipInfo.isPublic).toBeTruthy();
  });

  it('should return correct public from HTTP_X_FORWARDED_FOR with multiple ips and valid proxy count', function () {
    const request = {
      headers: {
        HTTP_X_FORWARDED_FOR:
          '192.168.255.182, 10.0.0.0, 127.0.0.1, 198.84.193.157, 177.139.233.139',
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    const ipInfo = ipware.getClientIP(request, { proxy: { count: 4 } });
    expect(ipInfo.ip).toEqual('192.168.255.182');
    expect(ipInfo.isPublic).toBeFalsy();
  });

  it('should return loopback public from HTTP_X_FORWARDED_FOR with multiple ips and invalid proxy count', function () {
    const request = {
      headers: {
        HTTP_X_FORWARDED_FOR: '192.168.255.182, 10.0.0.0, 198.84.193.157, 177.139.233.139',
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    const ipInfo = ipware.getClientIP(request, { proxy: { count: 5 } });
    expect(ipInfo.ip).toEqual('127.0.0.1');
  });
});

describe('Ipware', () => {
  let ipware: Ipware;
  const options: IpwareConfigOptions = {
    proxy: {
      order: 'right-most',
      proxyList: ['172.16.', '172.16.1.', '172.16.2.0'],
    },
    requestHeadersOrder: ['X-Forwarded-For', 'X-Real-IP'],
    publicOnly: true,
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
    expect(ipware.options.proxy.proxyList.length).toEqual(options.proxy.proxyList.length);
    expect(ipware.options.loopbackIpPrefixes.length).toEqual(IPWARE_LOOPBACK_PREFIX.length);
  });

  it('should return no ip address custom headers precedence and publicOnly set to true', function () {
    const request = {
      headers: {
        HTTP_X_FORWARDED_FOR: '192.168.255.182, 10.0.0.0, 127.0.0.1, 198.84.193.157, 172.16..0',
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    const ipInfo = ipware.getClientIP(request, {
      requestHeadersOrder: ['HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'],
    });
    expect(ipInfo).toBeNull();
  });

  it('should return private ip address custom headers precedence and publicOnly set to false', function () {
    const request = {
      headers: {
        HTTP_X_FORWARDED_FOR: '192.168.255.182, 10.0.0.0, 127.0.0.1, 198.84.193.157, 172.16.0',
        HTTP_X_REAL_IP: '177.139.233.132',
        REMOTE_ADDR: '177.139.233.133',
      },
    };
    const ipInfo = ipware.getClientIP(request, {
      requestHeadersOrder: ['HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'],
      publicOnly: false,
      proxy: { order: 'left-most' },
    });
    expect(ipInfo.ip).toEqual('192.168.255.182');
    expect(ipInfo.isPublic).toBeFalsy();
  });
});
