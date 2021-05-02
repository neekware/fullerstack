import { Injectable, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { merge as ldNestedMerge } from 'lodash-es';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store, Select } from '@ngxs/store';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';

import {
  DefaultApplicationConfig,
  ConfigService,
  ApplicationConfig,
} from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';
import { _ } from '@fullerstack/ngx-i18n';
import { MsgService } from '@fullerstack/ngx-msg';
import { JwtService } from '@fullerstack/ngx-jwt';
import { GqlService } from '@fullerstack/ngx-gql';
import { tryGet } from '@fullerstack/agx-util';

import { AuthStoreState } from './store/auth-state.store';
import { DeepReadonly } from 'ts-essentials';
import { DefaultAuthConfig } from './auth.default';
import {
  AuthLoginCredentials,
  AuthRegisterCredentials,
  AuthState,
} from './store/auth-state.model';
import { DefaultAuthState } from './store/auth-state.default';
import { sanitizeState } from './store/auth-state.util';
import { AUTH_STATE_KEY } from './store/auth-state.constant';
import * as actions from './store/auth-state.action';

@Injectable()
export class AuthService implements OnDestroy {
  @Output() authStateChanged = new EventEmitter<AuthState>();
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
    this.options = ldNestedMerge(
      { gtag: DefaultAuthConfig },
      this.config.options
    );

    this.doInit();
    this.authenticationErrorMiddleware();
    this.initAuthorizationHeaderInsertionMiddleware();
    logger.debug(
      `AuthService ready ... (${
        this.state.isLoggedIn ? 'loggedIn' : 'Anonymous'
      })`
    );
  }

  private doInit() {
    this.initStorageEventHandler();
    this.stateSub$.pipe(takeUntil(this.destroy$)).subscribe((newState) => {
      if (sanitizeState(newState)) {
        if (this.state.signature !== newState.signature) {
          const prevState = this.state;
          this.state = newState;
          this.stateChangeTokenRefreshHandler();
          this.stateChangeRedirectHandler(prevState);
          this.authStateChanged.emit(this.state);
        }
      } else {
        this.logoutDispatch();
      }
    });
  }

  private stateChangeTokenRefreshHandler() {
    if (this.state.isLoggedIn && !this.state.isRefreshingToken) {
      const expiry = this.jwt.getRefreshTime(this.state.token) || 0;
      if (expiry <= 0) {
        this.stopTokenRefreshTimer(`Token expired ... ${expiry}`);
        this.logoutDispatch();
      } else {
        this.setTokenRefreshTimer(expiry);
      }
    }
  }

  private setTokenRefreshTimer(time: number) {
    this.stopTokenRefreshTimer('Another tab refreshed the token ...');
    this.logger.debug(`Token expiry ... (${time} seconds)`);
    this._refreshTimer = setTimeout(() => {
      this.stopTokenRefreshTimer('Time to refresh token ...');
      this.refreshDispatch();
    }, time * 1000);
  }

  private stopTokenRefreshTimer(logMsg = 'Token refresh canceled ...') {
    if (this._refreshTimer) {
      clearTimeout(this._refreshTimer);
      this._refreshTimer = null;
      this.logger.debug(logMsg);
    }
  }

  private stateChangeRedirectHandler(prevState: AuthState) {
    const loginUrl = tryGet(
      () => this.options.localConfig.loginPageUrl,
      '/auth/login'
    );

    const registrationUrl = tryGet(
      () => this.options.localConfig.registerPageUrl,
      '/auth/register'
    );

    const loggedInUrl = tryGet(
      () => this.options.localConfig.loggedInLandingPageUrl,
      '/'
    );

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
            let newState = <AuthState>(
              (sanitizeState(event.newValue) || DefaultAuthState)
            );
            this.store.dispatch(new actions.MultiTabSyncRequest(newState));
          }
        },
        false
      );
    }
  }

  private initAuthorizationHeaderInsertionMiddleware(realm = 'JWT') {
    const middleware = new ApolloLink((operation, forward) => {
      if (this.state.isLoggedIn) {
        if (this.jwt.isExpired(this.state.token)) {
          this.logoutDispatch();
        } else {
          const jwtHeader = `${realm} ${this.state.token}`;
          operation.setContext(({ headers = {} }) => ({
            headers: { ...headers, Authorization: jwtHeader },
          }));
          this.logger.debug(`${realm} header inserted ...`);
        }
      }
      return forward(operation);
    });
    // this.gql.insertLinks([middleware]);
  }

  private authenticationErrorMiddleware() {
    const afterware = onError(
      ({ response, operation, graphQLErrors, networkError }) => {
        if (networkError && (networkError as any).statusCode === 401) {
          this.logoutDispatch();
        }
      }
    );
    // this.gql.insertLinks([afterware]);
  }

  get isLoading() {
    return (
      !this.state.hasError &&
      (this.state.isAuthenticating || this.state.isRegistering)
    );
  }

  initiateLoginState() {
    if (!this.state.isLoggedIn) {
      this.msg.reset();
      const redirectUrl = tryGet(
        () => this.options.localConfig.loginPageUrl,
        '/auth/login'
      );
      this.router.navigate([redirectUrl]);
    }
  }

  initiateRegisterState() {
    if (!this.state.isLoggedIn) {
      this.msg.reset();
      const redirectUrl = tryGet(
        () => this.options.localConfig.registerPageUrl,
        '/auth/register'
      );
      this.router.navigate([redirectUrl]);
    }
  }

  initiateLogoutState() {
    if (this.state.isLoggedIn) {
      this.msg.reset();
      this.logoutDispatch();
      const redirectUrl = tryGet(
        () => this.options.localConfig.loggedOutRedirectUrl,
        '/'
      );
      this.router.navigate([redirectUrl]);
    }
  }

  initDispatch() {
    if (!this.state.isLoggedIn) {
      this.store.dispatch(new actions.Initialize());
    }
  }

  loginDispatch(payload: AuthLoginCredentials) {
    if (!this.state.isLoggedIn) {
      this.store.dispatch(new actions.LoginRequest(payload));
    }
  }

  registerDispatch(payload: AuthRegisterCredentials) {
    if (!this.state.isLoggedIn) {
      this.store.dispatch(new actions.RegisterRequest(payload));
    }
  }

  logoutDispatch() {
    this.store.dispatch(new actions.LogoutRequest());
  }

  refreshDispatch() {
    if (this.state.isLoggedIn) {
      this.store.dispatch(new actions.TokenRefreshRequest(this.state.token));
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.logger.debug('AuthService destroyed ...');
  }
}
