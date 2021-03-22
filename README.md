# Fullerstack <img style="margin-bottom: -6px" width="30" src="apps/fullerstack/src/assets/images/fullerstack-x250.png">

## Powered By

[<img style="margin-bottom: 1px" width="60" src="apps/fullerstack/src/assets/images/nx-x250.png">](https://nx.dev/)
[<img style="margin-bottom: -6px" width="30" src="apps/fullerstack/src/assets/images/angular-x250.png">](https://angular.io)
[<img style="margin-bottom: -5px" width="27" src="apps/fullerstack/src/assets/images/nestjs-x250.png">](https://nestjs.com/)
[<img style="margin-bottom: -7px" width="30" src="apps/fullerstack/src/assets/images/prisma-x250.png">](https://www.prisma.io/)
[<img style="margin-bottom: -4px" width="24" src="apps/fullerstack/src/assets/images/graphql-x250.png">](https://graphql.org/)
[<img style="margin-bottom: -4px" width="24" src="apps/fullerstack/src/assets/images/apollo-x250.png">](https://www.apollographql.com/)
[<img style="margin-bottom: -4px" width="24" src="apps/fullerstack/src/assets/images/html5-x250.png">](https://en.wikipedia.org/wiki/HTML5)
[<img style="margin-bottom: -4px" width="24" src="apps/fullerstack/src/assets/images/css3-x250.png">](https://www.w3.org/)
[<img style="margin-bottom: -4px" width="22" src="apps/fullerstack/src/assets/images/scss-x250.png">](https://sass-lang.com/)
[<img style="margin-bottom: -4px" width="22" src="apps/fullerstack/src/assets/images/psql-x250.png">](https://www.postgresql.org/)
[<img style="margin-bottom: -4px" width="18" src="apps/fullerstack/src/assets/images/jest-x250.png">](https://jestjs.io/docs/getting-started)
[<img style="margin-bottom: -4px" width="24" src="apps/fullerstack/src/assets/images/cypress-x250.png">](https://www.cypress.io/)

## Supported Platforms

- Browsers (Angular)
- Desktop (Electron)
- Mobile (NativeScript, Ionic)

## Legends

### Libraries

- AG = Agnostic (not target specific)
- NG = [Angular](angular.io)
  - NGAG = Platform Agnostic Angular
  - NGAGX = Platform Agnostic Angular Extension (library)
- NT = [Nest](nestjs.com)
  - NTAG = Platform Agnostic Nest
  - NTAGX = Platform Agnostic Nest Extension (library)
- WB = Web (Chrome, Firefox, Safari, Edge, etc)
- EL = [Electron] (electronjs.org)
- NS = ]NativeScript] (nativescript.org)
- AN = Google's [Android] (android.com)
- IC = ]Ionic] (ionicframework.com)

### Applications

- wb.appname = Web (Chrome, Firefox, Safari, Edge, etc)
- el.appname = Desktop (Electorn Application - Linux, MacOS, Windows)
- ns.appname = NativeScript (Andriod, iOS)
- ic.appname = Ionic (Andriod, iOS)

# Description

This project is a mono-repo for FullerStack which is an open source dashboard powered by Angular for the frontend and NetJs for the backend.

#### The mono-repo was created via Nrwl/Nx.

npx create-nx-workspace fullerstack

#### Instruction (for developers)

git clone https://github.com/neekware/fullerstack.git && cd fullerstack && npm install

#### Graph dependencies

npm run dep-graph

#### Webpack analyzer

nx build fullerstack --stats-json --prod && npm run stats

#### Graph dependencies uncommitted changes from affected libs/apps

npm run affected -- --target dep-graph --uncommitted

#### Graph dependencies changes from affected libs/apps on main

npm run affected -- --target dep-graph --base=main

#### Test uncommitted changes from affected libs/apps

npm run affected -- --target test --uncommitted

#### Test committed changes on main

npm run affected -- --target test --base=main

#### Format changed files

npm run format

# Sponsors

This project was generated using [Nx](https://nx.dev).
