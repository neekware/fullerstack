/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, AuthState } from '@fullerstack/ngx-auth';
import { _ } from '@fullerstack/ngx-i18n';
import { rotationAnimations, shakeAnimations } from '@fullerstack/ngx-shared';
import { UixService } from '@fullerstack/ngx-uix';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LayoutState } from '../layout.model';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'fullerstack-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [rotationAnimations.rotate90, shakeAnimations.wiggleIt],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Input() authState: AuthState;
  @Input() layoutState: LayoutState;

  menuIconState = 'back';
  notifyIconState = 'back';
  brandImage = '/assets/images/logos/brand-large.png';
  navbarLinks = {
    profile: {
      title: _('COMMON.PROFILE'),
      path: '/user/profile/update',
      icon: 'account',
    },
    settings: {
      title: _('COMMON.SETTINGS'),
      path: '/settings/language/change',
      icon: 'cog-outline',
    },
    login: {
      title: _('COMMON.LOGIN'),
      path: '/auth/login',
      icon: 'login',
    },
    register: {
      title: _('COMMON.REGISTER'),
      path: '/auth/register',
      icon: 'account-plus',
    },
    logout: {
      title: _('COMMON.LOGOUT'),
      path: '/auth/logout',
      icon: 'logout',
    },
  };

  private destroy$ = new Subject<boolean>();

  constructor(
    public router: Router,
    public auth: AuthService,
    public uix: UixService,
    public layout: LayoutService
  ) {}

  ngOnInit() {
    this.layout.stateSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (state) => {
        this.menuIconState = state.menuOpen ? 'back' : 'forth';
        this.notifyIconState = state.notifyOpen ? 'back' : 'forth';
      },
    });

    this.layout.handset$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (state) => {
        if (state.matches) {
          this.brandImage = '/assets/images/logos/brand-small.png';
        } else {
          this.brandImage = '/assets/images/logos/brand-large.png';
        }
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
