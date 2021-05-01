import { MsgService } from '@fullerstack/ngx-msg';

import { State, Action, StateContext, Selector } from '@ngxs/store';
import { _ } from '@fullerstack/ngx-i18n';

import { AuthDefaultState } from './auth-state.default';
import { AuthEffect } from './auth-state.effect';
import { AuthState } from './auth-state.model';
import { AUTH_STATE_KEY } from './auth.constant';
import * as actions from './auth-state.action';
import { signState } from './auth-state.util';
import { Injectable } from '@angular/core';

// import { MsgService } from '@nwpkg/msg';
// import { _ } from '@nwpkg/i18n';

// import { AuthState, AUTH_STATE_KEY } from './auth-types.state';
// import { AuthDefaultState } from './auth-defaults.state';
// import { signState } from './auth-utils.state';
// import { AuthRemoteService } from './auth-remote-service.state';
// import * as actions from './auth-actions.state';

@State<AuthState>({
  name: AUTH_STATE_KEY,
  defaults: AuthDefaultState,
})
@Injectable()
export class AuthStoreState {
  constructor(readonly msg: MsgService, readonly stateService: AuthEffect) {}

  @Action(actions.Initialize)
  initializeRequest({ setState }: StateContext<AuthState>) {
    setState(signState(AuthDefaultState));
  }

  @Action(actions.LoginRequest)
  loginRequest(
    { setState }: StateContext<AuthState>,
    { payload }: actions.LoginRequest
  ) {
    setState(
      signState({
        ...AuthDefaultState,
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
        ...AuthDefaultState,
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
        ...AuthDefaultState,
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
        ...AuthDefaultState,
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
    setState(signState(AuthDefaultState));
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
        ...AuthDefaultState,
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
        ...AuthDefaultState,
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
