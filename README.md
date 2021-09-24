# Fullerstack <img style="margin-bottom: -6px" width="30" src="https://raw.githubusercontent.com/neekware/fullerstack/main/libs/agx-assets/src/lib/images/tech/fullerstack-x250.png">

[![status-image]][status-link]
[![coverage-image]][coverage-link]

## Description

This project is a mono-repo for FullerStack which is an open source dashboard powered by Angular for the frontend and NetJs for the backend.

## Mission

To create an open source dashboard from the ground-up. `Quality of Experience` is the ultimate mission, and that includes simplicity, elegance, quality and performance. `Designed for the future, but built for today!`<br/>

## `Elegance in simplicity`

<img width="auto" src="https://raw.githubusercontent.com/neekware/fullerstack/main/libs/agx-assets/src/lib/images/misc/login.png">

Screenshots: ([screenshots](FEATURES.md)) // Demo: ( [avidtrader.co](https://app.avidtrader.co/forex/100/USD/EUR) )

<br/>

## Features

- Quality of Experience and Security First
- Built-in Auth & Auth (Authentication & Authorization)
  - Powered by JWT (Auth & Access)
  - Fully Stateless
  - Permissions (Roles / Actions)
- Translations
  - Internationalization (i18n)
  - Localization (i10n)
  - Left2Right, Right2Left Support
- GraphQL
  - Frontend & Backend
- PubSub
  - RxJS (Subscription, Push)
  - Fully reactive
- Full SQL Support
  - PostgresQL as the 1st class citizen
- Dark Mode Support
- Fullscreen
- Geo Location Support
  - Geo Fencing
  - IP address filtering (by: proxy count, proxy nodes, public only, best matched)
- ...Etc

### The mono-repo was created via Nrwl/Nx.

npx create-nx-workspace fullerstack

### Powered By

