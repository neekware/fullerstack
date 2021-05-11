import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@fullerstack/ngx-auth';
import { _ } from '@fullerstack/ngx-i18n';
import { rotationAnimations, shakeAnimations } from '@fullerstack/ngx-shared';
import { UixService } from '@fullerstack/ngx-uix';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LayoutService } from '../layout.service';

@Component({
  selector: 'fullerstack-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [rotationAnimations.rotate90, shakeAnimations.wiggleIt],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit, OnDestroy {
  menuIconState = 'back';
  notifyIconState = 'back';
  brandImage = '/assets/images/logos/brand-large.png';
  navbarLinks = {
    profile: {
      title: _('COMMON.PROFILE'),
      path: '/profile/update',
      icon: 'account',
    },
    settings: {
      title: _('COMMON.SETTINGS'),
      path: '/settings/language/change',
      icon: 'settings',
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
    this.layout.state$.pipe(takeUntil(this.destroy$)).subscribe({
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
