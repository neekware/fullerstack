# Fullerstack

## Supported Platforms

- Browsers (Angular)
- Desktop (Electron)
- Mobile (NativeScript, Ionic)

## Legends

### Libraries

- AG = Agnostic (not target specific)
- NG = Angular (angular.io)
  - NGAG = Platform Agnostic Angular
  - NGAGX = Platform Agnostic Angular Extension (library)
- NT = Nest (nestjs.com)
  - NTAG = Platform Agnostic Nest
  - NTAGX = Platform Agnostic Nest Extension (library)
- WB = Web (Chrome, Firefox, Safari, Edge, etc)
- EL = Electron (electronjs.org)
- NS = NativeScript (nativescript.org)
- IO = Apple's iOS (apple.com/ios)
- AN = Google's Andriod (android.com)
- IC = Ionic (ionicframework.com)

### Applications

- wb.appname = Web (Chrome, Firefox, Safari, Edge, etc)
- el.appname = Desktop (Electorn Application - Linux, MacOS, Windows)
- ns.appname = NativeScript (Andriod, iOS)
- ic.appname = Ionic (Andriod, iOS)

# Instruction

#### Install Nrwl

npm install -g @nrwl/schematics@latest

#### Create a mono repo

npm init nx-workspace fullerstack

#### Graph dependencies

npm run dep-graph

#### Webpack analyzer

nx build fullerstack --stats-json --prod && npm run stats

#### Graph dependencies uncommitted changes from affected libs/apps

npm run affected -- --target dep-graph --uncommitted

#### Graph dependencies changes from affected libs/apps on master

npm run affected -- --target dep-graph --base=master

#### Test uncommitted changes from affected libs/apps

npm run affected -- --target test --uncommitted

#### Test committed changes on master

npm run affected -- --target test --base=master

#### Format changed files

npm run format

# Sponsors

This project was generated using [Nx](https://nx.dev).
