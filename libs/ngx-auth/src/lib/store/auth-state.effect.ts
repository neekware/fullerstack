import { Injectable, OnDestroy } from '@angular/core';
import { GqlService } from '@fullerstack/ngx-gql';
import {
  AuthLoginMutation,
  AuthLogoutMutation,
  AuthRefreshTokenMutation,
  AuthRegisterMutation,
} from '@fullerstack/ngx-gql/operations';
import {
  UserCreateInput,
  UserCredentialsInput,
  authLogin,
  authLogout,
  authRefreshToken,
  authRegister,
} from '@fullerstack/ngx-gql/schema';
import { GTagService } from '@fullerstack/ngx-gtag';
import { LoggerService } from '@fullerstack/ngx-logger';
import { MsgService } from '@fullerstack/ngx-msg';
import { Store } from '@ngxs/store';
import { Observable, Subject, from, of } from 'rxjs';
import { catchError, map, take, takeUntil } from 'rxjs/operators';

import * as actions from './auth-state.action';
import { AuthMessageMap } from './auth-state.default';

@Injectable({
  providedIn: 'root',
})
export class AuthEffectsService implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(
    readonly store: Store,
    readonly msg: MsgService,
    readonly gtag: GTagService,
    readonly logger: LoggerService,
    readonly gql: GqlService
  ) {}

  loginRequest(input: UserCredentialsInput): Observable<unknown> {
    this.logger.debug('Login request sent ...');
    return this.gql
      .mutate<authLogin>({
        mutation: AuthLoginMutation,
        variables: { input },
      })
      .pipe(
        take(1),
        map(({ data }) => {
          return data.authLogin;
        }),
        map((resp) => {
          if (resp.ok) {
            this.gtag.trackEvent('login', {
              method: 'password',
              event_category: 'auth',
              event_label: 'login success',
            });
            this.msg.setMsg(AuthMessageMap.success.login);
            return this.store.dispatch(new actions.LoginSuccess(resp.token));
          }
          this.gtag.trackEvent('login_failed', {
            method: 'password',
            event_category: 'auth',
            event_label: resp.message,
          });
          this.logger.error(resp.message);
          this.msg.setMsg(AuthMessageMap.error.login);
          return this.store.dispatch(new actions.LoginFailure());
        }),
        catchError((error) => {
          this.gtag.trackEvent('login_failed', {
            method: 'password',
            event_category: 'auth',
            event_label: error.message,
          });
          this.logger.error(error);
          this.msg.setMsg(AuthMessageMap.error.server);
          return this.store.dispatch(new actions.LoginFailure());
        })
      );
  }

  registerRequest(input: UserCreateInput): Observable<unknown> {
    this.logger.debug('Register request sent ...');
    return this.gql
      .mutate<authRegister>({
        mutation: AuthRegisterMutation,
        variables: { input },
      })
      .pipe(
        take(1),
        map(({ data }) => data.authRegister),
        map((resp) => {
          this.gtag.trackEvent('register', {
            method: 'password',
            event_category: 'auth',
            event_label: 'register success',
          });
          if (resp.ok) {
            this.msg.setMsg(AuthMessageMap.success.register);
            return this.store.dispatch(new actions.RegisterSuccess(resp.token));
          }
          this.gtag.trackEvent('register_failed', {
            method: 'password',
            event_category: 'auth',
            event_label: resp.message,
          });
          this.logger.error(resp.message);
          this.msg.setMsg(AuthMessageMap.error.register);
          return this.store.dispatch(new actions.RegisterFailure());
        }),
        catchError((error) => {
          this.gtag.trackEvent('register_failed', {
            method: 'password',
            event_category: 'auth',
            event_label: error.message,
          });
          this.logger.error(error);
          this.msg.setMsg(AuthMessageMap.error.server);
          return this.store.dispatch(new actions.RegisterFailure());
        })
      );
  }

  tokenRefreshRequest(): Observable<unknown> {
    this.logger.debug('Token refresh request sent ...');
    return this.gql
      .mutate<authRefreshToken>({
        mutation: AuthRefreshTokenMutation,
      })
      .pipe(
        take(1),
        map(({ data }) => data.authRefreshToken),
        map((resp) => {
          if (resp.ok) {
            return this.store.dispatch(new actions.TokenRefreshSuccess(resp.token));
          }
          return this.store.dispatch(new actions.LogoutRequest());
        }),
        catchError((error) => {
          this.gtag.trackEvent('refresh_token_failed', {
            method: 'token',
            event_category: 'auth',
            event_label: error.message,
          });
          this.logger.error(error);
          this.msg.setMsg(AuthMessageMap.error.server);
          return of(null);
        })
      );
  }

  logoutRequest(): Observable<unknown> {
    this.logger.debug('Logout request sent ...');
    return this.gql
      .mutate<authLogout>({
        mutation: AuthLogoutMutation,
      })
      .pipe(
        take(1),
        map(({ data }) => data.authLogout),
        map((resp) => {
          if (resp.ok) {
            this.gtag.trackEvent('logout', {
              event_category: 'auth',
              event_label: 'logout success',
            });
            this.msg.setMsg(AuthMessageMap.success.logout);
            return this.store.dispatch(new actions.LogoutSuccess());
          }
          this.gtag.trackEvent('logout_failed', {
            event_category: 'auth',
            event_label: resp.message,
          });
          this.logger.error(resp.message);
          this.msg.setMsg(AuthMessageMap.error.logout);
          return this.store.dispatch(new actions.LogoutFailure());
        }),
        catchError((error) => {
          this.gtag.trackEvent('logout_failed', {
            event_category: 'auth',
            event_label: error.message,
          });
          this.logger.error(error);
          this.msg.setMsg(AuthMessageMap.error.server);
          return this.store.dispatch(new actions.LogoutFailure());
        })
      );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
