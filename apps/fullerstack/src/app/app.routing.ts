/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Routes } from '@angular/router';
import { AuthAuthenticatedGuard } from '@fullerstack/ngx-auth';
import { _ } from '@fullerstack/ngx-i18n';
import { DeactivateGuard } from '@fullerstack/ngx-shared';

import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileUpdateComponent } from './pages/user/profile-update.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: _('APP.HEADLINE'),
    },
  },
  {
    path: 'about',
    component: AboutComponent,
    // canActivate: [AuthGuardService]
    data: {
      title: _('APP.ABOUT'),
    },
  },
  {
    path: 'auth/login',
    component: LoginComponent,
    data: {
      title: _('APP.LOGIN'),
    },
  },
  {
    path: 'auth/register',
    component: RegisterComponent,
    data: {
      title: _('APP.REGISTER'),
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
    path: '**',
    component: NotfoundComponent,
  },
];
