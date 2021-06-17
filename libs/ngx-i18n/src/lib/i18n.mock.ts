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
