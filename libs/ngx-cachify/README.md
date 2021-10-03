# @fullerstack/ngx-cachify <img style="margin-bottom: -6px" width="30" src="https://raw.githubusercontent.com/neekware/fullerstack/main/libs/agx-assets/src/lib/images/tech/fullerstack-x250.png">

**A simple Angular caching store that can also fetch and cache http requests**

[![status-image]][status-link]
[![version-image]][version-link]
[![coverage-image]][coverage-link]
[![download-image]][download-link]

# Overview

## Description

This library helps implementing a single source of truth with http fetch capabilities.

**@fullerstack/ngx-cachify** attempts to streamline the fetching and caching http request, with immutability of data of your Angular application, while promoting DRY **DRY**.

# How to install

    npm i @fullerstack/ngx-cachify |OR| yarn add @fullerstack/ngx-cachify

# How to use

```typescript
// In your environment{prod,staging}.ts

import { ApplicationConfig } from '@fullerstack/ngx-config';
import { CachifyConfig, CachifyFetchPolicy } from '@fullerstack/ngx-cachify';

const cachify: CachifyConfig = {
  // disable caching altogether (default: false)
  disabled: false,

  // which policies to enable (default: all enabled) [refer to: advanced usage]
  policies: [CachifyFetchPolicy.CacheFirst],

  // freeze state (default: true)
  immutable: true,

  // invalidate cache in `ttl` seconds (default: 60 seconds)
  ttl: 30,
} as const;

// setup application environment
export const environment: Readonly<ApplicationConfig> = {
  version: '0.0.1',
  production: true,
  appName: 'FullerStack',
  cachify,
  // ...
} as const;
```

```typescript
// In your app.module.ts

import { CfgModule } from '@fullerstack/ngx-config';
import { CachifyModule, CachifyInterceptor } from '@fullerstack/ngx-cachify';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CfgModule.forRoot(environment), // make the environment injectable
    CachifyModule,
    // ...
  ],
  providers: [
    // ...
    {
      provide: HTTP_INTERCEPTORS, // provider is of type interceptor
      useClass: CachifyInterceptor, // enable cachify interceptor
      multi: true // allow `next` to be called in the intercept `chain`
    },
    // ...
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

```typescript
// In your app.component.ts

import { Component } from '@angular/core';
import {
  ConfigService,
  DefaultApplicationConfig,
  makeCachifyContext,
  CachifyFetchPolicy,
  CACHIFY_AUTO_KEY } from '@fullerstack/ngx-config';
import { CachifyService } from '@fullerstack/ngx-cachify';

@Component({
  selector: 'avidtrader-root',
  template: `<h1>Welcome to {{ title }}!</h1>`,
})
export class AppComponent {
  title = 'Fullerstack';
  constructor(
    readonly config: ConfigService,
    readonly cachify: CachifyService
  ) {
      // initial request, no cache, so makes a http call
      this.fetchSomeData();

      // call is within ttl, if the response of the initial call is received, it is shared
      // refer to network fetch policy in the `advanced usage` section
      setTimeout(() => {
          this.fetchSomeData();
      }, 2900) // 2.9 seconds

      // ttl of the initial call is expired, make a new call, cache and return the response
      // refer to network fetch policy in the `advanced usage` section
      setTimeout(() => {
          this.fetchSomeData();
      }, 3100) // 3.1 seconds
  }

  // fetch some specific data from the api
  fetchSomeData() {

    // build a context for cachify interceptor
    const context: CachifyContextMeta = makeCachifyContext({
      policy: CachifyFetchPolicy.CacheFirst
      ttl: 60,
      key: CACHIFY_AUTO_KEY // auto generate a unique cache key based on given url/params/headers/body
    });

    // make http call passing the context in
    this.httpClient.get('/api/some-data', { context }).pipe(first()).subscribe(data => {
      console.log(data)
    });
  }
}
```

# Advanced Usage

### Available Network Policies

By default all the following policies are enabled. You can also only enable a limited number of polices as per your requirements.

```typescript
export enum CachifyFetchPolicy {
  // cache-off: This fetch policy will never return your initial data from the cache. Instead it will
  // always make a network request. Unlike the network-only policy, it will not write any data to
  // the cache after the query completes.  This fetch policy strives to keep client and server state in-sync
  // at all time.  Usage: JWT token request.
  CacheOff = 'cache-off',

