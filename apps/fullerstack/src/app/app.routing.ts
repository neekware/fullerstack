/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Routes } from '@angular/router';
import { AuthAnonymousGuard, AuthAuthenticatedGuard } from '@fullerstack/ngx-auth';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { DeactivateGuard } from '@fullerstack/ngx-shared';

import { AboutComponent } from './pages/about/about.component';
import { ForexComponent } from './pages/forex/forex.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { PasswordResetRequestComponent } from './pages/password-reset-request/password-reset-request.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { ProfileUpdateComponent } from './pages/profile-update/profile-update.component';
import { RegisterComponent } from './pages/register/register.component';
import { TrendComponent } from './pages/trend/trend.component';
import { UserVerifyComponent } from './pages/user-verify/user-verify.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: _('APP.HEADLINE'),
    },
  },
  {
    path: 'about/us',
    component: AboutComponent,
    data: {
      title: _('APP.ABOUT'),
    },
  },
  {
    path: 'forex',
    component: ForexComponent,
    data: {
      title: _('COMMON.FOREX'),
    },
  },
  {
    path: 'finance/stocks/own',
    component: PortfolioComponent,
    data: {
      title: _('COMMON.PORTFOLIO'),
    },
  },
  {
    path: 'finance/stocks/trend',
    component: TrendComponent,
    data: {
      title: _('COMMON.TREND'),
    },
  },
  {
    path: 'auth/login',
    component: LoginComponent,
    canActivate: [AuthAnonymousGuard],
    data: {
      title: _('APP.LOGIN'),
    },
  },
  {
    path: 'auth/register',
    component: RegisterComponent,
    canActivate: [AuthAnonymousGuard],
    data: {
      title: _('APP.REGISTER'),
    },
  },
  {
    path: 'auth/user/verify/:token/:idb64',
    component: UserVerifyComponent,
    data: {
      title: _('COMMON.ACCOUNT.VERIFY'),
      description: _('APP.DESCRIPTION.ACCOUNT_VERIFY'),
    },
  },
  {
    path: 'user/profile/update',
    component: ProfileUpdateComponent,
    canActivate: [AuthAuthenticatedGuard],
    canDeactivate: [DeactivateGuard],
    data: {
      title: _('COMMON.PROFILE_UPDATE'),
      description: _('APP.DESCRIPTION.PROFILE_UPDATE'),
    },
  },
  {
    path: 'auth/password/reset/request',
    component: PasswordResetRequestComponent,
    canActivate: [AuthAnonymousGuard],
    data: {
      title: _('COMMON.PASSWORD.RESET_REQUEST'),
      description: _('APP.DESCRIPTION.PASSWORD_RESET_REQUEST'),
    },
  },
  {
    path: '**',
    component: NotfoundComponent,
  },
];
