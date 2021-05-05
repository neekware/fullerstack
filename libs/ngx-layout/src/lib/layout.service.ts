import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  BreakpointState,
  BreakpointObserver,
  Breakpoints,
} from '@angular/cdk/layout';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store, Select } from '@ngxs/store';
import { DeepReadonly } from 'ts-essentials';

import { tryGet } from '@fullerstack/agx-util';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';
import { MenuService } from '@fullerstack/ngx-menu';
import { I18nService, _ } from '@fullerstack/ngx-i18n';
import { UixService } from '@fullerstack/ngx-uix';

import * as actions from './store/layout-state.action';
import {
  LayoutState,
  NavbarMode,
  SidenavMode,
} from './store/layout-state.model';
import { DefaultLayoutState } from './store/layout-state.default';
import { LayoutStoreState } from './store/layout-state.store';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AuthService } from '@fullerstack/ngx-auth';

@Injectable()
export class LayoutService implements OnDestroy {
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  state: DeepReadonly<LayoutState> = DefaultLayoutState;
  @Select(LayoutStoreState) state$: Observable<LayoutState>;
  private destroy$ = new Subject<boolean>();
  handset$: Observable<BreakpointState>;
  portrait$: Observable<BreakpointState>;
  siteName: string;
  routeReady = false;
  isDarkTheme = false;
  sessionLinks = {
    login: {
      label: _('COMMON.LOGIN'),
      path: tryGet(() => this.options.localConfig.loginPageUrl, '/auth/login'),
    },
    register: {
      label: _('COMMON.REGISTER'),
      path: tryGet(
        () => this.options.localConfig.registerPageUrl,
        '/auth/register'
      ),
    },
    logout: {
      label: _('COMMON.LOGOUT'),
      path: tryGet(() => this.options.localConfig.loggedOutRedirectUrl, '/'),
    },
  };
  navbarModes = [
    {
      label: _('COMMON.NAVBAR.MOVE_WITH_SCROLL'),
      value: NavbarMode.moveWithScroll,
    },
    {
      label: _('COMMON.NAVBAR.HIDE_ON_SCROLL'),
      value: NavbarMode.hideOnScroll,
    },
    {
      label: _('COMMON.NAVBAR.SHOW_ALWAYS'),
      value: NavbarMode.showAlways,
    },
  ];
  navbarModeClass = null;
  currentUrl = null;

  constructor(
    readonly overlay: OverlayContainer,
    readonly bpObs: BreakpointObserver,
    readonly router: Router,
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly i18n: I18nService,
    readonly uix: UixService,
    readonly menu: MenuService,
    readonly auth: AuthService,
    readonly store: Store
  ) {
    this.options = this.config.options;
    this.handset$ = this.bpObs.observe([
      Breakpoints.Handset,
      Breakpoints.XSmall,
      Breakpoints.Small,
    ]);

    this.portrait$ = this.bpObs.observe([
      Breakpoints.HandsetPortrait,
      Breakpoints.TabletPortrait,
      Breakpoints.WebPortrait,
    ]);

    this.siteName = this.options.appName;
    this.doInit();

    this.logger.info('LayoutService ready ...');
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.logger.debug('LayoutService destroyed ...');
  }

  private doInit() {
    this.stateInit();
    this.breakpointInit();
    this.fullscreenInit();
    this.routeChangeInit();
  }

  private stateInit() {
    this.state$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      this.state = state;
      this.setOverlayThemeClass();
      this.navbarModeClass = this.getNavbarModeClass();
    });

    this.store.dispatch(new actions.Initialize());

    this.auth.authChanged$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      if (this.state.notifyOpen && !state.isLoggedIn) {
        this.toggleNotification();
      }
    });
  }

  private breakpointInit() {
    this.handset$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      this.setIsHandset(state.matches);
      if (!state.matches) {
        this.setMenuMode(SidenavMode.side);
      } else {
        this.setMenuMode(SidenavMode.over);
      }
    });
    this.portrait$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      this.setIsPortrait(state.matches);
    });
  }

  private fullscreenInit() {
    this.uix.fullscreen$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isFullscreen) => {
        if (this.state.fullscreenOpen && !isFullscreen) {
          this.store.dispatch(new actions.SetFullscreenStatus(isFullscreen));
          this.uix.fullscreenOff();
        }
      });
  }

  toggleMenu() {
    this.store.dispatch(new actions.ToggleMenu());
  }

  setNavbarMode(mode: NavbarMode) {
    this.store.dispatch(new actions.SetNavbarMode(mode));
  }

  setMenuMode(mode: SidenavMode) {
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

  setIsHandset(isHandset: boolean) {
    this.store.dispatch(new actions.SetIsHandset(isHandset));
  }

  setIsPortrait(isPortrait: boolean) {
    this.store.dispatch(new actions.SetIsPortrait(isPortrait));
  }

  setIsDarkTheme(isDarkTheme: boolean) {
    this.store.dispatch(new actions.SetIsDarkTheme(isDarkTheme));
  }

  private routeChangeInit() {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        if (this.routeReady) {
          if (this.state.notifyOpen) {
            this.toggleNotification();
          }
          if (this.state.isHandset && this.state.menuOpen) {
            this.toggleMenu();
          }
        } else {
          this.routeReady = true;
        }
      }
    });
  }

  setOverlayThemeClass() {
    const el = this.overlay.getContainerElement().classList;
    if (this.state.isDarkTheme) {
      el.add('app-theme-dark');
      el.remove('app-theme-light');
    } else {
      el.add('app-theme-light');
      el.remove('app-theme-dark');
    }
  }

  getNavbarModeClass() {
    switch (this.state.navbarMode) {
      case NavbarMode.hideOnScroll:
        return 'navbar-hide-on-scroll';
      case NavbarMode.moveWithScroll:
        return 'navbar-move-with-scroll';
      case NavbarMode.showAlways:
        return 'navbar-always-show';
      default:
        return 'navbar-hide-on-scroll';
    }
  }

  setDarkTheme(isDark: boolean) {
    this.isDarkTheme = isDark;
  }
}