  // cache-only: This fetch policy will never execute a network query. Instead it will always
  // try reading from the cache. If the query data does not exist in the cache then an error
  // will be thrown. This fetch policy allows for local client cache interaction without making
  // any network requests. This fetch policy strives to keep your app fast at the cost of possible
  // inconsistency with the server. Usage: Loading the app while in Airplane mode
  CacheOnly = 'cache-only',

  // cache-first: This fetch policy always tries reading data from the cache first. If the
  // requested data is found in cache then it will be returned. It will only fetch from the network
  // if a cached result is not available. This fetch policy strives to speed up the rendering of
  // components, by minimizing the number of network requests. Usage: Defer http responses of a long list
  CacheFirst = 'cache-first',

  // network-only: This fetch policy will never return the initial data from the cache.
  // Instead it will always executes a network request to the server, then saves a copy of it in cache.
  // This fetch policy strives to optimize for data consistency with the server, but at the cost of an
  // fresh response to the user when one is available. Usage: User authentication request
  NetworkOnly = 'network-only',

  // network-first: This fetch policy will make a network request,
  // Instead it will always executes a network request to the server. This fetch policy
  // strives to optimize for data consistency with the server, but at the cost of an instant
  // response to the user when one is available.
  NetworkFirst = 'network-first',

  // cache-and-network: This fetch policy will first try to read data from the cache.
  // If the requested data is found in cache then it will be returned. However, regardless
  // the cache data, this fetchPolicy will always execute a network query.
  // This fetch policy strives to optimize for a quick response while also trying to keep
  // cached data consistent with the server data at the cost of extra network requests.
  CacheAndNetwork = 'cache-and-network',
}
```

### Custom cache key per each call

Should you require a custom key make specifically for a http call, you can create such key and pass it through as follow.

```typescript
// create a cache key based on a given dataset, in a fixed order
const cacheKey = new OrderedStatePath()
    .append('user', 1000)
    .append('portfolio', 2)
    .append('symbols', 'all')
    .toString();

const context: CachifyContextMeta = makeCachifyContext({
    policy: CachifyFetchPolicy.NetworkFirst,
    ttl: 60,
    key: cacheKey // 'user.[1000].portfolio.[2].symbols.[all]' (not auto-generated)
});

this.httpClient.get('/api/some-data', { context }).pipe(first()).subscribe(data => {
  console.log(data)
});
```

# License

Released under a ([MIT](https://raw.githubusercontent.com/neekware/fullerstack/main/LICENSE)) license.

# Version

X.Y.Z Version

    `MAJOR` version -- making incompatible API changes
    `MINOR` version -- adding functionality in a backwards-compatible manner
    `PATCH` version -- making backwards-compatible bug fixes

[status-image]: https://github.com/neekware/fullerstack/actions/workflows/ci.yml/badge.svg
[status-link]: https://github.com/neekware/fullerstack/actions/workflows/ci.yml
[version-image]: https://img.shields.io/npm/v/@fullerstack/ngx-cachify.svg
[version-link]: https://www.npmjs.com/package/@fullerstack/ngx-cachify
[coverage-image]: https://coveralls.io/repos/neekware/fullerstack/badge.svg
[coverage-link]: https://coveralls.io/r/neekware/fullerstack
[download-image]: https://img.shields.io/npm/dm/@fullerstack/ngx-cachify.svg
[download-link]: https://www.npmjs.com/package/@fullerstack/ngx-cachify
