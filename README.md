# Fullerstack <img style="margin-bottom: -6px" width="30" src="libs/agx-assets/src/lib/images/tech/fullerstack-x250.png">

[![status-image]][status-link]
[![coverage-image]][coverage-link]

## Description

This project is a mono-repo for FullerStack which is an open source dashboard powered by Angular for the frontend and NetJs for the backend.

## Mission

To create an open source dashboard from the ground-up. `Quality of Experience` is the ultimate mission, and that includes simplicity, elegance, quality and performance. `Designed for the future, but built for today!`<br/>

## `Elegance in simplicity`

<img width="auto" src="libs/agx-assets/src/lib/images/misc/login.png">

Screenshots: ([screenshots](FEATURES.md)) // Demo: ( [avidtrader.co](https://app.avidtrader.co/) )

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
- Geo Location Support (TBD)
  - Geo Fencing
  - IP address filtering
- ...Etc

### The mono-repo was created via Nrwl/Nx.

npx create-nx-workspace fullerstack

### Powered By

[<img style="margin-bottom: 1px" width="60" src="libs/agx-assets/src/lib/images/tech/nx-x250.png">](https://nx.dev/)
[<img style="margin-bottom: -6px" width="30" src="libs/agx-assets/src/lib/images/tech/angular-x250.png">](https://angular.io)
[<img style="margin-bottom: -5px" width="27" src="libs/agx-assets/src/lib/images/tech/nestjs-x250.png">](https://nestjs.com/)
[<img style="margin-bottom: -7px" width="30" src="libs/agx-assets/src/lib/images/tech/prisma-x250.png">](https://www.prisma.io/)
[<img style="margin-bottom: -4px" width="24" src="libs/agx-assets/src/lib/images/tech/graphql-x250.png">](https://graphql.org/)
[<img style="margin-bottom: -4px" width="24" src="libs/agx-assets/src/lib/images/tech/apollo-x250.png">](https://www.apollographql.com/)
[<img style="margin-bottom: -4px" width="24" src="libs/agx-assets/src/lib/images/tech/html5-x250.png">](https://en.wikipedia.org/wiki/HTML5)
[<img style="margin-bottom: -4px" width="24" src="libs/agx-assets/src/lib/images/tech/css3-x250.png">](https://www.w3.org/)
[<img style="margin-bottom: -4px" width="22" src="libs/agx-assets/src/lib/images/tech/scss-x250.png">](https://sass-lang.com/)
[<img style="margin-bottom: -4px" width="22" src="libs/agx-assets/src/lib/images/tech/psql-x250.png">](https://www.postgresql.org/)
[<img style="margin-bottom: -4px" width="18" src="libs/agx-assets/src/lib/images/tech/jest-x250.png">](https://jestjs.io/docs/getting-started)
[<img style="margin-bottom: -4px" width="24" src="libs/agx-assets/src/lib/images/tech/cypress-x250.png">](https://www.cypress.io/)

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

<img width="auto" src="libs/agx-assets/src/lib/images/misc/dep-graph.png">
<br/><br/>

## License

- Released under a ([MIT](https://raw.githubusercontent.com/neekware/fullerstack/main/LICENSE)) license.

## Version

X.Y.Z Version

    `MAJOR` version -- making incompatible API changes
    `MINOR` version -- adding functionality in a backwards-compatible manner
    `PATCH` version -- making backwards-compatible bug fixes

## Lines of Code

```txt<br>--------------------------------------------------------------------------------
 Language             Files        Lines        Blank      Comment         Code
--------------------------------------------------------------------------------
 TypeScript             358        19375         2199         3700        13476
 JSON                   134         4821            0            0         4821
 Markdown               101         2455          648            0         1807
 Sass                    53         1450          142           35         1273
 HTML                    31         1296          103            5         1188
 JavaScript              32          594           24           48          522
 CSS                      1           96            7            0           89
 Plain Text               5           94           10            0           84
 SQL                      4           72           13           15           44
 Toml                     1            3            0            2            1
--------------------------------------------------------------------------------
 Total                  720        30256         3146         3805        23305
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
