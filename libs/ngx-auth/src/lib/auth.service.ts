/* eslint-disable */
import { EventEmitter, Injectable, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { tryGet } from '@fullerstack/agx-util';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { GqlService } from '@fullerstack/ngx-gql';
import { UserCreateInput, UserCredentialsInput } from '@fullerstack/ngx-gql/schema';
import { _ } from '@fullerstack/ngx-i18n';
import { JwtService } from '@fullerstack/ngx-jwt';
import { LoggerService } from '@fullerstack/ngx-logger';
import { MsgService } from '@fullerstack/ngx-msg';
import { Select, Store } from '@ngxs/store';
import { cloneDeep, merge as ldNestedMerge } from 'lodash-es';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DeepReadonly } from 'ts-essentials';

import { DefaultAuthConfig } from './auth.default';
import * as actions from './store/auth-state.action';
import { DefaultAuthState } from './store/auth-state.default';
import { AuthState } from './store/auth-state.model';
import { AuthStoreState } from './store/auth-state.store';

@Injectable()
export class AuthService implements OnDestroy {
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  authChanged$ = new BehaviorSubject<AuthState>(DefaultAuthState);
  @Select(AuthStoreState) private stateSub$: Observable<AuthState>;
  state: DeepReadonly<AuthState> = DefaultAuthState;
  isLoading: boolean;
  private destroy$ = new Subject<boolean>();
  loginUrl: string;
  registerUrl: string;
  loggedInUrl: string;

  constructor(
    readonly router: Router,
    readonly store: Store,
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

    this.stateSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (newState) => {
        if (this.state.isLoggedIn !== newState.isLoggedIn) {
          const prevState = cloneDeep(this.state);
          this.state = cloneDeep(newState);
          this.handleRedirect(prevState);
          this.authChanged$.next(this.state);
        }
        this.isLoading =
          !newState.hasError && (newState.isAuthenticating || newState.isRegistering);
      },
    });

    logger.info(`AuthService ready ... (${this.state.isLoggedIn ? 'loggedIn' : 'Anonymous'})`);
    this.refreshDispatch();
  }

  private handleRedirect(prevState: AuthState) {
    if (!this.state.isLoggedIn && prevState.isLoggedIn) {
      this.logoutDispatch();
      this.initDispatch();
      this.router.navigate([this.loggedInUrl]);
    } else if (this.state.isLoggedIn && !prevState.isLoggedIn) {
      switch (this.router.url) {
        case this.loginUrl:
        case this.registerUrl:
          this.router.navigate([this.loggedInUrl]);
      }
    }
  }

  initDispatch() {
    this.store.dispatch(new actions.Initialize());
  }

  initiateLoginState() {
    if (!this.state.isLoggedIn) {
      this.msg.reset();
      this.router.navigate([this.loginUrl]);
    }
  }

  initiateRegisterState() {
    if (!this.state.isLoggedIn) {
      this.msg.reset();
      this.router.navigate([this.registerUrl]);
    }
  }

  initiateLogoutState() {
    if (this.state.isLoggedIn) {
      this.msg.reset();
      this.logoutDispatch();
      this.router.navigate([this.loggedInUrl]);
    }
  }

  loginDispatch(payload: UserCredentialsInput) {
    if (!this.state.isLoggedIn) {
      this.store.dispatch(new actions.LoginRequest(payload));
    }
  }

  registerDispatch(payload: UserCreateInput) {
    if (!this.state.isLoggedIn) {
      this.store.dispatch(new actions.RegisterRequest(payload));
    }
  }

  logoutDispatch() {
    this.store.dispatch(new actions.LogoutRequest());
  }

  refreshDispatch(): Observable<any> {
    return this.store.dispatch(new actions.TokenRefreshRequest());
  }

  goTo(url: string) {
    this.router.navigate([url]);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.logger.debug('AuthService destroyed ...');
  }
}
