/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '@fullerstack/ngx-auth';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { I18nService } from '@fullerstack/ngx-i18n';
import { LoggerService } from '@fullerstack/ngx-logger';
import { MenuService } from '@fullerstack/ngx-menu';
import { StoreService } from '@fullerstack/ngx-store';
import { UixService } from '@fullerstack/ngx-uix';
import { cloneDeep as ldDeepClone, merge as ldMergeWith } from 'lodash-es';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DeepReadonly } from 'ts-essentials';

import { DefaultLayoutConfig, DefaultLayoutState } from './layout.default';
import { LayoutState, NavbarMode, SidenavMode } from './layout.model';

@Injectable({ providedIn: 'root' })
export class LayoutService implements OnDestroy {
  private nameSpace = 'LAYOUT';
  private claimId: string;
  private destroy$ = new Subject<boolean>();
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  state: DeepReadonly<LayoutState> = DefaultLayoutState;
  stateSub$: Observable<LayoutState>;

  handset$: Observable<BreakpointState>;
  portrait$: Observable<BreakpointState>;
  routeReady = false;
  isDarkTheme = false;
  navbarModeClass = null;
  renderer: Renderer2;

  constructor(
    @Inject(DOCUMENT) readonly document: Document,
    readonly rendererFactory: RendererFactory2,
    readonly router: Router,
    readonly overlay: OverlayContainer,
    readonly bpObs: BreakpointObserver,
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly i18n: I18nService,
    readonly uix: UixService,
    readonly menu: MenuService,
    readonly auth: AuthService,
    readonly store: StoreService
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);

    this.options = ldMergeWith(
      ldDeepClone({ layout: DefaultLayoutConfig }),
      this.config.options,
      (dest, src) => (Array.isArray(dest) ? src : undefined)
    );

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

    this.claimSlice();
    this.initState();
    this.subState();
    this.subFullscreen();
    this.subBreakpoint();
    this.subAuthState();
    this.subStorage();
    this.subRouteChange();

    this.logger.info(`[${this.nameSpace}] LayoutService ready ...`);
  }

  /**
   * Claim Auth state:slice
   */
  private claimSlice() {
    if (!this.options?.layout?.logState) {
      this.claimId = this.store.claimSlice(this.nameSpace);
    } else {
      this.claimId = this.store.claimSlice(this.nameSpace, this.logger.debug.bind(this.logger));
    }
  }

  /**
   * Initialize Layout state
   */
  private initState() {
    this.store.setState(this.claimId, {
      ...DefaultLayoutState,
      appName: this.options.appName,
    });
  }

  /**
   * Subscribe to Layout state changes
   */
  private subState() {
    this.stateSub$ = this.store.select$<LayoutState>(this.nameSpace);

    this.stateSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (newState) => {
        this.state = { ...DefaultLayoutState, ...newState };
        this.toggleOverlayThemeClass();
        this.navbarModeClass = this.getNavbarModeClass();
      },
    });
  }

  private subStorage() {
    //   addEventListener(
    //     'storage',
    //     (event) => {
    //       if (event.key === LAYOUT_STATE_KEY) {
    //         const newState = sanitizeJsonStringOrObject(event.newValue);
    //         if (!newState) {
    //           this.store.dispatch(new actions.Initialize(this.options.appName));
    //         }
    //       }
    //     },
    //     false
    //   );
  }

  private subAuthState() {
    this.auth.stateSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (state) => {
        if (this.state.notifyOpen && !state.isLoggedIn) {
          this.toggleNotification();
        }
      },
    });
  }

  private subBreakpoint() {
    this.handset$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (state) => {
        this.setIsHandset(state.matches);
        if (!state.matches) {
          this.setMenuMode(SidenavMode.side);
        } else {
          this.setMenuMode(SidenavMode.over);
        }
      },
    });

    this.portrait$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (state) => {
        this.setIsPortrait(state.matches);
      },
    });
  }

  private subFullscreen() {
    this.uix.fullscreen$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (isFullScreen) => {
        if (this.state.isFullScreen && !isFullScreen) {
          this.setFullscreen(isFullScreen);
          this.uix.fullscreenOff();
        }
      },
    });
  }

  private subRouteChange() {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe({
      next: (event) => {
        if (event instanceof NavigationEnd) {
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
      },
    });
  }

  setMenu(menuOpen: boolean) {
    this.store.setState<LayoutState>(this.claimId, {
      ...this.state,
      menuOpen,
    });
  }

  toggleMenu() {
    const closeNotify = !this.state.menuOpen && this.state.notifyOpen && this.state.isHandset;
    this.store.setState<LayoutState>(this.claimId, {
      ...this.state,
      menuOpen: !this.state.menuOpen,
      notifyOpen: closeNotify ? false : this.state.notifyOpen,
    });
  }

  setMenuMode(menuMode: SidenavMode) {
    this.store.setState<LayoutState>(this.claimId, {
      ...this.state,
      menuMode,
    });
  }

  setNavbarMode(navbarMode: NavbarMode) {
    this.store.setState<LayoutState>(this.claimId, {
      ...this.state,
      navbarMode,
    });
  }

  toggleNotification() {
    const closeMenu = !this.state.notifyOpen && this.state.menuOpen && this.state.isHandset;
    this.store.setState<LayoutState>(this.claimId, {
      ...this.state,
      notifyOpen: !this.state.notifyOpen,
      menuOpen: closeMenu ? false : this.state.menuOpen,
    });
  }

  setFullscreen(isFullScreen: boolean) {
    this.store.setState<LayoutState>(this.claimId, {
      ...this.state,
      isFullScreen,
    });
    this.uix.fullscreenOff();
  }

  toggleFullscreen() {
    this.store.setState<LayoutState>(this.claimId, {
      ...this.state,
      isFullScreen: !this.state.isFullScreen,
    });
    this.uix.toggleFullscreen();
  }

  setHeadless(isHeadless: boolean) {
    this.store.setState<LayoutState>(this.claimId, {
      ...this.state,
      isHeadless: isHeadless,
    });
  }

  setIsHandset(isHandset: boolean) {
    this.store.setState<LayoutState>(this.claimId, {
      ...this.state,
      isHandset,
    });
  }

  setIsPortrait(isPortrait: boolean) {
    this.store.setState<LayoutState>(this.claimId, {
      ...this.state,
      isPortrait,
    });
  }

  setDarkTheme(isDarkTheme: boolean) {
    this.store.setState<LayoutState>(this.claimId, {
      ...this.state,
      isDarkTheme,
    });
    this.isDarkTheme = isDarkTheme;
  }

  addClass(className: string, tagName: string) {
    this.renderer.addClass(this.document[tagName], className);
  }

  removeClass(className: string, tagName: string) {
    this.renderer.removeClass(this.document[tagName], className);
  }

  private toggleOverlayThemeClass() {
    const el = this.overlay.getContainerElement().classList;
    if (this.state.isDarkTheme) {
      el.add('fs-theme-dark');
      el.remove('fs-theme-light');
    } else {
      el.add('fs-theme-light');
      el.remove('fs-theme-dark');
    }
  }

  private getNavbarModeClass() {
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

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.logger.debug(`[${this.nameSpace}] LayoutService destroyed ...`);
  }
}
