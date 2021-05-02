import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  BreakpointState,
  BreakpointObserver,
  Breakpoints,
} from '@angular/cdk/layout';

import { Observable, Subject } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';
import { Store, Select } from '@ngxs/store';
import { DeepReadonly } from 'ts-essentials';

import { tryGet } from '@fullerstack/agx-util';
import { ConfigService } from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';
import { MenuService } from '@fullerstack/ngx-menu';
import { I18nService, _ } from '@fullerstack/ngx-i18n';
import { UixService } from '@fullerstack/ngx-uix';

import * as actions from './store/layout-state.action';
import { LayoutState, NavMode } from './store/layout-state.model';
import { DefaultLayoutState } from './store/layout-state.default';
import { LayoutStoreState } from './store/layout-state.store';

@Injectable()
export class LayoutService implements OnDestroy {
  state: DeepReadonly<LayoutState> = DefaultLayoutState;
  @Select(LayoutStoreState) state$: Observable<LayoutState>;
  private breakpointSub$: Observable<BreakpointState>;
  private destroy$ = new Subject<boolean>();

  siteName = null;
  isDarkTheme = false;

  constructor(
    readonly bp$: BreakpointObserver,
    readonly router: Router,
    readonly store: Store,
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly i18n: I18nService,
    readonly uix: UixService,
    readonly msg: MenuService
  ) {
    this.breakpointSub$ = this.bp$.observe([
      Breakpoints.Handset,
      Breakpoints.XSmall,
      Breakpoints.Small,
    ]);

    this.siteName = config.options.appName;
    this.init();

    this.logger.debug('LayoutService ready ...');
  }
  s;

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();

    this.logger.debug('LayoutService destroyed ...');
  }

  private init() {
    this.state$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      this.state = state;
    });

    this.breakpointSub$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      if (!state.matches) {
        this.setMenuMode(NavMode.side);
        // if (!this._state.menuOpen) {
        //   this.toggleMenu();
        // }
      } else {
        this.setMenuMode(NavMode.over);
      }
    });

    this.store.dispatch(new actions.Initialize());
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
    return this.breakpointSub$;
  }

  setDarkTheme(isDark: boolean) {
    this.isDarkTheme = isDark;
  }
}
