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
  AuthEmailChangePerformMutation,
  AuthEmailChangeRequestMutation,
  AuthEmailVerifyAvailabilityQuery,
  AuthPasswordChangeMutation,
  AuthPasswordPerformResetMutation,
  AuthPasswordResetRequestMutation,
  AuthPasswordVerifyQuery,
  AuthPasswordVerifyResetRequestMutation,
  AuthTokenRefreshMutation,
  AuthUserLoginMutation,
  AuthUserLogoutMutation,
  AuthUserSignupMutation,
  AuthUserVerifyMutation,
} from '@fullerstack/ngx-gql/operations';
import {
  AuthEmailChangePerformInput,
  AuthEmailChangeRequestInput,
  AuthEmailVerifyAvailabilityInput,
  AuthPasswordChangeInput,
  AuthPasswordChangeRequestInput,
  AuthPasswordPerformResetInput,
  AuthPasswordVerifyInput,
  AuthPasswordVerifyResetRequestInput,
  AuthStatus,
  AuthTokenStatus,
  AuthUserCredentialsInput,
  AuthUserSignupInput,
  AuthUserVerifyInput,
} from '@fullerstack/ngx-gql/schema';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { JwtService } from '@fullerstack/ngx-jwt';
import { LogLevel, LoggerService } from '@fullerstack/ngx-logger';
import { MsgService } from '@fullerstack/ngx-msg';
import { StoreService } from '@fullerstack/ngx-store';
import { cloneDeep, merge as ldNestedMerge } from 'lodash-es';
import { Observable, Subject, of, timer } from 'rxjs';
import { catchError, first, map, switchMap, takeUntil } from 'rxjs/operators';
import { DeepReadonly } from 'ts-essentials';

