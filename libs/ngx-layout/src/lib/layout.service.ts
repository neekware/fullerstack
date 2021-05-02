import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  BreakpointState,
  BreakpointObserver,
  Breakpoints,
} from '@angular/cdk/layout';

import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Store, Select } from '@ngxs/store';

import { tryGet } from '@fullerstack/agx-util';
import { ConfigService } from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';
import { MenuService } from '@fullerstack/ngx-menu';
import { I18nService, _ } from '@fullerstack/ngx-i18n';
import { UixService } from '@fullerstack/ngx-uix';

import * as actions from './store/layout-state.action';
import { LayoutState, NavMode } from './store/layout-state.model';
import { LayoutDefaultState } from './store/layout-state.default';
import { LayoutStoreState } from './store/layout-state.store';

@Injectable()
export class LayoutService implements OnDestroy {
  private _state = LayoutDefaultState;
  @Select(LayoutStoreState) private _stateSub$: Observable<LayoutState>;
  private _isDestroyed = false;
  private _breakpointSub$: Observable<BreakpointState>;
  siteName = null;
  isDarkTheme = false;

  constructor(
    readonly breakPointObserver: BreakpointObserver,
    readonly router: Router,
    readonly store: Store,
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly i18n: I18nService,
    readonly uix: UixService,
    readonly menu: MenuService
  ) {
    this._breakpointSub$ = this.breakPointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.XSmall,
      Breakpoints.Small,
    ]);
    this.siteName = config.options.appName;
    this.logger.debug('LayoutService ready ...');
    this.init();
  }
  s;

  ngOnDestroy() {
    this._isDestroyed = true;
    this.logger.debug('LayoutService destroyed ...');
  }

  private init() {
    this._stateSub$
      .pipe(takeWhile(() => !this._isDestroyed))
      .subscribe((state) => {
        this._state = state;
      });
    this.store.dispatch(new actions.Initialize());
    this._breakpointSub$
      .pipe(takeWhile(() => !this._isDestroyed))
      .subscribe((state) => {
        if (!state.matches) {
          this.setMenuMode(NavMode.side);
          // if (!this._state.menuOpen) {
          //   this.toggleMenu();
          // }
        } else {
          this.setMenuMode(NavMode.over);
        }
      });
  }

  get state() {
    return this._state;
  }

  get stateSub$() {
    return this._stateSub$;
  }

  toggleMenu() {
    this.store.dispatch(new actions.ToggleMenu());
  }

  setMenuMode(mode: NavMode) {
    this.store.dispatch(new actions.SetMenuMode(mode));
  }

  toggleNotification() {
    this.store.dispatch(new actions.ToggleNotification());
  }

  toggleFullscreen() {
    this.store.dispatch(new actions.ToggleFullscreen()).subscribe((state) => {
      this.uix.toggleFullscreen();
    });
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  get sessionLinks() {
    return {
      login: {
        label: _('AUTH.LOGIN'),
        path: tryGet(() => this.config.options.loginPageUrl, '/auth/login'),
      },
      register: {
        label: _('AUTH.REGISTER'),
        path: tryGet(
          () => this.config.options.registerPageUrl,
          '/auth/register'
        ),
      },
      logout: {
        label: _('AUTH.LOGOUT'),
        path: tryGet(() => this.config.options.loggedOutRedirectUrl, '/'),
      },
    };
  }

  get handsetSub$() {
    return this._breakpointSub$;
  }

  setDarkTheme(isDark: boolean) {
    this.isDarkTheme = isDark;
  }
}
