import { InjectionToken } from '@angular/core';
import { DeepReadonly } from 'ts-essentials';
import { DEFAULT_HTTP_TIMEOUT } from './config.constants';
import {
  HttpMethod,
  ApplicationConfig,
  LocalConfig,
  RemoteConfig,
} from './config.models';

/** Default local config */
export const DefaultConfig: DeepReadonly<LocalConfig> = {
  multiTab: true,
  loginPageUrl: '/auth/login',
  registerPageUrl: '/auth/register',
  loggedInLandingPageUrl: '/',
  loggedOutRedirectUrl: '/',
};

/** Default remote config fetch */
export const DefaultRemoteConfig: DeepReadonly<RemoteConfig> = {
  endpoint: null,
  method: HttpMethod.GET,
  timeout: DEFAULT_HTTP_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
  body: {},
};

/** Default application-wide config */
export const DefaultApplicationConfig: DeepReadonly<ApplicationConfig> = {
  production: false,
  version: '1.0.0',
  appName: '@fullerstack/ngx-config',
  localConfig: DefaultConfig,
  remoteConfig: DefaultRemoteConfig,
  remoteData: {},
};

/** App configuration options token */
export const CONFIG_TOKEN = new InjectionToken<string>('CONFIG_TOKEN');
