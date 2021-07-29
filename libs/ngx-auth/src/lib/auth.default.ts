/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { getOperationName } from '@fullerstack/ngx-gql';
import {
  AuthTokenRefreshMutation,
  AuthUserLogoutMutation,
  AuthUserSignupMutation,
} from '@fullerstack/ngx-gql/operations';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { LogLevel } from '@fullerstack/ngx-logger';
import { MessageMap } from '@fullerstack/ngx-msg';
import { DeepReadonly } from 'ts-essentials';

import { AuthConfig, AuthState, AuthUrls } from './auth.model';

export const AsyncValidationDebounceTime = 500;

/**
 * Default configuration - Auth module
 */
export const DefaultAuthConfig: AuthConfig = {
  logState: false,
};

export const AuthSignupOperation = getOperationName(AuthUserSignupMutation);
export const AuthRefreshTokenOperation = getOperationName(AuthTokenRefreshMutation);
export const AuthLogoutOperation = getOperationName(AuthUserLogoutMutation);

export const DefaultAuthState: DeepReadonly<AuthState> = {
  userId: null,
  isLoggedIn: false,
  isSigningUp: false,
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
      level: LogLevel.info,
    },
    logout: {
      text: _('SUCCESS.AUTH.LOGOUT'),
      code: 'SUCCESS.AUTH.LOGOUT',
      level: LogLevel.info,
    },
    signup: {
      text: _('SUCCESS.AUTH.SIGNUP'),
      code: 'SUCCESS.AUTH.SIGNUP',
      level: LogLevel.info,
    },
    refresh: {
      text: _('SUCCESS.AUTH.REFRESH'),
      code: 'SUCCESS.AUTH.REFRESH',
      level: LogLevel.info,
      consoleOnly: true,
    },
  },
  error: {
    login: {
      text: _('ERROR.AUTH.LOGIN'),
      code: 'ERROR.AUTH.LOGIN',
      level: LogLevel.warn,
    },
    logout: {
      text: _('ERROR.AUTH.LOGOUT'),
      code: 'ERROR.AUTH.LOGOUT',
      level: LogLevel.warn,
    },
    signup: {
      text: _('ERROR.AUTH.SIGNUP'),
      code: 'ERROR.AUTH.SIGNUP',
      level: LogLevel.warn,
    },
    refresh: {
      text: _('ERROR.AUTH.REFRESH'),
      code: 'ERROR.AUTH.REFRESH',
      level: LogLevel.warn,
      consoleOnly: true,
    },
    server: {
      text: _('ERROR.SERVER'),
      code: 'ERROR.SERVER',
      level: LogLevel.error,
      consoleOnly: true,
    },
  },
};

export const DefaultAuthUrls: DeepReadonly<AuthUrls> = {
  loginUrl: '/auth/login',
  signupUrl: '/auth/signup',
  loggedInUrl: '/',
  landingUrl: '/',
};
