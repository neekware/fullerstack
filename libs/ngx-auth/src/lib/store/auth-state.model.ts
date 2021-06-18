/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

export interface AuthState {
  isLoggedIn: boolean;
  isRegistering: boolean;
  isAuthenticating: boolean;
  hasError: boolean;
  token: string;
}
