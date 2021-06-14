import { Injectable } from '@angular/core';
import { _ } from '@fullerstack/ngx-i18n';
import { MsgService } from '@fullerstack/ngx-msg';
import { Action, State, StateContext } from '@ngxs/store';

import * as actions from './auth-state.action';
import { AUTH_STATE_KEY } from './auth-state.constant';
import { DefaultAuthState } from './auth-state.default';
import { AuthEffectsService } from './auth-state.effect';
import { AuthState } from './auth-state.model';

@State<AuthState>({
  name: AUTH_STATE_KEY,
  defaults: DefaultAuthState,
})
@Injectable({ providedIn: 'root' })
export class AuthStoreState {
  constructor(readonly msg: MsgService, readonly effects: AuthEffectsService) {}

  @Action(actions.Initialize)
  initialize({ setState }: StateContext<AuthState>) {
    setState(DefaultAuthState);
  }

  @Action(actions.LoginRequest)
  loginRequest({ setState }: StateContext<AuthState>, { payload }: actions.LoginRequest) {
    setState({
      ...DefaultAuthState,
      isAuthenticating: true,
    });
    return this.effects.loginRequest(payload);
  }

  @Action(actions.LoginSuccess)
  loginSuccess({ setState }: StateContext<AuthState>, { payload }: actions.LoginSuccess) {
    setState({
      ...DefaultAuthState,
      isLoggedIn: true,
      token: payload,
    });
    this.msg.successSnackBar(_('SUCCESS.AUTH.LOGIN'), { duration: 4000 });
  }

  @Action(actions.LoginFailure)
  loginFailure({ getState, setState }: StateContext<AuthState>) {
    setState({
      ...getState(),
      hasError: true,
    });
  }

  @Action(actions.RegisterRequest)
  registerRequest({ setState }: StateContext<AuthState>, { payload }: actions.RegisterRequest) {
    setState({
      ...DefaultAuthState,
      isRegistering: true,
    });
    return this.effects.registerRequest(payload);
  }

  @Action(actions.RegisterSuccess)
  registerSuccess({ setState }: StateContext<AuthState>) {
    setState({
      ...DefaultAuthState,
      isLoggedIn: true,
    });
    this.msg.successSnackBar(_('SUCCESS.AUTH.REGISTER'), { duration: 5000 });
  }

  @Action(actions.RegisterFailure)
  registerFailure({ getState, setState }: StateContext<AuthState>) {
    setState({
      ...getState(),
      hasError: true,
    });
  }

  @Action(actions.LogoutRequest)
  logoutRequest() {
    return this.effects.logoutRequest();
  }

  @Action(actions.LogoutSuccess)
  logoutSuccess({ setState }: StateContext<AuthState>) {
    setState(DefaultAuthState);
  }

  @Action(actions.LogoutFailure)
  logoutFailure({ setState }: StateContext<AuthState>) {
    setState(DefaultAuthState);
  }

  @Action(actions.TokenRefreshRequest)
  tokenRefreshRequest() {
    return this.effects.tokenRefreshRequest();
  }

  @Action(actions.TokenRefreshSuccess)
  tokenRefreshSuccess(
    { setState }: StateContext<AuthState>,
    { payload }: actions.TokenRefreshSuccess
  ) {
    setState({
      ...DefaultAuthState,
      isLoggedIn: true,
      token: payload,
    });
  }

  @Action(actions.TokenRefreshFailure)
  tokenRefreshFailure({ setState }: StateContext<AuthState>) {
    setState({
      ...DefaultAuthState,
      hasError: true,
    });
  }
}
