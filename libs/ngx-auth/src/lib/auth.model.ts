/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/**
 * Auth config declaration
 */
export interface AuthConfig {
  logState?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [id: string]: any;
}

export interface AuthState {
  userId: string;
  isLoggedIn: boolean;
  isSigningUp: boolean;
  isAuthenticating: boolean;
  logoutRequired: boolean;
  hasError: boolean;
  token: string;
  message: string;
}

export interface AuthUrls {
  loginUrl: string;
  signupUrl: string;
  loggedInUrl: string;
  landingUrl: string;
}

export enum AuthStateAction {
  AUTH_INITIALIZE = 'AUTH_INITIALIZE',
  AUTH_LOGIN_REQ_SENT = 'AUTH_LOGIN_REQ_SENT',
  AUTH_LOGIN_RES_SUCCESS = 'AUTH_LOGIN_RES_SUCCESS',
  AUTH_LOGIN_RES_FAILED = 'AUTH_LOGIN_RES_FAILED',
  AUTH_SIGNUP_REQ_SENT = 'AUTH_SIGNUP_REQ_SENT',
  AUTH_SIGNUP_RES_SUCCESS = 'AUTH_SIGNUP_RES_SUCCESS',
  AUTH_SIGNUP_RES_FAILED = 'AUTH_SIGNUP_RES_FAILED',
  AUTH_REFRESH_TOKEN_REQ_SENT = 'AUTH_REFRESH_TOKEN_REQ_SENT',
  AUTH_REFRESH_TOKEN_RES_SUCCESS = 'AUTH_REFRESH_TOKEN_RES_SUCCESS',
  AUTH_REFRESH_TOKEN_RES_FAILED = 'AUTH_REFRESH_TOKEN_RES_FAILED',
  AUTH_LOGOUT_REQ_SENT = 'AUTH_LOGOUT_REQ_SENT',
  AUTH_LOGOUT_RES_SUCCESS = 'AUTH_LOGOUT_RES_SUCCESS',
  AUTH_LOGOUT_RES_FAILED = 'AUTH_LOGOUT_RES_FAILED',
}
