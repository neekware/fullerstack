/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable */
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { JwtDto } from '@fullerstack/agx-dto';
import { tryGet } from '@fullerstack/agx-util';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
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
import { _ } from '@fullerstack/ngx-i18n';
import { JwtService } from '@fullerstack/ngx-jwt';
import { LoggerService } from '@fullerstack/ngx-logger';
import { MsgService } from '@fullerstack/ngx-msg';
import { StoreLogger, StoreService } from '@fullerstack/ngx-store';
import { cloneDeep, merge as ldNestedMerge } from 'lodash-es';
import { Observable, Subject } from 'rxjs';
import { filter, first, takeUntil, tap } from 'rxjs/operators';
import { DeepReadonly } from 'ts-essentials';

import { DefaultAuthConfig, DefaultAuthState } from './auth.default';
import { AUTH_STATE_SLICE_NAME, AuthState } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  private statePrivateKey: string;
  private destroy$ = new Subject<boolean>();
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  state: DeepReadonly<AuthState> = DefaultAuthState;
  stateSub$: Observable<AuthState>;
  isLoading: boolean;
  loginUrl: string;
  registerUrl: string;
  loggedInUrl: string;
  nextUrl: string;
  landingUrl: string;

  constructor(
    readonly router: Router,
    readonly store: StoreService,
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly msg: MsgService,
    readonly jwt: JwtService,
    readonly gql: GqlService
  ) {
    this.options = ldNestedMerge({ gtag: DefaultAuthConfig }, this.config.options);

    this.loginUrl = tryGet(() => this.options.localConfig.loginPageUrl, '/auth/login');
    this.loggedInUrl = tryGet(() => this.options.localConfig.loggedInLandingPageUrl, '/');
    this.registerUrl = tryGet(() => this.options.localConfig.registerPageUrl, '/auth/register');
    this.landingUrl = tryGet(() => this.config.options.localConfig.loggedInLandingPageUrl, '/');

    this.registerStateStore();
    this.initStoreState();
    this.subState();
    this.tokenRefreshRequest();

    logger.info(
      `[AUTH] AuthService ready ... (${this.state.isLoggedIn ? 'loggedIn' : 'Anonymous'})`
    );
  }

  private handleRedirect(prevState: AuthState) {
    if (!this.state.isLoggedIn && prevState.isLoggedIn) {
      this.initStoreState();
      this.router.navigate([this.loggedInUrl]);
    } else if (this.state.isLoggedIn && !prevState.isLoggedIn) {
      switch (this.router.url) {
        case this.loginUrl:
        case this.registerUrl:
          const forwardUrl = this.nextUrl || this.loggedInUrl;
          this.router.navigate([forwardUrl]);
      }
    }
  }

  /**
   * Initialize Auth state
   */
  private registerStateStore() {
    this.statePrivateKey = this.store.registerSlice(
      AUTH_STATE_SLICE_NAME,
      !this.options.production ? this.logger.info.bind(this.logger) : undefined
    );
  }

  /**
   * Initialize Auth state
   */
  private initStoreState() {
    this.store.setState(this.statePrivateKey, DefaultAuthState);
  }

  /**
   * Subscribe to Auth state changes
   */
  private subState() {
    this.stateSub$ = this.store.select$<AuthState>(AUTH_STATE_SLICE_NAME);

    this.stateSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (newState) => {
        const prevState = cloneDeep(this.state);
        this.state = { ...DefaultAuthState, ...newState };
        this.handleRedirect(prevState);

        this.isLoading =
          !newState.hasError && (newState.isAuthenticating || newState.isRegistering);
      },
    });
  }

  loginRequest(input: UserCredentialsInput) {
    this.store.setState(this.statePrivateKey, { ...DefaultAuthState, isAuthenticating: true });
    this.logger.debug('[AUTH] Login request sent ...');

    return this.gql.client
      .request<AuthTokenStatus>(AuthLoginMutation, { input })
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          let updateState: AuthState;
          if (resp.ok) {
            updateState = {
              ...DefaultAuthState,
              isLoggedIn: true,
              token: resp.token,
              userId: tryGet(() => this.jwt.getPayload<JwtDto>(resp.token).userId),
            };
            this.logger.debug('[AUTH] Login request success ...');
          } else {
            updateState = {
              ...DefaultAuthState,
              hasError: true,
              message: resp.message,
            };
            this.logger.error(`[AUTH] Login request failed ... ${resp.message}`);
          }
          this.store.setState(this.statePrivateKey, updateState);
        },
        error: (err) => {
          this.logger.error('[AUTH] ', err);
          this.store.setState(this.statePrivateKey, {
            ...DefaultAuthState,
            hasError: true,
            message: err.message,
          });
        },
      });
  }

  registerRequest(input: UserCreateInput) {
    this.store.setState(this.statePrivateKey, { ...DefaultAuthState, isRegistering: true });
    this.logger.debug('[AUTH] Register request sent ...');

    return this.gql.client
      .request<AuthTokenStatus>(AuthRegisterMutation, { input })
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          let updateState: AuthState;
          if (resp.ok) {
            updateState = {
              ...DefaultAuthState,
              isLoggedIn: true,
              token: resp.token,
              userId: tryGet(() => this.jwt.getPayload<JwtDto>(resp.token).userId),
            };
            this.logger.debug('[AUTH] Login request success ...');
          } else {
            updateState = {
              ...DefaultAuthState,
              hasError: true,
              message: resp.message,
            };
            this.logger.error(`[AUTH] Register request failed ... ${resp.message}`);
          }
          this.store.setState(this.statePrivateKey, updateState);
        },
        error: (err) => {
          this.logger.error('[AUTH] ', err);
          this.store.setState(this.statePrivateKey, {
            ...DefaultAuthState,
            hasError: true,
            message: err.message,
          });
        },
      });
  }

  tokenRefreshRequest() {
    this.logger.debug('[AUTH] Token refresh request sent ...');
    return this.gql.client
      .request<AuthTokenStatus>(AuthRefreshTokenMutation)
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          let updateState: AuthState;
          if (resp.ok) {
            updateState = {
              ...DefaultAuthState,
              isLoggedIn: true,
              token: resp.token,
              userId: tryGet(() => this.jwt.getPayload<JwtDto>(resp.token).userId),
            };
          } else {
            updateState = {
              ...DefaultAuthState,
              hasError: true,
              message: resp.message,
            };
          }
          this.store.setState(this.statePrivateKey, updateState);
        },
        error: (err) => {
          this.logger.error('[ AUTH ]', err);
          this.store.setState(this.statePrivateKey, {
            ...DefaultAuthState,
            hasError: true,
            message: err.message,
          });
        },
      });
  }

  tokenRetryRequest(): Observable<AuthTokenStatus> {
    this.logger.debug('[AUTH] Retry token refresh request sent ...');
    return this.gql.client.request<AuthTokenStatus>(AuthRefreshTokenMutation).pipe(
      tap((resp) => {
        if (resp.ok) {
          this.store.setState(this.statePrivateKey, { ...this.state, token: resp.token });
        }
      })
    );
  }

  logoutRequest() {
    this.logger.debug('[AUTH] Logout request sent ...');
    return this.gql.client
      .request<AuthStatus>(AuthLogoutMutation)
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.initStoreState();
          this.logger.debug('[AUTH] Logout request success ...');
        },
        error: (err) => {
          this.logger.error('[AUTH] ', err);
          this.initStoreState();
        },
      });
  }

  goTo(url: string) {
    this.router.navigate([url]);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.logger.debug('[AUTH] AuthService destroyed ...');
  }
}
