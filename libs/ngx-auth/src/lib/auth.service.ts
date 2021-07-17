/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Injectable, OnDestroy } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtDto } from '@fullerstack/agx-dto';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { GqlErrorsHandler, GqlService } from '@fullerstack/ngx-gql';
import {
  AuthIsEmailAvailableQuery,
  AuthLoginMutation,
  AuthLogoutMutation,
  AuthPasswordResetRequestMutation,
  AuthRefreshTokenMutation,
  AuthRegisterMutation,
  AuthVerifyUserMutation,
} from '@fullerstack/ngx-gql/operations';
import {
  AuthStatus,
  AuthTokenStatus,
  ChangePasswordRequestInput,
  UserCreateInput,
  UserCredentialsInput,
  UserVerifyInput,
} from '@fullerstack/ngx-gql/schema';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { JwtService } from '@fullerstack/ngx-jwt';
import { LoggerService } from '@fullerstack/ngx-logger';
import { MsgService } from '@fullerstack/ngx-msg';
import { StoreService } from '@fullerstack/ngx-store';
import { cloneDeep, merge as ldNestedMerge } from 'lodash-es';
import { Observable, Subject, of, timer } from 'rxjs';
import { catchError, first, map, switchMap, takeUntil } from 'rxjs/operators';
import { DeepReadonly } from 'ts-essentials';