import {
  AsyncValidationDebounceTime,
  DefaultAuthConfig,
  DefaultAuthState,
  DefaultAuthUrls,
} from './auth.default';
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
    this.msg.reset();
    this.options = ldNestedMerge({ auth: DefaultAuthConfig }, this.config.options);

    this.authUrls = {
      ...this.authUrls,
      loginUrl: this.options?.localConfig?.loginPageUrl || this.authUrls.loginUrl,
      loggedInUrl: this.options?.localConfig?.loggedInUrl || this.authUrls.loggedInUrl,
      signupUrl: this.options?.localConfig?.signupUrl || this.authUrls.signupUrl,
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
        case this.authUrls.signupUrl:
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
      signupUrl: this.options?.localConfig?.signupUrl || this.authUrls.signupUrl,
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

  goTo(url: string) {
    setTimeout(() => {
      this.router.navigate([url || '/']);
    });
  }

  loginRequest$(input: AuthUserCredentialsInput): Observable<AuthState> {
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
      .request<AuthTokenStatus>(AuthUserLoginMutation, { input })
      .pipe(
        map((resp) => {
          if (resp.ok) {
            this.logger.debug(`[${this.nameSpace}] Login request success ...`);
            this.msg.successToast(_('SUCCESS.AUTH.LOGIN'), { duration: 3000 });

            this.goTo(this.authUrls.loggedInUrl);

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
          this.msg.setMsg({ text: resp.message || _('ERROR.AUTH.LOGIN'), level: LogLevel.error });
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
          this.msg.setMsg({
            text: err.topError?.message || _('ERROR.AUTH.LOGIN'),
            level: LogLevel.error,
          });

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

  signupRequest$(input: AuthUserSignupInput): Observable<AuthState> {
    this.msg.reset();

    this.store.setState(
      this.claimId,
      {
        ...DefaultAuthState,
        isSigningUp: true,
        isLoading: true,
      },
      AuthStateAction.AUTH_SIGNUP_REQ_SENT
    );
    this.logger.debug(`[${this.nameSpace}] Signup request sent ...`);

    return this.gql.client
      .request<AuthTokenStatus>(AuthUserSignupMutation, { input })
      .pipe(
        map((resp) => {
          if (resp.ok) {
            this.logger.debug(`[${this.nameSpace}] Signup request success ...`);
            this.msg.successToast(_('SUCCESS.AUTH.SIGNUP'), { duration: 3000 });

            this.goTo(this.authUrls.loggedInUrl);

            return this.store.setState(
              this.claimId,
              {
                ...DefaultAuthState,
                isLoggedIn: true,
                token: resp.token,
                userId: this.jwt.getPayload<JwtDto>(resp.token)?.userId,
              },
              AuthStateAction.AUTH_SIGNUP_RES_SUCCESS
            );
          }
          this.logger.error(`[${this.nameSpace}] Signup request failed ... ${resp.message}`);
          this.msg.setMsg({ text: resp.message || _('ERROR.AUTH.SIGNUP'), level: LogLevel.error });
          return this.store.setState(
            this.claimId,
            {
              ...DefaultAuthState,
              hasError: true,
              message: resp.message,
            },
            AuthStateAction.AUTH_SIGNUP_RES_FAILED
          );
        }),
        catchError((err: GqlErrorsHandler) => {
          this.logger.error(`[${this.nameSpace}] Signup request failed ...`, err);
          this.msg.setMsg({
            text: err.topError?.message || _('ERROR.AUTH.SIGNUP'),
            level: LogLevel.error,
          });
          return of(
            this.store.setState(
              this.claimId,
              {
                ...DefaultAuthState,
                hasError: true,
                message: err.topError?.message,
              },
              AuthStateAction.AUTH_SIGNUP_RES_FAILED
            )
          );
        })
      );
  }

  tokenRefreshRequest$(): Observable<AuthState> {
    this.logger.debug(`[${this.nameSpace}] Token refresh request sent ...`);
    return this.gql.client.request<AuthTokenStatus>(AuthTokenRefreshMutation).pipe(
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

    this.gql.client
      .request<AuthStatus>(AuthUserLogoutMutation)
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe({
        error: (err) => {
          this.logger.error(`[${this.nameSpace}] `, err);
        },
        complete: () => {
          if (!onError) {
            this.logger.debug(`[${this.nameSpace}] Logout request success ...`);
            this.msg.successToast(_('SUCCESS.AUTH.LOGOUT'), { duration: 3000 });
          } else {
            this.msg.errorToast(_('ERROR.AUTH.LOGOUT'), { duration: 4000 });
          }
        },
      });
  }

  verifyUserRequest$(input: AuthUserVerifyInput): Observable<AuthStatus> {
    return this.gql.client
      .request<AuthStatus>(AuthUserVerifyMutation, { input })
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

  passwordChange$(input: AuthPasswordChangeInput): Observable<AuthStatus> {
    return this.gql.client
      .request<AuthStatus>(AuthPasswordChangeMutation, { input })
      .pipe(
        map((resp) => {
          if (resp.ok) {
            this.logger.debug(`[${this.nameSpace}] Password change success ...`);
          } else {
            this.logger.error(`[${this.nameSpace}] Password change failed ... ${resp.message}`);
          }
          return resp;
        }),
        catchError((err: GqlErrorsHandler) => {
          if (this.state.isLoggedIn) {
            this.logger.error(`[${this.nameSpace}] Password change failed ...`, err);
          }

          return of({ ok: false, message: err.topError?.message });
        })
      ) as Observable<AuthStatus>;
  }

  passwordResetRequest$(input: AuthPasswordChangeRequestInput): Observable<AuthStatus> {
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

  passwordResetPerform$(input: AuthPasswordPerformResetInput): Observable<AuthStatus> {
    return this.gql.client
      .request<AuthStatus>(AuthPasswordPerformResetMutation, { input })
      .pipe(
        map((resp) => {
          if (resp.ok) {
            this.logger.debug(`[${this.nameSpace}] Password reset success ...`);
          } else {
            this.logger.error(`[${this.nameSpace}] Password reset failed ... ${resp.message}`);
          }
          return resp;
        }),
        catchError((err: GqlErrorsHandler) => {
          if (this.state.isLoggedIn) {
            this.logger.error(`[${this.nameSpace}] Password reset failed ...`, err);
          }

          return of({ ok: false, message: err.topError?.message });
        })
      ) as Observable<AuthStatus>;
  }

  verifyPasswordResetRequest$(input: AuthPasswordVerifyResetRequestInput): Observable<AuthStatus> {
    return this.gql.client
      .request<AuthStatus>(AuthPasswordVerifyResetRequestMutation, { input })
      .pipe(
        map((resp) => {
          if (resp.ok) {
            this.logger.debug(
              `[${this.nameSpace}] Password reset request verification success ...`
            );
          } else {
            this.logger.error(
              `[${this.nameSpace}] Password reset request verification failed ... ${resp.message}`
            );
          }
          return resp;
        }),
        catchError((err: GqlErrorsHandler) => {
          if (this.state.isLoggedIn) {
            this.logger.error(
              `[${this.nameSpace}] Password reset request verification failed ...`,
              err
            );
          }

          return of({ ok: false, message: err.topError?.message });
        })
      ) as Observable<AuthStatus>;
  }

  verifyUserPassword$(input: AuthPasswordVerifyInput): Observable<boolean> {
    return this.gql.client
      .request<AuthStatus>(AuthPasswordVerifyQuery, { input })
      .pipe(
        map((resp) => resp.ok),
        catchError((err: GqlErrorsHandler) => {
          this.logger.error(`[${this.nameSpace}] password verification check ...`, err);
          return of(false);
        })
      );
  }

  emailChangeRequest$(input: AuthEmailChangeRequestInput): Observable<AuthStatus> {
    return this.gql.client
      .request<AuthStatus>(AuthEmailChangeRequestMutation, { input })
      .pipe(
        map((resp) => {
          if (resp.ok) {
            this.logger.debug(`[${this.nameSpace}] Email change request success ...`);
          } else {
            this.logger.error(
              `[${this.nameSpace}] Email change request failed ... ${resp.message}`
            );
          }
          return resp;
        }),
        catchError((err: GqlErrorsHandler) => {
          if (this.state.isLoggedIn) {
            this.logger.error(`[${this.nameSpace}] Email change request failed ...`, err);
          }

          return of({ ok: false, message: err.topError?.message });
        })
      ) as Observable<AuthStatus>;
  }

  emailChangePerform$(input: AuthEmailChangePerformInput): Observable<AuthStatus> {
    return this.gql.client
      .request<AuthStatus>(AuthEmailChangePerformMutation, { input })
      .pipe(
        map((resp) => {
          if (resp.ok) {
            this.logger.debug(`[${this.nameSpace}] Email change request verification success ...`);
          } else {
            this.logger.error(
              `[${this.nameSpace}] Email change request verification failed ... ${resp.message}`
            );
          }
          return resp;
        }),
        catchError((err: GqlErrorsHandler) => {
          if (this.state.isLoggedIn) {
            this.logger.error(
              `[${this.nameSpace}] Email change request verification failed ...`,
              err
            );
          }

          return of({ ok: false, message: err.topError?.message });
        })
      ) as Observable<AuthStatus>;
  }

  verifyEmailAvailability$(input: AuthEmailVerifyAvailabilityInput): Observable<boolean> {
    return this.gql.client
      .request<AuthStatus>(AuthEmailVerifyAvailabilityQuery, { input })
      .pipe(
        map((resp) => resp.ok),
        catchError((err: GqlErrorsHandler) => {
          this.logger.error(`[${this.nameSpace}] email availability check ...`, err);
          return of(false);
        })
      );
  }

  validateUserPassword(debounce = AsyncValidationDebounceTime): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return timer(debounce).pipe(
        switchMap(() => this.verifyUserPassword$({ password: control.value })),
        map((valid) => (valid ? null : { incorrectPassword: true }))
      );
    };
  }

  validateEmailAvailability(debounce = AsyncValidationDebounceTime): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return timer(debounce).pipe(
        switchMap(() => this.verifyEmailAvailability$({ email: control.value })),
        map((available) => (available ? null : { emailInUse: true }))
      );
    };
  }

  validateEmailExistence(debounce = AsyncValidationDebounceTime): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return timer(debounce).pipe(
        switchMap(() => this.verifyEmailAvailability$({ email: control.value })),
        map((available) => (available ? { emailNotFound: true } : null))
      );
    };
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.store.releaseSlice(this.nameSpace);
    this.logger.debug(`[${this.nameSpace}] AuthService destroyed ...`);
  }
}
