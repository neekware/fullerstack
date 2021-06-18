/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

import { I18nModule } from './i18n.module';

export class MockTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<unknown> {
    return of({ WELCOME: 'Welcome' });
  }
}

export function makeMockI18nModule() {
  return [
    I18nModule.forRoot(),
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useClass: MockTranslateLoader },
    }),
  ];
}
