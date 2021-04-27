# @fullerstack/ngx-gtag <img style="margin-bottom: -6px" width="30" src="../../apps/fullerstack/src/assets/images/fullerstack-x250.png">

**A simple gTag module for Angular applications**

[![status-image]][status-link]
[![version-image]][version-link]
[![coverage-image]][coverage-link]
[![download-image]][download-link]

# Overview

## Description

Tracking application page view and events for the purpose of monitoring trends and recalibrating your application is great.
This library helps you achieving just that via Google's Analytics.

**@fullerstack/ngx-gtag** attempts to streamline the analytics of your application, while promoting DRY **DRY**.

# How to install

    npm i @fullerstack/ngx-gtag |OR| yarn add @fullerstack/ngx-gtag

# How to use

```typescript
// In your environment{prod,staging}.ts

import { ApplicationConfig } from '@fullerstack/ngx-config';
import { LogLevels } from '@fullerstack/ngx-logger';

export const environment: ApplicationConfig = {
  // app name
  appName: '@fullerstack/ngx-gtag',
  production: true,

  log: {
    // log level (application-wide)
    level: LogLevels.debug,
  },
  gtag: {
    // ability to disable tracking (ex; dev / staging mode)
    isEnabled: true,
    // google tracking ID for your application domain
    trackingId: 'UA-XXXXXX-Y',
    // track page view on start (on route changes)
    routeChangeTracking: true,
  },
};
```

```typescript
// In your app.module.ts

import { CfgModule } from '@fullerstack/ngx-config';
import { LoggerModule } from '@fullerstack/ngx-logger';
import { GTagModule } from '@fullerstack/ngx-gtag';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CfgModule.forRoot(environment), // make the environment injectable
    LoggerModule,
    GTagModule,
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
} from '@fullerstack/ngx-config';
import { LogService } from '@fullerstack/ngx-logger';
import { GTagService } from '@fullerstack/ngx-gtag';

@Component({
  selector: 'app-root',
  template: `<h1>Welcome to {{ title }}!</h1>`,
})
export class AppComponent {
  title = 'Fullerstack';
  constructor(
    readonly config: ConfigService,
    readonly logger: LogService,
    readonly gtag: GTagService
  ) {
    this.title = this.config.options.appName;
    this.logger.info('AppComponent loaded ...');
    // all route changes are tracked automatically from now on
    this.trackDetailedEvent();
    this.trackEvent();
  }

  trackDetailedEvent() {
    // example of event with params
    gtag.trackEvent('home-page', {
      event_category: 'SEO',
      event_label: 'Page loaded, anonymous user',
    });
  }

  trackEvent() {
    // example of event without params
    gtag.trackEvent('home-page-visit');
  }
}
```

# Advanced usage

```typescript
// In your environment{prod,staging}.ts

import { ApplicationConfig, TargetPlatform } from '@fullerstack/ngx-config';
import { LogLevels } from '@fullerstack/ngx-logger';

export const environment: ApplicationConfig = {
  appName: '@fullerstack/ngx-gtag',
  // ...
  gtag: {
    // ability to disable tracking (ex; dev / staging mode)
    isEnabled: true,
    // google tracking ID for domain
    trackingId: 'UA-XXXXXX-Y',
    // track page view on start (on route change)
    routeChangeTracking: false,
  },
};
```

```typescript
// track page view manually with specific options
gtag.trackPageView({
  page_path: '/',
  page_title: 'Home Page',
  page_location: 'http://fullerstack.net'
});

// or with default options
gtag.trackPageView();

// where defaults are:
// page_path = router.url
// page_title = [active-route.data.title] | [environment.appName]
const routes: Routes = [
  { path: '', component: HomeComponent, { title: 'Home page direct' }},
  { path: 'home', component: HomeComponent, data: { title: 'Home page' } }
];
```

# License

Released under a ([MIT](https://raw.githubusercontent.com/neekware/fullerstack/main/LICENSE)) license.

# Version

X.Y.Z Version

    `MAJOR` version -- making incompatible API changes
    `MINOR` version -- adding functionality in a backwards-compatible manner
    `PATCH` version -- making backwards-compatible bug fixes

[status-image]: https://secure.travis-ci.org/neekware/fullerstack.png?branch=main
[status-link]: http://travis-ci.org/neekware/fullerstack?branch=main
[version-image]: https://img.shields.io/npm/v/@fullerstack/ngx-gtag.svg
[version-link]: https://www.npmjs.com/package/@fullerstack/ngx-gtag
[coverage-image]: https://coveralls.io/repos/neekware/fullerstack/badge.svg
[coverage-link]: https://coveralls.io/r/neekware/fullerstack
[download-image]: https://img.shields.io/npm/dm/@fullerstack/ngx-gtag.svg
[download-link]: https://www.npmjs.com/package/@fullerstack/ngx-gtag
