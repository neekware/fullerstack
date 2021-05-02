import { Routes } from '@angular/router';

import { _ } from '@fullerstack/ngx-i18n';
import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';

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
  },
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: '**',
    component: NotfoundComponent,
  },
];
