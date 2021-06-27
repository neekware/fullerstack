/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

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
import { StoreService } from '@fullerstack/ngx-store';
import { cloneDeep, merge as ldNestedMerge } from 'lodash-es';
import { Observable, Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';
import { DeepReadonly } from 'ts-essentials';

import { DefaultAuthConfig, DefaultAuthState, DefaultAuthUrls } from './auth.default';
import { AUTH_STATE_SLICE_NAME, AuthState, AuthUrls } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  private statePrivateKey: string;
  private destroy$ = new Subject<boolean>();
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  state: DeepReadonly<AuthState> = DefaultAuthState;
  stateSub$: Observable<AuthState>;
  authUrls: DeepReadonly<AuthUrls> = DefaultAuthUrls;
  nextUrl: string;
  isLoading: boolean;

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

    this.authUrls = {
      ...this.authUrls,
      loginUrl: this.options?.localConfig?.loginPageUrl || this.authUrls.loginUrl,
      loggedInUrl: this.options?.localConfig?.loggedInUrl || this.authUrls.loggedInUrl,
      registerUrl: this.options?.localConfig?.registerUrl || this.authUrls.registerUrl,
      landingUrl: this.options?.localConfig?.landingUrl || this.authUrls.landingUrl,
    };

    this.registerState();
    this.initState();
    this.subState();
    this.tokenRefreshRequest();

    logger.info(
      `[AUTH] AuthService ready ... (${this.state.isLoggedIn ? 'loggedIn' : 'Anonymous'})`
    );
  }

  private handleRedirect(prevState: AuthState) {
    if (!this.state.isLoggedIn && prevState.isLoggedIn) {
      this.initState();
      this.goTo(this.authUrls.loggedInUrl);
    } else if (this.state.isLoggedIn && !prevState.isLoggedIn) {
      switch (this.router.url) {
        case this.authUrls.loginUrl:
        case this.authUrls.registerUrl:
          this.goTo(this.nextUrl || this.authUrls.loggedInUrl);
      }
    }
  }

  /**
   * Initialize Auth state
   */
  private registerState() {
    this.statePrivateKey = this.store.registerSlice(
      AUTH_STATE_SLICE_NAME,
      !this.options.production ? this.logger.info.bind(this.logger) : undefined
    );
  }

  /**
   * Initialize Auth state
   */
  private initState() {
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
            const userId = tryGet(() => this.jwt.getPayload<JwtDto>(resp.token).userId);
            updateState = { ...DefaultAuthState, isLoggedIn: true, token: resp.token, userId };
            this.logger.debug('[AUTH] Login request success ...');
            this.msg.successSnackBar(_('SUCCESS.AUTH.LOGIN'), { duration: 3000 });
          } else {
            updateState = { ...DefaultAuthState, hasError: true, message: resp.message };
            this.logger.error(`[AUTH] Login request failed ... ${resp.message}`);
          }
          this.store.setState(this.statePrivateKey, updateState);
        },
        error: (err) => {
          this.store.setState(this.statePrivateKey, {
            ...DefaultAuthState,
            hasError: true,
            message: err.message,
          });
          this.logger.error('[AUTH] ', err);
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
            const userId = tryGet(() => this.jwt.getPayload<JwtDto>(resp.token).userId);
            updateState = { ...DefaultAuthState, isLoggedIn: true, token: resp.token, userId };
            this.logger.debug('[AUTH] Login request success ...');
            this.msg.successSnackBar(_('SUCCESS.AUTH.REGISTER'), { duration: 3000 });
          } else {
            updateState = { ...DefaultAuthState, hasError: true, message: resp.message };
            this.logger.error(`[AUTH] Register request failed ... ${resp.message}`);
          }
          this.store.setState(this.statePrivateKey, updateState);
        },
        error: (err) => {
          this.store.setState(this.statePrivateKey, {
            ...DefaultAuthState,
            hasError: true,
            message: err.message,
          });
          this.logger.error('[AUTH] ', err);
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
            const userId = tryGet(() => this.jwt.getPayload<JwtDto>(resp.token).userId);
            updateState = { ...DefaultAuthState, isLoggedIn: true, token: resp.token, userId };
          } else {
            updateState = { ...DefaultAuthState, hasError: true, message: resp.message };
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

  tokenRetryRequest$(): Observable<AuthTokenStatus> {
    this.logger.debug('[AUTH] Retry token refresh request sent ...');
    return this.gql.client.request<AuthTokenStatus>(AuthRefreshTokenMutation).pipe(
      tap((resp) => {
        if (resp.ok) {
          this.store.setState(this.statePrivateKey, { ...this.state, token: resp.token });
        }
      })
    );
  }

  logoutRequest(onError = false) {
    this.logger.debug('[AUTH] Logout request sent ...');
    this.initState();

    return this.gql.client
      .request<AuthStatus>(AuthLogoutMutation)
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.logger.debug('[AUTH] Logout request success ...');
          if (!onError) {
            this.msg.successSnackBar(_('SUCCESS.AUTH.LOGOUT'), { duration: 3000 });
          } else {
            this.msg.errorSnackBar(_('ERROR.AUTH.LOGOUT'), { duration: 4000 });
          }
        },
        error: (err) => {
          this.logger.error('[AUTH] ', err);
          this.msg.errorSnackBar(_('ERROR.AUTH.LOGOUT'), { duration: 4000 });
        },
      });
  }

  goTo(url: string) {
    setTimeout(() => {
      this.router.navigate([url]);
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.logger.debug('[AUTH] AuthService destroyed ...');
  }
}
