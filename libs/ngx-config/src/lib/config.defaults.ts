import { InjectionToken } from '@angular/core';

import { DEFAULT_HTTP_TIMEOUT } from './config.constants';
import {
  HttpMethod,
  ApplicationConfig,
  LocalConfig,
  RemoteConfig,
} from './config.models';

/** Default local config */
export const DefaultConfig: LocalConfig = {
  multiTab: true,
  loginPageUrl: '/auth/login',
  registerPageUrl: '/auth/register',
  loggedInLandingPageUrl: '/',
  loggedOutRedirectUrl: '/',
} as const;

/** Default remote config fetch */
export const DefaultRemoteConfig: RemoteConfig = {
  endpoint: null,
  method: HttpMethod.GET,
  timeout: DEFAULT_HTTP_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
  body: {},
} as const;

/** Default application-wide config */
export const DefaultApplicationConfig: ApplicationConfig = {
  production: false,
  version: '1.0.0',
  appName: '@fullerstack/ngx-config',
  localConfig: DefaultConfig,
  remoteConfig: DefaultRemoteConfig,
  remoteData: {},
} as const;

/** App configuration options token */
export const CONFIG_TOKEN = new InjectionToken<string>('CONFIG_TOKEN');
