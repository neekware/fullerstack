import { Routes } from '@angular/router';

import { _ } from '@fullerstack/ngx-i18n';
import { AppComponent } from './app.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: AppComponent,
    data: {
      title: _('APP.HEADLINE'),
    },
  },
  {
    path: '**',
    component: AppComponent,
  },
];
