/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { getOperationName } from '@fullerstack/ngx-gql';
import { AuthLogoutMutation, AuthRefreshTokenMutation } from '@fullerstack/ngx-gql/operations';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { LogLevels } from '@fullerstack/ngx-logger';
import { MessageMap } from '@fullerstack/ngx-msg';
import { DeepReadonly } from 'ts-essentials';

import { AuthConfig, AuthState, AuthUrls } from './auth.model';

/**
 * Default configuration - Auth module
 */
export const DefaultAuthConfig: AuthConfig = {
  logState: false,
};

export const AuthResponseOperationName = 'operationName';
export const AuthRefreshTokenOperation = getOperationName(AuthRefreshTokenMutation);
export const AuthLogoutOperation = getOperationName(AuthLogoutMutation);

export const DefaultAuthState: DeepReadonly<AuthState> = {
  userId: null,
  isLoggedIn: false,
  isRegistering: false,
  isAuthenticating: false,
  logoutRequired: false,
  hasError: false,
  token: null,
  message: null,
};

export const AuthMessageMap: MessageMap = {
  success: {
    login: {
      text: _('SUCCESS.AUTH.LOGIN'),
      code: 'SUCCESS.AUTH.LOGIN',
      level: LogLevels.info,
    },
    logout: {
      text: _('SUCCESS.AUTH.LOGOUT'),
      code: 'SUCCESS.AUTH.LOGOUT',
      level: LogLevels.info,
    },
    register: {
      text: _('SUCCESS.AUTH.REGISTER'),
      code: 'SUCCESS.AUTH.REGISTER',
      level: LogLevels.info,
    },
    refresh: {
      text: _('SUCCESS.AUTH.REFRESH'),
      code: 'SUCCESS.AUTH.REFRESH',
      level: LogLevels.info,
      consoleOnly: true,
    },
  },
  error: {
    login: {
      text: _('ERROR.AUTH.LOGIN'),
      code: 'ERROR.AUTH.LOGIN',
      level: LogLevels.warn,
    },
    logout: {
      text: _('ERROR.AUTH.LOGOUT'),
      code: 'ERROR.AUTH.LOGOUT',
      level: LogLevels.warn,
    },
    register: {
      text: _('ERROR.AUTH.REGISTER'),
      code: 'ERROR.AUTH.REGISTER',
      level: LogLevels.warn,
    },
    refresh: {
      text: _('ERROR.AUTH.REFRESH'),
      code: 'ERROR.AUTH.REFRESH',
      level: LogLevels.warn,
      consoleOnly: true,
    },
    server: {
      text: _('ERROR.SERVER'),
      code: 'ERROR.SERVER',
      level: LogLevels.error,
      consoleOnly: true,
    },
  },
};

export const DefaultAuthUrls: DeepReadonly<AuthUrls> = {
  loginUrl: '/auth/login',
  registerUrl: '/auth/register',
  loggedInUrl: '/',
  landingUrl: '/',
};
