import {
  AuthLoginCredentials,
  AuthRegisterCredentials,
  AuthState,
} from './auth-state.model';

export class Initialize {
  static type = '[AUTH] Initialize';
}
export class LoginRequest {
  static type = '[AUTH] LoginRequest';
  constructor(readonly payload: AuthLoginCredentials) {}
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
  constructor(readonly payload: AuthRegisterCredentials) {}
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
  constructor(readonly payload: string) {}
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
export class MultiTabSyncRequest {
  static type = '[AUTH] MultiTabSyncRequest';
  constructor(readonly payload: AuthState) {}
}
