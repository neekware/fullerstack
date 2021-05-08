import { Injectable } from '@angular/core';
import { _ } from '@fullerstack/ngx-i18n';
import { MsgService } from '@fullerstack/ngx-msg';
import { Action, State, StateContext } from '@ngxs/store';

import * as actions from './auth-state.action';
import { AUTH_STATE_KEY } from './auth-state.constant';
import { DefaultAuthState } from './auth-state.default';
import { AuthEffect } from './auth-state.effect';
import { AuthState } from './auth-state.model';
import { signState } from './auth-state.util';

@State<AuthState>({
  name: AUTH_STATE_KEY,
  defaults: DefaultAuthState,
})
@Injectable()
export class AuthStoreState {
  constructor(readonly msg: MsgService, readonly stateService: AuthEffect) {}

  @Action(actions.Initialize)
  initializeRequest({ setState }: StateContext<AuthState>) {
    setState(signState(DefaultAuthState));
  }

  @Action(actions.LoginRequest)
  loginRequest(
    { setState }: StateContext<AuthState>,
    { payload }: actions.LoginRequest
  ) {
    setState(
      signState({
        ...DefaultAuthState,
        ...{
          isAuthenticating: true,
        },
      })
    );
    return this.stateService.loginRequest(payload);
  }

  @Action(actions.LoginSuccess)
  loginSuccess(
    { setState }: StateContext<AuthState>,
    { payload }: actions.LoginSuccess
  ) {
    setState(
      signState({
        ...DefaultAuthState,
        ...{
          isLoggedIn: true,
          token: payload,
        },
      })
    );
    this.msg.successSnackBar(_('AUTH.SUCCESS.LOGIN'));
  }

  @Action(actions.LoginFailure)
  loginFailure({ getState, setState }: StateContext<AuthState>) {
    setState(
      signState({
        ...getState(),
        ...{
          hasError: true,
        },
      })
    );
  }

  @Action(actions.RegisterRequest)
  registerRequest(
    { setState }: StateContext<AuthState>,
    { payload }: actions.RegisterRequest
  ) {
    setState(
      signState({
        ...DefaultAuthState,
        ...{
          isRegistering: true,
        },
      })
    );
    return this.stateService.registerRequest(payload);
  }

  @Action(actions.RegisterSuccess)
  registerSuccess(
    { setState }: StateContext<AuthState>,
    { payload }: actions.RegisterSuccess
  ) {
    setState(
      signState({
        ...DefaultAuthState,
        ...{
          isLoggedIn: true,
          token: payload,
        },
      })
    );
    this.msg.successSnackBar(_('AUTH.SUCCESS.REGISTER'), { duration: 5000 });
  }

  @Action(actions.RegisterFailure)
  registerFailure({ getState, setState }: StateContext<AuthState>) {
    setState(
      signState({
        ...getState(),
        ...{
          hasError: true,
        },
      })
    );
  }

  @Action(actions.LogoutRequest)
  logoutRequest({ setState }: StateContext<AuthState>) {
    setState(signState(DefaultAuthState));
    this.msg.successSnackBar(_('AUTH.SUCCESS.LOGOUT'));
  }

  @Action(actions.TokenRefreshRequest)
  tokenRefreshRequest(
    { getState, setState }: StateContext<AuthState>,
    { payload }: actions.TokenRefreshRequest
  ) {
    setState(
      signState({
        ...getState(),
        ...{
          isRefreshingToken: true,
        },
      })
    );
    return this.stateService.refreshRequest(payload);
  }

  @Action(actions.TokenRefreshSuccess)
  tokenRefreshSuccess(
    { setState }: StateContext<AuthState>,
    { payload }: actions.TokenRefreshSuccess
  ) {
    setState(
      signState({
        ...DefaultAuthState,
        ...{
          isLoggedIn: true,
          token: payload,
        },
      })
    );
  }

  @Action(actions.TokenRefreshFailure)
  tokenRefreshFailure({ setState }: StateContext<AuthState>) {
    setState(
      signState({
        ...DefaultAuthState,
        ...{
          hasError: true,
        },
      })
    );
  }

  @Action(actions.MultiTabSyncRequest)
  multiTabSyncRequest(
    { setState }: StateContext<AuthState>,
    { payload }: actions.MultiTabSyncRequest
  ) {
    setState(signState(payload));
  }
}
