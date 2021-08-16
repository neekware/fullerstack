# Django IPware

**A node library for server applications retrieving user's real IP address**

[![status-image]][status-link]
[![version-image]][version-link]
[![coverage-image]][coverage-link]

# Overview

**Best attempt** to get client's IP address while keeping it **DRY**.

# Notice

There is not a good `out-of-the-box` solution against fake IP addresses, aka _IP Address Spoofing_.
You are encouraged to read the ([Advanced users](README.md#advanced-users)) section of this page and
use `trusted proxy prefixes` and/or `proxy count` features to match your needs, especially _if_ you are
planning to include `ipware` in any authentication, security or `anti-fraud` related architecture.

# How to install

`npm install @fullerstack/nax-ipware` OR `yarn add @fullerstack/nax-ipware`

# How to use

```typescript
 # In a view or a middleware where the `request` object is available

  // In your js file (e.g. app.js)
  import {Ipware} from '@fullerstack/nax-ipware';
  const ipware = new Ipware();
  app.use(function(req, res, next) {
    const clientIp = ipware.getClientIP(req)
    console.log(clientIp);
    // { ip: '177.139.100.100'', routable: true, trustedProxies: false }
    // do something with the ip address (e.g. pass it within the request)
    // note: ip address doesn't change often, so better cache it for performance
    next();
  });

 // Order of precedence is (Public, Private, Loopback, None)
```

# Advanced users:

### Precedence Order

The default meta precedence order is top to bottom. However, you may customize the order
by providing your own `IPWARE_META_PRECEDENCE_ORDER` by adding it to your project's settings.py

```typescript
 // The default meta precedence order
export const IPWARE_HEADERS_IP_ATTRIBUTES_ORDER: string[] = [
  'HTTP_X_FORWARDED_FOR', 'X_FORWARDED_FOR',  // <client>, <proxy1>, <proxy2>
  'HTTP_CLIENT_IP',
  'HTTP_X_REAL_IP',
  'HTTP_X_FORWARDED',
  'HTTP_X_CLUSTER_CLIENT_IP',
  'HTTP_FORWARDED_FOR',
  'HTTP_FORWARDED',
  'HTTP_VIA',
  'REMOTE_ADDR',
]
```

**`Alternatively`**, you can provide your custom request header meta precedence order when calling `getClientIP()`.

```typescript
  ipware.getClientIP(request, {
    requestHeadersOrder: ['X_FORWARDED_FOR'],
  });

  ipware.getClientIP(request, {
    requestHeadersOrder: ['X_FORWARDED_FOR', 'HTTP_X_FORWARDED_FOR'],
  });
```

### Private Prefixes

You may customize the prefixes to indicate an IP address is private. This is done by passing your
own `IPWARE_HEADERS_IP_ATTRIBUTES_ORDER` during creation of Ipware() object, or through each call.
IP addresses matching the following prefixes are considered `private` & are **not** publicly routable.

### Trusted Proxies

If your node server is behind one or more known proxy server(s), you can filter out unwanted requests
by providing the `trusted` proxy list bu calling `ipware.getClientIpByTrustedProxies(request, options);`.
In the following example, your load balancer (LB) can be seen as a `trusted` proxy.

```
 `Real` Client  <public> <---> <public> LB (Server) <private> <--------> <private> Django Server
                                                                   ^
                                                                   |
 `Fake` Client  <private> <---> <private> LB (Server) <private> ---^
```

```typescript
// In the above scenario, use your load balancer IP address as a way to filter out unwanted requests.
const ipInfo = ipware.getClientIpByTrustedProxies(request, {
  proxy: {
    enabled: true,
    proxyIpPrefixes: ['177.139.233.132']
  },
});

// If you have multiple proxies, simply add them to the list
const ipInfo = ipware.getClientIpByTrustedProxies(request, {
  proxy: {
    enabled: true,
    proxyIpPrefixes: ['177.139.233.100', '177.139.233.132']
  },
});

// For proxy servers with fixed sub-domain and dynamic IP, use the following pattern.
const ipInfo = ipware.getClientIpByTrustedProxies(request, {
  proxy: {
    enabled: true,
    proxyIpPrefixes: ['177.139.', '177.140']
  },
});

const ipInfo = ipware.getClientIpByTrustedProxies(request, {
  proxy: {
    enabled: true,
    proxyIpPrefixes: ['177.139.233.', '177.139.240']
  },
});

// For proxy by ip address, count will be ignored
const ipInfo = ipware.getClientIpByTrustedProxies(request, {
  proxy: {
    enabled: true,
    proxyIpPrefixes: ['177.139.', '177.140'],
    proxyCount: 2 // will be ignored
  },
});
```

### Proxy Count

If your Django server is behind a `known` number of proxy server(s), you can filter out unwanted requests
by providing the `number` of proxies when calling `ipware.getClientIpByProxyCount(request, options);`.
In the following example, your load balancer (LB) can be seen as the `only` proxy.

```
 `Real` Client  <public> <---> <public> LB (Server) <private> <--------> <private> Django Server
                                                                   ^
                                                                   |
                                       `Fake` Client  <private> ---^
```

```typescript
// In the above scenario, the total number of proxies can be used as a way to filter out unwanted requests.
const ipInfo = ipware.getClientIpByProxyCount(request, {
  proxy: {
    enabled: true,
    proxyCount: 1
  },
});

// For proxy by count, proxy prefixes will be ignored
const ipInfo = ipware.getClientIpByProxyCount(request, {
  proxy: {
    enabled: true,
    proxyCount: 1,
    proxyIpPrefixes: ['177.139.233.'] // will be ignored
  },
});
```

### Originating Request

If your proxy server is configured such that the right-most IP address is that of the originating client, you
can indicate `right-most` as your `order` when calling any api.
Please note that the [de-facto](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For) standard
for the originating client IP address is the `left-most` as per `client, proxy1, proxy2`.

# Running the tests

To run the tests against the current environment:

    yarn nx test nax-ipware

# License

Released under a ([MIT](https://raw.githubusercontent.com/neekware/fullerstack/main/LICENSE)) license.

# Version

X.Y.Z Version

    `MAJOR` version -- making incompatible API changes
    `MINOR` version -- adding functionality in a backwards-compatible manner
    `PATCH` version -- making backwards-compatible bug fixes

[status-image]: https://github.com/neekware/fullerstack/actions/workflows/ci.yml/badge.svg
[status-link]: https://github.com/neekware/fullerstack/actions/workflows/ci.yml
[version-image]: https://img.shields.io/npm/v/@fullerstack/agx-store.svg
[version-link]: https://www.npmjs.com/package/@fullerstack/agx-store
[coverage-image]: https://coveralls.io/repos/neekware/fullerstack/badge.svg
[coverage-link]: https://coveralls.io/r/neekware/fullerstack
[download-image]: https://img.shields.io/npm/dm/@fullerstack/agx-store.svg
[download-link]: https://www.npmjs.com/package/@fullerstack/agx-store

# Sponsors

[Neekware Inc.](http://neekware.com)