[<img style="margin-bottom: 1px" width="60" src="https://raw.githubusercontent.com/neekware/fullerstack/main/libs/agx-assets/src/lib/images/tech/nx-x250.png">](https://nx.dev/)
[<img style="margin-bottom: -6px" width="30" src="https://raw.githubusercontent.com/neekware/fullerstack/main/libs/agx-assets/src/lib/images/tech/angular-x250.png">](https://angular.io)
[<img style="margin-bottom: -5px" width="27" src="https://raw.githubusercontent.com/neekware/fullerstack/main/libs/agx-assets/src/lib/images/tech/nestjs-x250.png">](https://nestjs.com/)
[<img style="margin-bottom: -7px" width="30" src="https://raw.githubusercontent.com/neekware/fullerstack/main/libs/agx-assets/src/lib/images/tech/prisma-x250.png">](https://www.prisma.io/)
[<img style="margin-bottom: -4px" width="24" src="https://raw.githubusercontent.com/neekware/fullerstack/main/libs/agx-assets/src/lib/images/tech/graphql-x250.png">](https://graphql.org/)
[<img style="margin-bottom: -4px" width="24" src="https://raw.githubusercontent.com/neekware/fullerstack/main/libs/agx-assets/src/lib/images/tech/apollo-x250.png">](https://www.apollographql.com/)
[<img style="margin-bottom: -4px" width="24" src="https://raw.githubusercontent.com/neekware/fullerstack/main/libs/agx-assets/src/lib/images/tech/html5-x250.png">](https://en.wikipedia.org/wiki/HTML5)
[<img style="margin-bottom: -4px" width="24" src="https://raw.githubusercontent.com/neekware/fullerstack/main/libs/agx-assets/src/lib/images/tech/css3-x250.png">](https://www.w3.org/)
[<img style="margin-bottom: -4px" width="22" src="https://raw.githubusercontent.com/neekware/fullerstack/main/libs/agx-assets/src/lib/images/tech/scss-x250.png">](https://sass-lang.com/)
[<img style="margin-bottom: -4px" width="22" src="https://raw.githubusercontent.com/neekware/fullerstack/main/libs/agx-assets/src/lib/images/tech/psql-x250.png">](https://www.postgresql.org/)
[<img style="margin-bottom: -4px" width="18" src="https://raw.githubusercontent.com/neekware/fullerstack/main/libs/agx-assets/src/lib/images/tech/jest-x250.png">](https://jestjs.io/docs/getting-started)
[<img style="margin-bottom: -4px" width="24" src="https://raw.githubusercontent.com/neekware/fullerstack/main/libs/agx-assets/src/lib/images/tech/cypress-x250.png">](https://www.cypress.io/)

## Publishable Libraries

- [@fullerstack/agx-store](https://www.npmjs.com/package/@fullerstack/agx-store) (state management based on KISS principle)
- [@fullerstack/nax-ipware](https://www.npmjs.com/package/@fullerstack/nax-ipware) (best attempt to grab client's read ip)
- [@fullerstack/ngx-cachify](https://www.npmjs.com/package/@fullerstack/ngx-cachify) (intuitive caching of http calls)
- [@fullerstack/ngx-config](https://www.npmjs.com/package/@fullerstack/ngx-config) (injectable angular environment)
- [@fullerstack/ngx-gtag](https://www.npmjs.com/package/@fullerstack/ngx-gtag) (google analytics api for angular)
- [@fullerstack/ngx-i18n](https://www.npmjs.com/package/@fullerstack/ngx-i18n) (i18n support for angular - single compilation)
- [@fullerstack/ngx-jwt](https://www.npmjs.com/package/@fullerstack/ngx-jwt) (jwt utility for angular)
- [@fullerstack/ngx-logger](https://www.npmjs.com/package/@fullerstack/ngx-logger) (logger for angular)
- [@fullerstack/ngx-menu](https://www.npmjs.com/package/@fullerstack/ngx-menu) (advanced menu for angular)
- [@fullerstack/ngx-store](https://www.npmjs.com/package/@fullerstack/ngx-store) (simple store management for angular - redux)
- [@fullerstack/ngx-subify](https://www.npmjs.com/package/@fullerstack/ngx-subify) (rxjs subscription management utility for angular)

## Supported Platforms

- Browsers (Angular)
- Desktop (Electron)
- Mobile (NativeScript, Ionic)

## Legends

### Libraries

- `AG` = Agnostic (not target specific, `node &| browser`)
  - `AGX` = Node/Browser Library
- `BA` = Browser Framework/Library Agnostic (not framework/library specific, `browser-only`)
  - `BAX` = Browser Library
- `NA` = Node Application Agnostic (not application specific, `node-only`)
  - `NAX` = Node Library
- `NG` = [Angular](angular.io)
  - `NGX` = Angular Library
- `NS` = [Nest](nestjs.com)
  - `NSX` = NestJs Library

### Applications

- `WB` = Web (Chrome, Firefox, Safari, Edge, etc)
- `EL` = [Electron](electronjs.org)
- `NS` = [NativeScript](nativescript.org) (Android // iOS)
- `IO` = [Ionic](ionicframework.com) (Android // iOS)

## Applications

- appname = Web (Chrome, Firefox, Safari, Edge, etc)
- appname-el = Desktop (Electron Application - Linux, MacOS, Windows)
- appname-ns = NativeScript (Android, iOS)
- appname-ic = Ionic (Android, iOS)

## Applications (End2End)

- appname-e2e = Web (Chrome, Firefox, Safari, Edge, etc)
- appname-el-e2e = Desktop (Electron Application - Linux, MacOS, Windows)
- appname-ns-e2e = NativeScript (Android, iOS)
- appname-ic-e2e = Ionic (Android, iOS)

## Instruction (for developers)

### Installation

```bash
# Clone the repo
git clone https://github.com/neekware/fullerstack.git

# Install the dependencies
cd fullerstack
yarn install

# Create a database (postgres)
createdb fullerstack

# Copy environment variables and update
cp env.example .env

# Migrate the database
yarn prisma:migrate:dev

# Seed your database
yarn prisma:seed

# Start the backend (in terminal #1)
yarn start:api

# Start the frontend (in terminal #2)
yarn start:fullerstack

# Visit frontend (on mac use open, on windows, just type it in)
open http://localhost:4200

# Signup / Login and take the site for a spin
# Note superuser account is set in your .env (refer to AUTH_SUPERUSER_EMAIL, AUTH_SUPERUSER_PASSWORD)
```

### Development (lint, test, build, format)

```bash
# Webpack analyzer
yarn nx build fullerstack --stats-json --prod && yarn stats

# Format changed files
yarn format:all

#  Lint CI
yarn lint:ci

#  Test CI
yarn test:ci

#  Test build
yarn build:ci
```

## Dependency Graph

#### `Visual` confirmation of your `system architecture`, and prevent circular dependencies via `eslint`

```bash
# Graph dependencies on a branch
# More: https://nx.dev/latest/angular/cli/affected-dep-graph

yarn affected:dep-graph --base=<branch-name> --head=HEAD
```

<img width="auto" src="https://raw.githubusercontent.com/neekware/fullerstack/main/libs/agx-assets/src/lib/images/tech/dep-graph-back.png">
<img width="auto" src="https://raw.githubusercontent.com/neekware/fullerstack/main/libs/agx-assets/src/lib/images/tech/dep-graph-front.png">

## License

- Released under a ([MIT](https://raw.githubusercontent.com/neekware/fullerstack/main/LICENSE)) license.

## Version

X.Y.Z Version

    `MAJOR` version -- making incompatible API changes
    `MINOR` version -- adding functionality in a backwards-compatible manner
    `PATCH` version -- making backwards-compatible bug fixes

## Lines of Code (auto-generated)

```txt<br>--------------------------------------------------------------------------------
 Language             Files        Lines        Blank      Comment         Code
--------------------------------------------------------------------------------
 TypeScript             402        21887         2489         4037        15361
 JSON                   147         5198            0            0         5198
 Markdown               105         2983          762            0         2221
 HTML                    35         1467          115            6         1346
 Sass                    57         1467          142           35         1290
 JavaScript              36          664           24           48          592
 CSS                      1           96            7            0           89
 Plain Text               5           94           10            0           84
 SQL                      1           80           15           13           52
 Toml                     1            3            0            2            1
--------------------------------------------------------------------------------
 Total                  790        33939         3564         4141        26234
--------------------------------------------------------------------------------
```

## Sponsors

[ [Neekware Inc.](http://neekware.com) ] [ [Nx](https://nx.dev) ]

[status-image]: https://github.com/neekware/fullerstack/actions/workflows/ci.yml/badge.svg
[status-link]: https://github.com/neekware/fullerstack/actions/workflows/ci.yml
[version-image]: https://img.shields.io/npm/v/@fullerstack.svg
[version-link]: https://www.npmjs.com/settings/fullerstack/packages
[coverage-image]: https://coveralls.io/repos/neekware/fullerstack/badge.svg
[coverage-link]: https://coveralls.io/r/neekware/fullerstack
