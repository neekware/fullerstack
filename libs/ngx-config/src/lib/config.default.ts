/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { InjectionToken } from '@angular/core';
import { DeepReadonly } from 'ts-essentials';

import { DEFAULT_HTTP_TIMEOUT } from './config.constant';
import { ApplicationConfig, HttpMethod, LocalConfig, RemoteConfig } from './config.model';

/** Default local config */
export const DefaultBaseConfig: DeepReadonly<LocalConfig> = {
  multiTab: true,
  loginPageUrl: '/auth/login',
  signupPageUrl: '/auth/signup',
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
  localConfig: DefaultBaseConfig,
  remoteConfig: DefaultRemoteConfig,
  remoteData: {},
};

/** App configuration options token */
export const CONFIG_TOKEN = new InjectionToken<string>('CONFIG_TOKEN');
