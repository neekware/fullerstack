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
import * as gqlSchema from '@fullerstack/ngx-gql/schema';
import { _ } from '@fullerstack/ngx-i18n';
import { JwtService } from '@fullerstack/ngx-jwt';
import { LoggerService } from '@fullerstack/ngx-logger';
import { MsgService } from '@fullerstack/ngx-msg';
import { Select, Store } from '@ngxs/store';
import { merge as ldNestedMerge } from 'lodash-es';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DeepReadonly } from 'ts-essentials';

import { DefaultAuthConfig } from './auth.default';
import * as actions from './store/auth-state.action';
import { AUTH_STATE_KEY } from './store/auth-state.constant';
import { DefaultAuthState } from './store/auth-state.default';
import { AuthState } from './store/auth-state.model';
import { AuthStoreState } from './store/auth-state.store';
import { sanitizeState } from './store/auth-state.util';

@Injectable()
export class AuthService implements OnDestroy {
  @Output() authChanged$ = new EventEmitter<AuthState>();
  @Select(AuthStoreState) private stateSub$: Observable<AuthState>;
  private destroy$ = new Subject<boolean>();
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  state: DeepReadonly<AuthState> = DefaultAuthState;
  private _refreshTimer = null;

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

    this.doInit();
    logger.info(`AuthService ready ... (${this.state.isLoggedIn ? 'loggedIn' : 'Anonymous'})`);
  }

  private doInit() {
    this.initStorageEventHandler();
    this.stateSub$.pipe(takeUntil(this.destroy$)).subscribe((newState) => {
      if (sanitizeState(newState)) {
        if (this.state.signature !== newState.signature) {
          const prevState = this.state;
          this.state = newState;
          this.stateChangeRedirectHandler(prevState);
          this.authChanged$.emit(this.state);
        }
      } else {
        this.logoutDispatch();
      }
    });
  }

  private stateChangeRedirectHandler(prevState: AuthState) {
    const loginUrl = tryGet(() => this.options.localConfig.loginPageUrl, '/auth/login');

    const registrationUrl = tryGet(
      () => this.options.localConfig.registerPageUrl,
      '/auth/register'
    );

    const loggedInUrl = tryGet(() => this.options.localConfig.loggedInLandingPageUrl, '/');

    if (!this.state.isLoggedIn && prevState.isLoggedIn) {
      this.initDispatch();
      this.router.navigate([loggedInUrl]);
    } else if (this.state.isLoggedIn && !prevState.isLoggedIn) {
      switch (this.router.url) {
        case loginUrl:
        case registrationUrl:
          this.router.navigate([loggedInUrl]);
      }
    }
  }

  private initStorageEventHandler() {
    if (this.options.localConfig.multiTab) {
      addEventListener(
        'storage',
        (event) => {
          if (event.key === AUTH_STATE_KEY) {
            let newState = <AuthState>(sanitizeState(event.newValue) || DefaultAuthState);
            this.store.dispatch(new actions.MultiTabSyncRequest(newState));
          }
        },
        false
      );
    }
  }

  get isLoading() {
    return !this.state.hasError && (this.state.isAuthenticating || this.state.isRegistering);
  }

  initiateLoginState() {
    if (!this.state.isLoggedIn) {
      this.msg.reset();
      const redirectUrl = tryGet(() => this.options.localConfig.loginPageUrl, '/auth/login');
      this.router.navigate([redirectUrl]);
    }
  }

  initiateRegisterState() {
    if (!this.state.isLoggedIn) {
      this.msg.reset();
      const redirectUrl = tryGet(() => this.options.localConfig.registerPageUrl, '/auth/register');
      this.router.navigate([redirectUrl]);
    }
  }

  initiateLogoutState() {
    if (this.state.isLoggedIn) {
      this.msg.reset();
      this.logoutDispatch();
      const redirectUrl = tryGet(() => this.options.localConfig.loggedOutRedirectUrl, '/');
      this.router.navigate([redirectUrl]);
    }
  }

  initDispatch() {
    if (!this.state.isLoggedIn) {
      this.store.dispatch(new actions.Initialize());
    }
  }

  loginDispatch(payload: gqlSchema.UserCredentialsInput) {
    if (!this.state.isLoggedIn) {
      this.store.dispatch(new actions.LoginRequest(payload));
    }
  }

  registerDispatch(payload: gqlSchema.UserCreateInput) {
    if (!this.state.isLoggedIn) {
      this.store.dispatch(new actions.RegisterRequest(payload));
    }
  }

  logoutDispatch() {
    this.store.dispatch(new actions.LogoutRequest());
  }

  // refreshDispatch() {
  //   if (this.state.isLoggedIn) {
  //     this.store.dispatch(new actions.TokenRefreshRequest(this.state.token));
  //   }
  // }

  goTo(url: string) {
    this.router.navigate([url]);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.logger.debug('AuthService destroyed ...');
  }
}
