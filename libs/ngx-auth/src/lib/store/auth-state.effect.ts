import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { GqlService } from '@fullerstack/ngx-gql';
import {
  AuthLoginMutation,
  AuthLogoutMutation,
  AuthRefreshTokenMutation,
  AuthRegisterMutation,
} from '@fullerstack/ngx-gql/operations';
import {
  AuthStatus,
  AuthTokenStatus,
  UserCreateInput,
  UserCredentialsInput,
} from '@fullerstack/ngx-gql/schema';
import { LoggerService } from '@fullerstack/ngx-logger';
import { Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import * as actions from './auth-state.action';

@Injectable({ providedIn: 'root' })
export class AuthEffectsService implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(
    readonly http: HttpClient,
    readonly store: Store,
    readonly logger: LoggerService,
    readonly gql: GqlService
  ) {}

  loginRequest(input: UserCredentialsInput): Observable<AuthTokenStatus> {
    this.logger.debug('Login request sent ...');
    return this.gql.client
      .request<AuthTokenStatus>(AuthLoginMutation, { input })
      .pipe(
        map((resp) => {
          if (resp.ok) {
            this.store.dispatch(new actions.LoginSuccess(resp.token));
          } else {
            this.store.dispatch(new actions.LoginFailure());
          }
          return resp;
        }),
        catchError((error, caught$) => {
          this.logger.error(error);
          this.store.dispatch(new actions.LoginFailure());
          return caught$;
        })
      );
  }

  registerRequest(input: UserCreateInput): Observable<AuthTokenStatus> {
    this.logger.debug('Register request sent ...');
    return this.gql.client
      .request<AuthTokenStatus>(AuthRegisterMutation, { input })
      .pipe(
        map((resp) => {
          if (resp.ok) {
            this.store.dispatch(new actions.RegisterSuccess(resp.token));
          } else {
            this.store.dispatch(new actions.RegisterFailure());
          }
          return resp;
        }),
        catchError((error, caught$) => {
          this.logger.error(error);
          this.store.dispatch(new actions.RegisterFailure());
          return caught$;
        })
      );
  }

  tokenRefreshRequest(): Observable<AuthTokenStatus> {
    this.logger.debug('Token refresh request sent ...');
    return this.gql.client.request<AuthTokenStatus>(AuthRefreshTokenMutation).pipe(
      map((resp) => {
        if (resp.ok) {
          this.store.dispatch(new actions.TokenRefreshSuccess(resp.token));
        } else {
          this.store.dispatch(new actions.LogoutRequest());
        }
        return resp;
      }),
      catchError((error, caught$) => {
        this.logger.error(error);
        this.store.dispatch(new actions.LogoutRequest());
        return caught$;
      })
    );
  }

  logoutRequest(): Observable<AuthStatus> {
    this.logger.debug('Logout request sent ...');
    return this.gql.client.request<AuthStatus>(AuthLogoutMutation).pipe(
      map((resp) => {
        this.store.dispatch(new actions.LogoutSuccess());
        return resp;
      }),
      catchError((error, caught$) => {
        this.logger.error(error);
        this.store.dispatch(new actions.LogoutSuccess());
        return caught$;
      })
    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
