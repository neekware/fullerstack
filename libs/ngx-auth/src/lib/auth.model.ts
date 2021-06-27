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
  isRegistering: boolean;
  isAuthenticating: boolean;
  hasError: boolean;
  token: string;
  message: string;
}

export interface AuthUrls {
  loginUrl: string;
  registerUrl: string;
  loggedInUrl: string;
  landingUrl: string;
}
