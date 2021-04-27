/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed, inject } from '@angular/core/testing';

import { Observable, of as observableOf } from 'rxjs';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { ConfigModule, ApplicationConfig } from '@fullerstack/ngx-config';
import { LoggerModule } from '@fullerstack/ngx-logger';

import { I18nModule } from './i18n.module';
import { I18nService } from './i18n.service';
import { DefaultLanguage } from './i18n.default';

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
  getTranslation(lang: string): Observable<any> {
    return observableOf(I18nTranslations[lang]);
  }
}

// disable console log during test
jest.spyOn(console, 'log').mockImplementation(() => undefined);

describe('I18nService', () => {
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
  });

  it('should be created', inject(
    [I18nService, TranslateService],
    (service: I18nService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('should be created with default options', inject(
    [I18nService, TranslateService],
    (service: I18nService) => {
      expect(service.options.i18n.defaultLanguage).toEqual(DefaultLanguage);
    }
  ));

  it('should translate to English', inject(
    [I18nService, TranslateService],
    (service: I18nService) => {
      service.xlate.get('COMMON.WELCOME').subscribe((res: string) => {
        expect(res).toEqual('Welcome');
      });
    }
  ));
  // TODO: add async language change test
});
