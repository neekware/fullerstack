/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Routes } from '@angular/router';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';

import { DrawComponent } from './draw/draw.component';

export const annotatorRoutes: Routes = [
  {
    path: 'draw',
    children: [
      {
        path: '',
        component: DrawComponent,
        data: {
          title: _('COMMON.ANNOTATE'),
          description: _('APP.DESCRIPTION.ANNOTATE'),
        },
      },
    ],
  },
];
