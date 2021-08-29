# @fullerstack/ngx-config <img style="margin-bottom: -6px" width="30" src="https://raw.githubusercontent.com/neekware/fullerstack/main/libs/agx-assets/src/lib/images/tech/fullerstack-x250.png">

**An Angular Configuration Library - Handles local and remote configurations**

[![status-image]][status-link]
[![version-image]][version-link]
[![coverage-image]][coverage-link]
[![download-image]][download-link]

# Overview

## Description

In general, passing the `environment.ts` into your publishable libraries may not be possible unless a relative path is used. However, relative paths will break the dependency graph of your mono-repo stack. This is due to the fact that the libs should not have any knowledge of the applications using them. If so, that will constitute a circular dependency.

Till `Angular` natively supports something like, `import { environment } from '@angular/core/environment'`, your publishable libs must implement an `InjectionToken` to receive the `environment` object and provide it with an `APP_INITIALIZER` directly during the app's bootstrapping.

Alternatively, you can have a simple lib such as `@fullerstack/ngx-config` to receive the `environment` object and provide it to all other publishable libs via an injectable service such as `ConfigService`.

**@fullerstack/ngx-config** attempts to streamline the sharing of the content of the `environment.ts` while promoting DRY **DRY**.

# How to install

    npm i @fullerstack/ngx-config |OR| yarn add @fullerstack/ngx-config

# How to use

```typescript
// In your environment{prod,staging}.ts

import { ApplicationConfig, HttpMethod } from '@fullerstack/ngx-config';

export const environment: Readonly<ApplicationConfig> = {
  // production, staging or development
  production: false,
  // one or more app specific field(s)
  version: '1.0.0',
};
```

```typescript
// In your app.module.ts

import { ConfigModule } from '@fullerstack/ngx-config';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ConfigModule.forRoot(environment)],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

```typescript
// In your app.component.ts or (some.service.ts)

import { Component } from '@angular/core';
import { ConfigService } from '@fullerstack/ngx-config';

@Component({
  selector: 'fullerstack-root',
})
export class AppComponent {
  title: string;

  constructor(public config: ConfigService) {
    this.title = this.config.options.appName;
  }
}
```

# Advanced usage:

- Remote configuration

`@fullerstack/ngx-config` can also be used to fetch remote configuration prior to start of an Angular app.

```typescript
// In your environment{prod,staging}.ts

import { ApplicationConfig, HttpMethod } from '@fullerstack/ngx-config';

export const environment: ApplicationConfig = {
  // production, staging or development
  production: true,
  // release version
  version: '1.0.0',
  // remote configuration (from the server prior to ng bootstrap)
  remoteConfig: {
    // server url to get remote config from (default = null)
    endpoint: '/api/config',
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

import { ConfigModule } from '@fullerstack/ngx-config';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ConfigModule.forRoot(environment)],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

```typescript
// In your app.component.ts or (some.service.ts)

import { Component } from '@angular/core';
import { ConfigService } from '@fullerstack/ngx-config';
import { merge } from 'lodash';

@Component({
  selector: 'fullerstack-root'
})
export class AppComponent {
  title: string;
  options = {};

  constructor(public config: ConfigService) {
    this.options = merge({ name: 'AppComponent' }, this.config.options};
    const remoteConfigData = this.options.remoteData;
  }
}
```

# License

Released under a ([MIT](https://github.com/un33k/ngx-config/blob/master/LICENSE)) license.

# Version

X.Y.Z Version

    `MAJOR` version -- making incompatible API changes
    `MINOR` version -- adding functionality in a backwards-compatible manner
    `PATCH` version -- making backwards-compatible bug fixes

[status-image]: https://github.com/neekware/fullerstack/actions/workflows/ci.yml/badge.svg
[status-link]: https://github.com/neekware/fullerstack/actions/workflows/ci.yml
[version-image]: https://img.shields.io/npm/v/@fullerstack/ngx-config.svg
[version-link]: https://www.npmjs.com/package/@fullerstack/ngx-config
[coverage-image]: https://coveralls.io/repos/neekware/fullerstack/badge.svg
[coverage-link]: https://coveralls.io/r/neekware/fullerstack
[download-image]: https://img.shields.io/npm/dm/@fullerstack/ngx-config.svg
[download-link]: https://www.npmjs.com/package/@fullerstack/ngx-config

# Sponsors

[Neekware Inc.](https://github.com/neekware)
