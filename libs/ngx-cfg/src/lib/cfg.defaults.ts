import { InjectionToken } from '@angular/core';

import { DEFAULT_HTTP_TIMEOUT } from './cfg.constants';
import { HttpMethod, ApplicationCfg, LocalCfg, RemoteCfg } from './cfg.models';

/** Default local config */
export const DefaultCfg: LocalCfg = {
  multiTab: true,
  loginPageUrl: '/auth/login',
  registerPageUrl: '/auth/register',
  loggedInLandingPageUrl: '/',
  loggedOutRedirectUrl: '/',
};

/** Default remote config fetch */
export const DefaultRemoteCfg: RemoteCfg = {
  endpoint: null,
  method: HttpMethod.GET,
  timeout: DEFAULT_HTTP_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
  body: {},
};

/** Default application-wide config */
export const DefaultApplicationCfg: ApplicationCfg = {
  production: false,
  version: '0.0.1',
  appName: '@fullerstack/ngx-cfg',
  localCfg: DefaultCfg,
  remoteCfg: DefaultRemoteCfg,
  remoteData: {},
};

/** App configuration options token */
export const CFG_TOKEN = new InjectionToken<string>('CFG_TOKEN');
