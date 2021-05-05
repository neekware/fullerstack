# Fullerstack <img style="margin-bottom: -6px" width="30" src="libs/agx-assets/src/lib/img/tech/fullerstack-x250.png">

[![status-image]][status-link]
[![coverage-image]][coverage-link]

## Description

This project is a mono-repo for FullerStack which is an open source dashboard powered by Angular for the frontend and NetJs for the backend.

## Mission

To create an open source dashboard similar to [avidtrader.co](https://app.avidtrader.co/)

- Quality of Experience and Security First
- Geo Location Support
  - Geo Fencing
  - IP address filtering
- Translations
  - Internationalization (i18n
  - Localization (i10n)
  - Left2Right, Right2Left Support
- GraphQL
  - Frontend & Backend
- PubSub
  - RxJS (Subscription, Push)
- Built-in Auth & Auth (Authentication & Authorization)
  - Powered by JWT (Auth & Access)
  - Fully Stateless
- Full SQL Support
  - PostgresQL as 1st class citizen
- Dark Mode Support
- ...Etc

### The mono-repo was created via Nrwl/Nx.

npx create-nx-workspace fullerstack

### Powered By

[<img style="margin-bottom: 1px" width="60" src="libs/agx-assets/src/lib/img/tech/nx-x250.png">](https://nx.dev/)
[<img style="margin-bottom: -6px" width="30" src="libs/agx-assets/src/lib/img/tech/angular-x250.png">](https://angular.io)
[<img style="margin-bottom: -5px" width="27" src="libs/agx-assets/src/lib/img/tech/nestjs-x250.png">](https://nestjs.com/)
[<img style="margin-bottom: -7px" width="30" src="libs/agx-assets/src/lib/img/tech/prisma-x250.png">](https://www.prisma.io/)
[<img style="margin-bottom: -4px" width="24" src="libs/agx-assets/src/lib/img/tech/graphql-x250.png">](https://graphql.org/)
[<img style="margin-bottom: -4px" width="24" src="libs/agx-assets/src/lib/img/tech/apollo-x250.png">](https://www.apollographql.com/)
[<img style="margin-bottom: -4px" width="24" src="libs/agx-assets/src/lib/img/tech/html5-x250.png">](https://en.wikipedia.org/wiki/HTML5)
[<img style="margin-bottom: -4px" width="24" src="libs/agx-assets/src/lib/img/tech/css3-x250.png">](https://www.w3.org/)
[<img style="margin-bottom: -4px" width="22" src="libs/agx-assets/src/lib/img/tech/scss-x250.png">](https://sass-lang.com/)
[<img style="margin-bottom: -4px" width="22" src="libs/agx-assets/src/lib/img/tech/psql-x250.png">](https://www.postgresql.org/)
[<img style="margin-bottom: -4px" width="18" src="libs/agx-assets/src/lib/img/tech/jest-x250.png">](https://jestjs.io/docs/getting-started)
[<img style="margin-bottom: -4px" width="24" src="libs/agx-assets/src/lib/img/tech/cypress-x250.png">](https://www.cypress.io/)

## Supported Platforms

- Browsers (Angular)
- Desktop (Electron)
- Mobile (NativeScript, Ionic)

## Legends

- AG = Agnostic (not target specific)
- NG = [Angular](angular.io)
  - NGX = Angular Library
- NS = [Nest](nestjs.com)
  - NSX = NestJs Library
- WB = Web (Chrome, Firefox, Safari, Edge, etc)
- EL = [Electron](electronjs.org)
- NS = [NativeScript](nativescript.org)
- AN = Google's [Android](android.com)
- IC = [Ionic](ionicframework.com)

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

git clone https://github.com/neekware/fullerstack.git && cd fullerstack && npm install

### Graph dependencies

yarn dep-graph

### Webpack analyzer

nx build fullerstack --stats-json --prod && yarn stats

### Graph dependencies uncommitted changes from affected libs/apps

yarn affected -- --target dep-graph --uncommitted

### Graph dependencies changes from affected libs/apps on main

yarn affected -- --target dep-graph --base=main

### Test uncommitted changes from affected libs/apps

yarn affected -- --target test --uncommitted

### Test committed changes on main

yarn affected -- --target test --base=main

### Format changed files

yarn format

## License

- Released under a ([MIT](https://raw.githubusercontent.com/neekware/fullerstack/main/LICENSE)) license.

## Version

X.Y.Z Version

    `MAJOR` version -- making incompatible API changes
    `MINOR` version -- adding functionality in a backwards-compatible manner
    `PATCH` version -- making backwards-compatible bug fixes

## Sponsors

[ [Neekware Inc.](http://neekware.com) ] [ [Nx](https://nx.dev) ]

[status-image]: https://github.com/neekware/fullerstack/actions/workflows/ci.yml/badge.svg
[status-link]: https://github.com/neekware/fullerstack/actions/workflows/ci.yml
[version-image]: https://img.shields.io/npm/v/@fullerstack.svg
[version-link]: https://www.npmjs.com/settings/fullerstack/packages
[coverage-image]: https://coveralls.io/repos/neekware/fullerstack/badge.svg
[coverage-link]: https://coveralls.io/r/neekware/fullerstack
