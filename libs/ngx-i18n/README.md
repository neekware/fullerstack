# @fullerstack/ngx-i18n <img style="margin-bottom: -6px" width="30" src="https://raw.githubusercontent.com/neekware/fullerstack/main/libs/agx-assets/src/lib/images/tech/fullerstack-x250.png">

**A simple translation library for Angular applications**

[![status-image]][status-link]
[![version-image]][version-link]
[![coverage-image]][coverage-link]
[![download-image]][download-link]

# Overview

## Description

Dealing with translation can be very hard especially if you don't want to publish different version of your application for each language you support.
In that case `ngx-translate` is a great library to use. This packages encapsulates the `ngx-translate` library and make it a bit easier to deploy.

**@fullerstack/ngx-i18n** attempts to streamline the translation of your application, while promoting DRY **DRY**.

# How to install

    npm i @fullerstack/ngx-i18n |OR| yarn add @fullerstack/ngx-i18n

# How to use

```typescript
// In your environment{prod,staging}.ts

import { ApplicationCfg } from '@fullerstack/ngx-config';

export const environment: ApplicationCfg = {
  production: false,
  i18n: {
    // available languages
    availableLanguages: {
      en: {
        name: 'English',
        locale: '@angular/common/locales/en',
        localeExtra: '@angular/common/locales/extra/en',
      },
      fr: {
        name: 'Français',
        locale: '@angular/common/locales/fr',
        localeExtra: '@angular/common/locales/extra/fr',
      },
      de: {
        name: 'Deutsch',
        locale: '@angular/common/locales/de',
        localeExtra: '@angular/common/locales/extra/de',
      },
    },
    // enabled languages
    enabledLanguages: [
      // order is important
      'en',
      'fr',
    ],
    // cache busting hash
    // bump when you change any file in /assets/i18n/*.json
    cacheBustingHash: 'v0.0.1',
  },
};
```

```typescript
// In your app.component.ts

import { ConfigModule } from '@fullerstack/ngx-config';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ConfigModule.forRoot(environment), // make the environment injectable
    I18nModule.forRoot(), // use forChild() for lazy loaded modules
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

```typescript
// In your app.component.ts
import { Component } from '@angular/core';
import { I18nService } from '@fullerstack/ngx-i18n';

@Component({
  selector: 'avidtrader-root',
  template: `<h1>{{ 'COMMON.WELCOME' | translate }} to {{ title }}!</h1>`,
})
export class AppComponent {
  title = 'Fullerstack';
  constructor(i18n: I18nService) {}
}
```

Supported language translations in the `/assets/ngx-i18n` directory of your application.

`/assets/ngx-i18n/en.json`

```json
{
  "COMMON.WELCOME": "Welcome",
  "COMMON.ABOUT": "About"
}
```

`/assets/ngx-i18n/fr.json`

```json
{
  "COMMON.WELCOME": "Bienvenue",
  "COMMON.ABOUT": "Sur"
}
```

# Advanced usage:

```typescript
// In your app.component.ts
import { Component } from '@angular/core';
import { I18nService } from '@fullerstack/ngx-i18n';

@Component({
  selector: 'avidtrader-root',
  template: `<h1>{{ 'COMMON.WELCOME' | translate }} to {{ title }}!</h1>`,
})
export class AppComponent {
  direction = 'ltr';
  title = 'Fullerstack';
  constructor(public i18n: I18nService) {
    // translate in ts files
    i18n.xlate.get('COMMON.WELCOME').subscribe((res: string) => {
      console.log.info(res);
    });

    // check if language is Right2Left `rtl`
    if (i18n.isLanguageRTL('he')) {
      this.direction = 'rtl';
    }

    // change the language
    i18n.setCurrentLanguage('fr');

    // available properties
    // direction
    // currentLanguage
    // defaultLanguage
    // enabledLanguages

    // available methods
    // isCurrentLanguage(iso)
    // getLanguageName(iso)
    // getLanguageDirection(iso)
    // isLanguageEnabled(iso)
  }
}
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
[version-image]: https://img.shields.io/npm/v/@fullerstack/ngx-i18n.svg
[version-link]: https://www.npmjs.com/package/@fullerstack/ngx-i18n
[coverage-image]: https://coveralls.io/repos/neekware/fullerstack/badge.svg
[coverage-link]: https://coveralls.io/r/neekware/fullerstack
[download-image]: https://img.shields.io/npm/dm/@fullerstack/ngx-i18n.svg
[download-link]: https://www.npmjs.com/package/@fullerstack/ngx-i18n
