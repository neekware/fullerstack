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
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { JwtService } from '@fullerstack/ngx-jwt';
import { LoggerService } from '@fullerstack/ngx-logger';
import { MsgService } from '@fullerstack/ngx-msg';
import { StoreService } from '@fullerstack/ngx-store';
import { cloneDeep, merge as ldNestedMerge } from 'lodash-es';
import { Observable, Subject, of } from 'rxjs';
import { catchError, first, map, takeUntil, tap } from 'rxjs/operators';
import { DeepReadonly } from 'ts-essentials';

import { DefaultAuthConfig, DefaultAuthState, DefaultAuthUrls } from './auth.default';
import { AuthState, AuthUrls } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  private nameSpace = 'AUTH';
  private claimId: string;
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
    this.options = ldNestedMerge({ auth: DefaultAuthConfig }, this.config.options);

    this.authUrls = {
      ...this.authUrls,
      loginUrl: this.options?.localConfig?.loginPageUrl || this.authUrls.loginUrl,
      loggedInUrl: this.options?.localConfig?.loggedInUrl || this.authUrls.loggedInUrl,
      registerUrl: this.options?.localConfig?.registerUrl || this.authUrls.registerUrl,
      landingUrl: this.options?.localConfig?.landingUrl || this.authUrls.landingUrl,
    };

    this.initUrls();
    this.claimSlice();
    this.initState();
    this.subState();
    this.tokenRefreshRequest();

    logger.info(
      `[${this.nameSpace}] AuthService ready ... (${
        this.state.isLoggedIn ? 'loggedIn' : 'Anonymous'
      })`
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
   * Initialize Auth related navigable urls
   */
  private initUrls() {
    this.authUrls = {
      ...this.authUrls,
      loginUrl: this.options?.localConfig?.loginPageUrl || this.authUrls.loginUrl,
      loggedInUrl: this.options?.localConfig?.loggedInUrl || this.authUrls.loggedInUrl,
      registerUrl: this.options?.localConfig?.registerUrl || this.authUrls.registerUrl,
      landingUrl: this.options?.localConfig?.landingUrl || this.authUrls.landingUrl,
    };
  }

  /**
   * Claim Auth state:slice
   */
  private claimSlice() {
    const logger = this.options?.auth?.logState ? this.logger.debug.bind(this.logger) : undefined;
    this.claimId = this.store.claimSlice(this.nameSpace, logger);
  }

  /**
   * Initialize Auth state:slice
   */
  private initState() {
    this.store.setState(this.claimId, DefaultAuthState);
  }

  /**
   * Subscribe to Auth state:slice changes
   */
  private subState() {
    this.stateSub$ = this.store.select$<AuthState>(this.nameSpace);

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

  loginRequest(input: UserCredentialsInput): Observable<AuthState> {
    this.store.setState(this.claimId, { ...DefaultAuthState, isAuthenticating: true });
    this.logger.debug(`[${this.nameSpace}] Login request sent ...`);

    return this.gql.client
      .request<AuthTokenStatus>(AuthLoginMutation, { input })
      .pipe(
        map((resp) => {
          if (resp.ok) {
            this.logger.debug(`[${this.nameSpace}] Login request success ...`);
            return this.store.setState(this.claimId, {
              ...DefaultAuthState,
              isLoggedIn: true,
              token: resp.token,
              userId: this.jwt.getPayload<JwtDto>(resp.token)?.userId,
            });
          }
          this.logger.error(`[${this.nameSpace}] Login request failed ... ${resp.message}`);
          return this.store.setState(this.claimId, {
            ...DefaultAuthState,
            hasError: true,
            message: resp.message,
          });
        }),
        catchError((err) => {
          this.logger.error(`[${this.nameSpace}] Login request failed ...`, err);
          return of(
            this.store.setState(this.claimId, {
              ...DefaultAuthState,
              hasError: true,
              message: err.message,
            })
          );
        })
      );
  }

  registerRequest(input: UserCreateInput) {
    this.store.setState(this.claimId, { ...DefaultAuthState, isRegistering: true });
    this.logger.debug(`[${this.nameSpace}] Register request sent ...`);

    return this.gql.client
      .request<AuthTokenStatus>(AuthRegisterMutation, { input })
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          let updateState: AuthState;
          if (resp.ok) {
            const userId = tryGet(() => this.jwt.getPayload<JwtDto>(resp.token).userId);
            updateState = { ...DefaultAuthState, isLoggedIn: true, token: resp.token, userId };
            this.logger.debug(`[${this.nameSpace}] Login request success ...`);
            this.msg.successSnackBar(_('SUCCESS.AUTH.REGISTER'), { duration: 3000 });
          } else {
            updateState = { ...DefaultAuthState, hasError: true, message: resp.message };
            this.logger.error(`[${this.nameSpace}] Register request failed ... ${resp.message}`);
          }
          this.store.setState(this.claimId, updateState);
        },
        error: (err) => {
          this.store.setState(this.claimId, {
            ...DefaultAuthState,
            hasError: true,
            message: err.message,
          });
          this.logger.error(`[${this.nameSpace}] `, err);
        },
      });
  }

  tokenRefreshRequest() {
    this.logger.debug(`[${this.nameSpace}] Token refresh request sent ...`);
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
          this.store.setState(this.claimId, updateState);
        },
        error: (err) => {
          this.logger.error(`[${this.nameSpace}] `, err);
          this.store.setState(this.claimId, {
            ...DefaultAuthState,
            hasError: true,
            message: err.message,
          });
        },
      });
  }

  tokenRetryRequest$(): Observable<AuthTokenStatus> {
    this.logger.debug(`[${this.nameSpace}] Retry token refresh request sent ...`);
    return this.gql.client.request<AuthTokenStatus>(AuthRefreshTokenMutation).pipe(
      tap((resp) => {
        if (resp.ok) {
          this.store.setState(this.claimId, { ...this.state, token: resp.token });
        }
      })
    );
  }

  logoutRequest(onError = false) {
    this.logger.debug(`[${this.nameSpace}] Logout request sent ...`);
    this.initState();

    return this.gql.client
      .request<AuthStatus>(AuthLogoutMutation)
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.logger.debug(`[${this.nameSpace}] Logout request success ...`);
          if (!onError) {
            this.msg.successSnackBar(_('SUCCESS.AUTH.LOGOUT'), { duration: 3000 });
          } else {
            this.msg.errorSnackBar(_('ERROR.AUTH.LOGOUT'), { duration: 4000 });
          }
        },
        error: (err) => {
          this.logger.error(`[${this.nameSpace}] `, err);
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
    this.store.releaseSlice(this.nameSpace);
    this.logger.debug(`[${this.nameSpace}] AuthService destroyed ...`);
  }
}
