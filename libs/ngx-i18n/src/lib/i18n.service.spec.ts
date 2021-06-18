/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { ApplicationConfig, ConfigModule } from '@fullerstack/ngx-config';
import { LoggerModule } from '@fullerstack/ngx-logger';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of as observableOf } from 'rxjs';

import { DefaultLanguage } from './i18n.default';
import { I18nModule } from './i18n.module';
import { I18nService } from './i18n.service';

const applicationEnv: ApplicationConfig = {
  appName: '@fullerstack/ngx-i18n',
  production: false,
};

export const I18nTranslations = {
  de: {
    'COMMON.WELCOME': 'herzlich willkommen',
    'COMMON.ABOUT': 'Über',
  },
  en: {
    'COMMON.WELCOME': 'Welcome',
    'COMMON.ABOUT': 'About',
  },
  es: {
    'COMMON.WELCOME': 'Bienvenido',
    'COMMON.ABOUT': 'Acerca de',
  },
  fa: {
    'COMMON.WELCOME': 'خوش آمدی',
    'COMMON.ABOUT': 'در باره',
  },
  fr: {
    'COMMON.WELCOME': 'Bienvenue',
    'COMMON.ABOUT': 'Sur',
  },
  he: {
    'COMMON.WELCOME': 'ברוך הבא',
    'COMMON.ABOUT': 'על אודות',
  },
  'zh-cn': {
    'COMMON.WELCOME': '欢迎',
    'COMMON.ABOUT': '关于',
  },
};

class CustomLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<unknown> {
    return observableOf(I18nTranslations[lang]);
  }
}

// disable console log during test
jest.spyOn(console, 'log').mockImplementation(() => undefined);

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ConfigModule.forRoot(applicationEnv),
        LoggerModule,
        I18nModule.forRoot(),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: CustomLoader },
        }),
      ],
    });
    service = TestBed.inject(I18nService);
  });

  afterAll(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be created with default options', () => {
    expect(service.options.i18n.defaultLanguage).toEqual(DefaultLanguage);
  });

  it('should translate to English', (done) => {
    service.xlate.get('COMMON.WELCOME').subscribe((res: string) => {
      expect(res).toEqual('Welcome');
      done();
    });
  });
});
