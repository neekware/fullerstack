# NAX IPware (A Node Application Agnostic Library)

**A node library for server applications retrieving user's real IP address**

[![status-image]][status-link]
[![version-image]][version-link]
[![coverage-image]][coverage-link]

# Overview

**Best attempt** to get client's IP address while keeping it **DRY**.

# Notice

There is not a good `out-of-the-box` solution against fake IP addresses, aka _IP Address Spoofing_.
You are encouraged to read the [Advanced users](README.md#advanced-users) section of this page and
use `trusted proxy prefixes` and/or `proxy count` features to match your needs, especially _if_ you are
planning to include `ipware` in any authentication, security or `anti-fraud` related architecture.
You are also encouraged to use ip filtering alongside `ipware` for optimal result.

# How to install

`npm install @fullerstack/nax-ipware` OR `yarn add @fullerstack/nax-ipware`

# How to use

```typescript
 # In a view or a middleware where the `request` object is available

  // In your js file (e.g. app.js)
  import {Ipware} from '@fullerstack/nax-ipware';
  const ipware = new Ipware();
  app.use(function(req, res, next) {
    req.ipInfo = ipware.getClientIP(req)
    // { ip: '177.139.100.100', isPublic: true, isRouteTrusted: false }
    // do something with the ip address (e.g. pass it down through the request)
    // note: ip address doesn't change often, so better cache it for performance,
    // you should have distinct session ID for public and anonymous users to cache the ip address
    next();
  });
```

# Advanced users:

|        Flags ⇩ | ⇩ Description                                                                                                                                                                                                                                                                                                                                                  |
| -------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|      `count` ⇨ | : Total number of expected proxies (pattern: `client, proxy1, ..., proxy2`)<br>: if `count = 0` then `client`<br>: if `count = 1` then `client, proxy1`<br>: if `count = 2` then `client, proxy1, proxy2` <br>: if `count = 3` then `client, proxy1, proxy2 proxy3`                                                                                            |
|  `proxyList` ⇨ | : List of trusted proxies (pattern: `client, proxy1, ..., proxy2`)<br>: if `proxyList = ['10.1.']` then `client, 10.1.1.1` OR `client, proxy1, 10.1.1.1`<br>: if `proxyList = ['10.1', '10.2.']` then `client, 10.1.1.1` OR `client, proxy1, 10.2.2.2`<br>: if `proxyList = ['10.1', '10.2.']` then `client, 10.1.1.1 10.2.2.2` OR `client, 10.1.1.1 10.2.2.2` |
| `publicOnly` ⇨ | : Returns only public and internet routable IP or null                                                                                                                                                                                                                                                                                                         |

|     Output Field ⇩ | ⇩ Description                                                                    |
| -----------------: | :------------------------------------------------------------------------------- |
|             `ip` ⇨ | : IP address of the client                                                       |
|       `isPublic` ⇨ | : If `ip` is public and internet routable, `true`, else `false`                  |
| `isRouteTrusted` ⇨ | : If proxy `count` and/or `proxyList` provided and matched, `true`, else `false` |

### Precedence Order

The client IP address can be found in one or more request headers attributes. The lookup order is top to bottom and the default attributes are as follow.

```typescript
// The default meta precedence order
export const IPWARE_HEADERS_IP_ATTRIBUTES_ORDER: string[] = [
  'X_FORWARDED_FOR', // Load balancers or proxies such as AWS ELB (default client is `left-most` [`<client>, <proxy1>, <proxy2>`])
  'HTTP_X_FORWARDED_FOR', // Similar to X_FORWARDED_TO
  'HTTP_CLIENT_IP', // Standard headers used by providers such as Amazon EC2, Heroku etc.
  'HTTP_X_REAL_IP',
  'HTTP_X_FORWARDED',
  'HTTP_X_CLUSTER_CLIENT_IP',
  'HTTP_FORWARDED_FOR',
  'HTTP_FORWARDED',
  'HTTP_VIA',
  'X-REAL-IP', // NGINX
  'X-CLUSTER-CLIENT-IP', // Rackspace Cloud Load Balancers
  'X_FORWARDED',
  'FORWARDED_FOR',
  'CF-CONNECTING-IP', // CloudFlare
  'TRUE-CLIENT-IP', // CloudFlare Enterprise,
  'FASTLY-CLIENT-IP', // Firebase, Fastly
  'FORWARDED',
];
```

You can customize the order by providing your own list during initialization when calling `new Ipware(options)`.
You can pass your custom list on every call, when calling the api to fetch the ip.

```typescript
  ipware.getClientIP(request, {
    requestHeadersOrder: ['X_FORWARDED_FOR'],
  });

  ipware.getClientIP(request, {
    requestHeadersOrder: ['X_FORWARDED_FOR', 'HTTP_X_FORWARDED_FOR'],
  });

  // ... etc
```

### Private Prefixes

A default list that holds the private IP prefixes is called `IPWARE_PRIVATE_IP_PREFIX`.
This list is used to determine if an IP address is `public` or `private`.

It is recommended that you send us any `private` IP addresses that we have missed, to be included in the default list.

```typescript
export const IPWARE_PRIVATE_IP_PREFIX: string[] = [
  '0.', // messages to software
  '10.', // class A private block
  ...[
    // carrier-grade NAT (IPv4)
    '100.64.',
    '100.65.',
    '100.66.',
    '100.67.',
  ],
  // many more prefixes
]
```

You can customize the private IP prefixes by providing your own list during initialization when calling `new Ipware(options)`.
You can pass your custom list on every call, when calling the api to fetch the ip.

```typescript
  ipware.getClientIP(request, {
    privateIpPrefixes: ['0.', '10.'], // your own private IP addresses
  });

  ipware.getClientIP(request, {
    privateIpPrefixes: ['0.', '10.', '2001:10:'], // your own private IP addresses
  });

  // ... etc
```

### Trusted Proxies

If your node server is behind one or more known proxy server(s), you can filter out unwanted requests
by providing a `trusted proxy list`, or a known proxy `count`.

You can customize the proxy IP prefixes by providing your own list during initialization when calling `new Ipware(options)`.
You can pass your custom list on every call, when calling the proxy-aware api to fetch the ip.

```typescript
// In the above scenario, use your load balancer IP address as a way to filter out unwanted requests.
const ipInfo = ipware.getClientIP(request, {
  proxy: {
    proxyList: ['177.139.233.132']
  },
});

// If you have multiple proxies, simply add them to the list
const ipInfo = ipware.getClientIP(request, {
  proxy: {
    proxyList: ['177.139.233.100', '177.139.233.132']
  },
});

// For proxy servers with fixed sub-domain and dynamic IP, use the following pattern.
const ipInfo = ipware.getClientIP(request, {
  proxy: {
    proxyList: ['177.139.', '177.140']
  },
});

const ipInfo = ipware.getClientIP(request, {
  proxy: {
    proxyList: ['177.139.233.', '177.139.240']
  },
});

// For proxy by ip address and count
const ipInfo = ipware.getClientIP(request, {
  proxy: {
    proxyList: ['177.139.', '177.140'],
    count: 2
  },
});

// For strict mode, we either return the ip that matches the proxy info, or none
const ipInfo = ipware.getClientIP(request, {
  proxy: {
    strict: true,
    proxyList: ['177.139.233.', '177.139.240']
  },
});

```

In the following `example`, your public load balancer (LB) can be seen as a `trusted` proxy.

```
`Real` Client <public> <-> <public> LB (Server) <private> <-----> <private> Node Server
                                                             ^
                                                             |
`Fake` Client <private> <-> <private> LB (Server) <private> -+
```

### Proxy Count

If your node server is behind a `known` number of proxies, but your deploy on multiple providers and don't want to track proxy IPs, you still can filter out unwanted requests by providing proxy `count`.

You can customize the proxy count by providing your `count` during initialization when calling `new Ipware(options)`.
You can pass your custom `count` on every call, when calling the proxy-aware api to fetch the ip.

```typescript
// In the above scenario, the total number of proxies can be used as a way to filter out unwanted requests.
const ipInfo = ipware.getClientIP(request, {
  proxy: {
    count: 1
  },
});

// For proxy by count, and proxy list
const ipInfo = ipware.getClientIP(request, {
  proxy: {
    count: 1
    proxyList: ['177.139.233.']
  },
});

// For strict mode, we either return the ip that matches the proxy info, or none
const ipInfo = ipware.getClientIP(request, {
  proxy: {
    strict: true,
    count: 1
  },
});

```

In the following `example`, your public load balancer (LB) can be seen as the `only` proxy.

```
`Real` Client <public> <-> <public> LB (Server) <private> <---> <private> Node Server
                                                            ^
                                                            |
                                `Fake` Client  <private> ---+
```

### Public IP Address ONLY (routable on the internet)

```typescript
// For publicOnly mode, we either return the first public IP address based on order or none
const ipInfo = ipware.getClientIP(request, {
  publicOnly: true
});

```

### Originating Request

If your proxy server has a `custom` configuration where the `right-most` IP address is that of the originating client, you
can indicate `right-most` as the `order` when calling any api.
Please note that the [de-facto](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For) standard
for the originating client IP address is the `left-most` as per `client, proxy1, proxy2`, and the `right-most` proxy is the most
trusted proxy.

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
