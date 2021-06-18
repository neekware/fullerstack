/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { UserCreateInput, UserCredentialsInput } from '@fullerstack/ngx-gql/schema';

export class Initialize {
  static type = '[AUTH] Initialize';
}
export class LoginRequest {
  static type = '[AUTH] LoginRequest';
  constructor(readonly payload: UserCredentialsInput) {}
}
export class LoginSuccess {
  static type = '[AUTH] LoginSuccess';
  constructor(readonly payload: string) {}
}
export class LoginFailure {
  static type = '[AUTH] LoginFailure';
}
export class RegisterRequest {
  static type = '[AUTH] RegisterRequest';
  constructor(readonly payload: UserCreateInput) {}
}
export class RegisterSuccess {
  static type = '[AUTH] RegisterSuccess';
  constructor(readonly payload: string) {}
}
export class RegisterFailure {
  static type = '[AUTH] RegisterFailure';
}
export class TokenRefreshRequest {
  static type = '[AUTH] TokenRefreshRequest';
}
export class TokenRefreshSuccess {
  static type = '[AUTH] TokenRefreshSuccess';
  constructor(readonly payload: string) {}
}
export class TokenRefreshFailure {
  static type = '[AUTH] TokenRefreshFailure';
}
export class LogoutRequest {
  static type = '[AUTH] LogoutRequest';
}
export class LogoutSuccess {
  static type = '[AUTH] LogoutSuccess';
}
