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

  @Action(actions.Initialize, { cancelUncompleted: true })
  initialize({ setState }: StateContext<AuthState>) {
    setState(DefaultAuthState);
  }

  @Action(actions.LoginRequest, { cancelUncompleted: true })
  loginRequest({ setState }: StateContext<AuthState>, { payload }: actions.LoginRequest) {
    setState({
      ...DefaultAuthState,
      isAuthenticating: true,
    });

    // return OR subscribe and handle the observable manually
    return this.effects.loginRequest(payload);
  }

  @Action(actions.LoginSuccess, { cancelUncompleted: true })
  loginSuccess({ setState }: StateContext<AuthState>, { payload }: actions.LoginSuccess) {
    setState({
      ...DefaultAuthState,
      isLoggedIn: true,
      token: payload,
    });
    this.msg.successSnackBar(_('SUCCESS.AUTH.LOGIN'), { duration: 3000 });
  }

  @Action(actions.LoginFailure, { cancelUncompleted: true })
  loginFailure({ getState, setState }: StateContext<AuthState>) {
    setState({
      ...getState(),
      hasError: true,
    });
  }

  @Action(actions.RegisterRequest, { cancelUncompleted: true })
  registerRequest({ setState }: StateContext<AuthState>, { payload }: actions.RegisterRequest) {
    setState({
      ...DefaultAuthState,
      isRegistering: true,
    });

    // return OR subscribe and handle the observable manually
    return this.effects.registerRequest(payload);
  }

  @Action(actions.RegisterSuccess, { cancelUncompleted: true })
  registerSuccess({ setState }: StateContext<AuthState>) {
    setState({
      ...DefaultAuthState,
      isLoggedIn: true,
    });
    this.msg.successSnackBar(_('SUCCESS.AUTH.REGISTER'), { duration: 3000 });
  }

  @Action(actions.RegisterFailure, { cancelUncompleted: true })
  registerFailure({ getState, setState }: StateContext<AuthState>) {
    setState({
      ...getState(),
      hasError: true,
    });
  }

  @Action(actions.LogoutRequest, { cancelUncompleted: true })
  logoutRequest({ getState }: StateContext<AuthState>) {
    if (getState().isLoggedIn) {
      // return OR subscribe and handle the observable manually
      return this.effects.logoutRequest();
    }
  }

  @Action(actions.LogoutSuccess, { cancelUncompleted: true })
  logoutSuccess({ getState, setState }: StateContext<AuthState>) {
    if (getState().isLoggedIn) {
      this.msg.successSnackBar(_('SUCCESS.AUTH.LOGOUT'), { duration: 3000 });
    }
    setState(DefaultAuthState);
  }

  @Action(actions.TokenRefreshRequest, { cancelUncompleted: true })
  tokenRefreshRequest() {
    // return OR subscribe and handle the observable manually
    return this.effects.tokenRefreshRequest();
  }

  @Action(actions.TokenRefreshSuccess, { cancelUncompleted: true })
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

  @Action(actions.TokenRefreshFailure, { cancelUncompleted: true })
  tokenRefreshFailure({ setState }: StateContext<AuthState>) {
    setState({
      ...DefaultAuthState,
      hasError: true,
    });
  }
}
