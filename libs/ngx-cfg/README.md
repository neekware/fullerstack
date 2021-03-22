# @fullerstack/ngx-cfg [![fullerstack-image]][fullerstack-link]

**An Angular Configuration Library - Handles local and remote configurations**

[![status-image]][status-link]
[![version-image]][version-link]
[![coverage-image]][coverage-link]
[![download-image]][download-link]

# Overview

**@fullerstack/ngx-cfg** attempts to streamline the app configuration while keeping it **DRY**.

# How to install

    npm i @fullerstack/ngx-cfg |OR| yarn add @fullerstack/ngx-cfg

# How to use

```typescript
// In your environment{prod,staging}.ts

import { ApplicationCfg, HttpMethod } from '@fullerstack/ngx-cfg';

export const environment: ApplicationCfg = {
  // production, staging or development
  production: true,
  // release version
  version: '1.0.0',
  // app name
  appName: 'WebApp',
  // one or more app specific field(s)
};
```

```typescript
// In your app.module.ts

import { CfgModule } from '@fullerstack/ngx-cfg';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CfgModule.forRoot(environment)],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

```typescript
// In your app.component.ts or (some.service.ts)

import { Component } from '@angular/core';
import { CfgService } from '@fullerstack/ngx-cfg';

@Component({
  selector: 'app-root',
})
export class AppComponent {
  title: string;

  constructor(public cfgService: CfgService) {
    this.title = this.cfgService.options.appName;
  }
}
```

# Advanced usage:

- Remote configuration

`@fullerstack/ngx-cfg` can also be used to fetch remote configuration prior to start of an Angular app.

```typescript
// In your environment{prod,staging}.ts

import { ApplicationCfg, HttpMethod } from '@fullerstack/ngx-cfg';

export const environment: ApplicationCfg = {
  // production, staging or development
  production: true,
  // release version
  version: '1.0.0',
  // app name
  appName: 'WebApp',
  // remote configuration (from the server prior to ng bootstrap)
  remoteCfg: {
    // server url to get remote config from (default = null)
    endpoint: '/api/cfg',
    // GET or POST http method to connect to remote server (default = get)
    method: HttpMethod.GET,
    // Max timeout of http connection to remote server (default = 2 seconds)
    timeout: 3,
    // http headers to include in http connection to remote server
    headers: { 'Content-Type': 'application/json' }
    // body of request when using http POST method (default = {})
    body: {
      // one or more app specific field(s)
    }
  }
  // one or more app specific field(s)
};
```

```typescript
// In your app.module.ts

import { CfgModule } from '@fullerstack/ngx-cfg';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CfgModule.forRoot(environment)],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

```typescript
// In your app.component.ts or (some.service.ts)

import { Component } from '@angular/core';
import { CfgService } from '@fullerstack/ngx-cfg';
import { merge } from 'lodash';

@Component({
  selector: 'app-root'
})
export class AppComponent {
  title: string;
  options = {};

  constructor(public cfgService: CfgService) {
    this.options = merge({ name: 'AppComponent' }, this.cfgService.options};
    const remoteCfgData = this.options.remoteData;
  }
}
```

# Running the tests

To run the tests against the current environment:

    npm run ci:all

# License

Released under a ([MIT](https://github.com/un33k/ngx-cfg/blob/master/LICENSE)) license.

# Version

X.Y.Z Version

    `MAJOR` version -- making incompatible API changes
    `MINOR` version -- adding functionality in a backwards-compatible manner
    `PATCH` version -- making backwards-compatible bug fixes

[status-image]: https://secure.travis-ci.org/un33k/ngx-cfg.png?branch=master
[status-link]: http://travis-ci.org/un33k/ngx-cfg?branch=master
[version-image]: https://img.shields.io/npm/v/@fullerstack/ngx-cfg.svg
[version-link]: https://www.npmjs.com/package/@fullerstack/ngx-cfg
[coverage-image]: https://coveralls.io/repos/un33k/ngx-cfg/badge.svg
[coverage-link]: https://coveralls.io/r/un33k/ngx-cfg
[download-image]: https://img.shields.io/npm/dm/@fullerstack/ngx-cfg.svg
[download-link]: https://www.npmjs.com/package/@fullerstack/ngx-cfg
[angular-image]: https://raw.githubusercontent.com/neekware/neekware-assets/master/images/angular-x30.png
[angular-link]: https://angular.io
[fullerstack-image]: https://raw.githubusercontent.com/neekware/neekware-assets/master/images/fullerstack-x32.png
[fullerstack-link]: https://github.com/neekware/fullerstack

# Sponsors

[Neekware Inc.](https://github.com/neekware)
