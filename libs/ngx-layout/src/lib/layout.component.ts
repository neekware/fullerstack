/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@fullerstack/ngx-auth';
import { I18nService } from '@fullerstack/ngx-i18n';
import { LoggerService } from '@fullerstack/ngx-logger';
import { fadeAnimations, routeAnimations } from '@fullerstack/ngx-shared';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LayoutService } from './layout.service';

@Component({
  selector: 'fullerstack-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [routeAnimations.slideIn, fadeAnimations.fadeOutInSlow],
})
export class LayoutComponent implements OnDestroy, AfterViewInit {
  @ViewChild('sideMenu')
  private sideMenu: MatSidenav;
  @ViewChild('notifyMenu')
  private notifyMenu: MatSidenav;
  private destroy$ = new Subject<boolean>();
  hideNavbar = false;
  allowScroll = true;

  constructor(
    public logger: LoggerService,
    public i18n: I18nService,
    public auth: AuthService,
    public layout: LayoutService
  ) {}

  ngAfterViewInit(): void {
    this.layout.stateSub$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      if (state.menuOpen) {
        this.sideMenu?.open();
      } else {
        this.sideMenu?.close();
      }
      if (state.notifyOpen) {
        this.notifyMenu?.open();
      } else {
        this.notifyMenu?.close();
      }
    });

    this.sideMenu.closedStart.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.layout.state.menuOpen) {
        this.layout.toggleMenu();
      }
    });

    this.notifyMenu.closedStart.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.layout.state.notifyOpen) {
        this.layout.toggleNotification();
      }
    });
  }

  routeState(outlet: RouterOutlet) {
    const animationsEnabled = false;
    if (animationsEnabled) {
      return outlet.activatedRouteData.title || 'unknown';
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.logger.debug('LayoutComponent destroyed ...');
  }
}