import { DefaultAuthConfig, DefaultAuthState, DefaultAuthUrls } from './auth.default';
import { AuthState, AuthStateAction, AuthUrls } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  private nameSpace = 'AUTH';
  private claimId: string;
  private destroy$ = new Subject<boolean>();
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  state: DeepReadonly<AuthState> = DefaultAuthState;
  readonly stateSub$: Observable<AuthState>;
  authUrls: DeepReadonly<AuthUrls> = DefaultAuthUrls;
  nextUrl: string;

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

    this.stateSub$ = this.store.select$<AuthState>(this.nameSpace);

    this.initUrls();
    this.claimSlice();
    this.initState();
    this.subState();
    this.tokenRefreshRequest$().pipe(first(), takeUntil(this.destroy$)).subscribe();

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
    this.store.setState(this.claimId, DefaultAuthState, AuthStateAction.AUTH_INITIALIZE);
  }

  /**
   * Subscribe to Auth state:slice changes
   */
  private subState() {
    this.stateSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (newState) => {
        const prevState = cloneDeep(this.state);
        this.state = { ...DefaultAuthState, ...newState };
        this.handleRedirect(prevState);
      },
    });
  }

  loginRequest$(input: UserCredentialsInput): Observable<AuthState> {
    this.store.setState(
      this.claimId,
      {
        ...DefaultAuthState,
        isAuthenticating: true,
        isLoading: true,
      },
      AuthStateAction.AUTH_LOGIN_REQ_SENT
    );
    this.logger.debug(`[${this.nameSpace}] Login request sent ...`);

    return this.gql.client
      .request<AuthTokenStatus>(AuthLoginMutation, { input })
      .pipe(
        map((resp) => {
          if (resp.ok) {
            this.logger.debug(`[${this.nameSpace}] Login request success ...`);
            this.msg.successSnackBar(_('SUCCESS.AUTH.LOGIN'), { duration: 3000 });
            return this.store.setState(
              this.claimId,
              {
                ...DefaultAuthState,
                isLoggedIn: true,
                token: resp.token,
                userId: this.jwt.getPayload<JwtDto>(resp.token)?.userId,
              },
              AuthStateAction.AUTH_LOGIN_RES_SUCCESS
            );
          }
          this.logger.error(`[${this.nameSpace}] Login request failed ... ${resp.message}`);
          return this.store.setState(
            this.claimId,
            {
              ...DefaultAuthState,
              hasError: true,
              message: resp.message,
            },
            AuthStateAction.AUTH_LOGOUT_RES_FAILED
          );
        }),
        catchError((err: GqlErrorsHandler) => {
          this.logger.error(`[${this.nameSpace}] Login request failed ...`, err);
          return of(
            this.store.setState(
              this.claimId,
              {
                ...DefaultAuthState,
                hasError: true,
                message: err.topError?.message,
              },
              AuthStateAction.AUTH_LOGOUT_RES_FAILED
            )
          );
        })
      );
  }

  registerRequest$(input: UserCreateInput): Observable<AuthState> {
    this.store.setState(
      this.claimId,
      {
        ...DefaultAuthState,
        isRegistering: true,
        isLoading: true,
      },
      AuthStateAction.AUTH_REGISTER_REQ_SENT
    );
    this.logger.debug(`[${this.nameSpace}] Register request sent ...`);

    return this.gql.client
      .request<AuthTokenStatus>(AuthRegisterMutation, { input })
      .pipe(
        map((resp) => {
          if (resp.ok) {
            this.logger.debug(`[${this.nameSpace}] Register request success ...`);
            this.msg.successSnackBar(_('SUCCESS.AUTH.REGISTER'), { duration: 3000 });
            return this.store.setState(
              this.claimId,
              {
                ...DefaultAuthState,
                isLoggedIn: true,
                token: resp.token,
                userId: this.jwt.getPayload<JwtDto>(resp.token)?.userId,
              },
              AuthStateAction.AUTH_REGISTER_RES_SUCCESS
            );
          }
          this.logger.error(`[${this.nameSpace}] Register request failed ... ${resp.message}`);
          return this.store.setState(
            this.claimId,
            {
              ...DefaultAuthState,
              hasError: true,
              message: resp.message,
            },
            AuthStateAction.AUTH_REGISTER_RES_FAILED
          );
        }),
        catchError((err: GqlErrorsHandler) => {
          this.logger.error(`[${this.nameSpace}] Register request failed ...`, err);
          return of(
            this.store.setState(
              this.claimId,
              {
                ...DefaultAuthState,
                hasError: true,
                message: err.topError?.message,
              },
              AuthStateAction.AUTH_REGISTER_RES_FAILED
            )
          );
        })
      );
  }

  tokenRefreshRequest$(): Observable<AuthState> {
    this.logger.debug(`[${this.nameSpace}] Token refresh request sent ...`);
    return this.gql.client.request<AuthTokenStatus>(AuthRefreshTokenMutation).pipe(
      map((resp) => {
        if (resp.ok) {
          this.logger.debug(`[${this.nameSpace}] Token refresh request success ...`);
          return this.store.setState(
            this.claimId,
            {
              ...DefaultAuthState,
              isLoggedIn: true,
              token: resp.token,
              userId: this.jwt.getPayload<JwtDto>(resp.token)?.userId,
            },
            AuthStateAction.AUTH_REFRESH_TOKEN_RES_SUCCESS
          );
        }
        this.logger.error(`[${this.nameSpace}] Token refresh request failed ... ${resp.message}`);
        return this.store.setState(
          this.claimId,
          {
            ...DefaultAuthState,
            logoutRequired: true,
            hasError: this.state.isLoggedIn ? true : false,
            message: resp.message,
          },
          AuthStateAction.AUTH_REFRESH_TOKEN_RES_FAILED
        );
      }),
      catchError((err: GqlErrorsHandler) => {
        if (this.state.isLoggedIn) {
          this.logger.error(`[${this.nameSpace}] Token refresh request failed ...`, err);
        }

        return of(
          this.store.setState(
            this.claimId,
            {
              ...DefaultAuthState,
              logoutRequired: true,
              hasError: this.state.isLoggedIn ? true : false,
              message: err.topError?.message,
            },
            AuthStateAction.AUTH_REFRESH_TOKEN_RES_FAILED
          )
        );
      })
    );
  }

  logoutRequest(onError = false) {
    this.logger.debug(`[${this.nameSpace}] Logout request sent ...`);
    this.store.setState(this.claimId, DefaultAuthState, AuthStateAction.AUTH_LOGIN_REQ_SENT);

    return this.gql.client
      .request<AuthStatus>(AuthLogoutMutation)
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe({
        error: (err) => {
          this.logger.error(`[${this.nameSpace}] `, err);
        },
        complete: () => {
          if (!onError) {
            this.logger.debug(`[${this.nameSpace}] Logout request success ...`);
            this.msg.successSnackBar(_('SUCCESS.AUTH.LOGOUT'), { duration: 3000 });
          } else {
            this.msg.errorSnackBar(_('ERROR.AUTH.LOGOUT'), { duration: 4000 });
          }
        },
      });
  }

  verifyUserRequest$(input: UserVerifyInput): Observable<AuthStatus> {
    return this.gql.client
      .request<AuthStatus>(AuthVerifyUserMutation, { input })
      .pipe(
        map((resp) => {
          if (resp.ok) {
            this.logger.debug(`[${this.nameSpace}] User verification request success ...`);
          } else {
            this.logger.error(
              `[${this.nameSpace}] User verification request failed ... ${resp.message}`
            );
          }
          return resp;
        }),
        catchError((err: GqlErrorsHandler) => {
          if (this.state.isLoggedIn) {
            this.logger.error(
              `[${this.nameSpace}] User verification request request failed ...`,
              err
            );
          }

          return of({ ok: false, message: err.topError?.message });
        })
      ) as Observable<AuthStatus>;
  }

  passwordResetRequest$(input: ChangePasswordRequestInput): Observable<AuthStatus> {
    return this.gql.client
      .request<AuthStatus>(AuthPasswordResetRequestMutation, { input })
      .pipe(
        map((resp) => {
          if (resp.ok) {
            this.logger.debug(`[${this.nameSpace}] Password reset request success ...`);
          } else {
            this.logger.error(
              `[${this.nameSpace}] Password reset request failed ... ${resp.message}`
            );
          }
          return resp;
        }),
        catchError((err: GqlErrorsHandler) => {
          if (this.state.isLoggedIn) {
            this.logger.error(`[${this.nameSpace}] Password reset request failed ...`, err);
          }

          return of({ ok: false, message: err.topError?.message });
        })
      ) as Observable<AuthStatus>;
  }

  passwordResetPerform$(input: ChangePasswordRequestInput): Observable<AuthStatus> {
    return this.gql.client
      .request<AuthStatus>(AuthPasswordResetRequestMutation, { input })
      .pipe(
        map((resp) => {
          if (resp.ok) {
            this.logger.debug(`[${this.nameSpace}] Password reset request success ...`);
          } else {
            this.logger.error(
              `[${this.nameSpace}] Password reset request failed ... ${resp.message}`
            );
          }
          return resp;
        }),
        catchError((err: GqlErrorsHandler) => {
          if (this.state.isLoggedIn) {
            this.logger.error(`[${this.nameSpace}] Password reset request failed ...`, err);
          }

          return of({ ok: false, message: err.topError?.message });
        })
      ) as Observable<AuthStatus>;
  }

  isEmailAvailable(email: string): Observable<boolean> {
    return this.gql.client
      .request<AuthStatus>(AuthIsEmailAvailableQuery, { email })
      .pipe(
        map((resp) => resp.ok),
        catchError((err: GqlErrorsHandler) => {
          this.logger.error(`[${this.nameSpace}] email availability check ...`, err);
          return of(false);
        })
      );
  }

  validateEmailAvailability(debounce = 600): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return timer(debounce).pipe(
        switchMap(() => this.isEmailAvailable(control.value)),
        map((available) => (available ? null : { emailInUse: true }))
      );
    };
  }

  validateEmailExistence(debounce = 600): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return timer(debounce).pipe(
        switchMap(() => this.isEmailAvailable(control.value)),
        map((available) => (available ? { emailNotFound: true } : null))
      );
    };
  }

  goTo(url: string) {
    setTimeout(() => {
      this.router.navigate([url || '/']);
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.store.releaseSlice(this.nameSpace);
    this.logger.debug(`[${this.nameSpace}] AuthService destroyed ...`);
  }
}
