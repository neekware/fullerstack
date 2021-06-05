import { Injectable, OnDestroy } from '@angular/core';
import { GqlService } from '@fullerstack/ngx-gql';
import * as gqlOperations from '@fullerstack/ngx-gql/operations';
import * as gqlSchema from '@fullerstack/ngx-gql/schema';
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

  loginRequest(input: gqlSchema.UserCredentialsInput): Observable<unknown> {
    this.logger.debug('Login request sent ...');
    return from(
      this.gql.client.mutate<gqlSchema.authLogin>({
        mutation: gqlOperations.AuthLoginMutation,
        variables: { input },
      })
    ).pipe(
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
      catchError((error, caught$) => {
        this.gtag.trackEvent('login_failed', {
          method: 'password',
          event_category: 'auth',
          event_label: error.message,
        });
        this.logger.error(error);
        this.msg.setMsg(AuthMessageMap.error.server);
        return this.store.dispatch(new actions.LoginFailure());
      }),
      takeUntil(this.destroy$)
    );
  }

  registerRequest(input: gqlSchema.UserCreateInput): Observable<unknown> {
    this.logger.debug('Register request sent ...');
    return from(
      this.gql.client.mutate<gqlSchema.authRegister>({
        mutation: gqlOperations.AuthRegisterMutation,
        variables: { input },
      })
    ).pipe(
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
      catchError((error, caught$) => {
        this.gtag.trackEvent('register_failed', {
          method: 'password',
          event_category: 'auth',
          event_label: error.message,
        });
        this.logger.error(error);
        this.msg.setMsg(AuthMessageMap.error.server);
        return this.store.dispatch(new actions.RegisterFailure());
      }),
      takeUntil(this.destroy$)
    );
  }

  tokenRefreshRequest(): Observable<unknown> {
    this.logger.debug('Token refresh request sent ...');
    return from(
      this.gql.client.mutate<gqlSchema.authRefreshToken>({
        mutation: gqlOperations.AuthRefreshTokenMutation,
      })
    ).pipe(
      take(1),
      map(({ data }) => data.authRefreshToken),
      map((resp) => {
        if (resp.ok) {
          return this.store.dispatch(new actions.TokenRefreshSuccess(resp.token));
        }
        return this.store.dispatch(new actions.LogoutRequest());
      }),
      catchError((error, caught$) => {
        this.gtag.trackEvent('refresh_token_failed', {
          method: 'token',
          event_category: 'auth',
          event_label: error.message,
        });
        this.logger.error(error);
        this.msg.setMsg(AuthMessageMap.error.server);
        return of(null);
      }),
      takeUntil(this.destroy$)
    );
  }

  logoutRequest(): Observable<unknown> {
    this.logger.debug('Logout request sent ...');
    return from(
      this.gql.client.mutate<gqlSchema.authLogout>({
        mutation: gqlOperations.AuthLogoutMutation,
      })
    ).pipe(
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
      catchError((error, caught$) => {
        this.gtag.trackEvent('logout_failed', {
          event_category: 'auth',
          event_label: error.message,
        });
        this.logger.error(error);
        this.msg.setMsg(AuthMessageMap.error.server);
        return this.store.dispatch(new actions.LogoutFailure());
      }),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
