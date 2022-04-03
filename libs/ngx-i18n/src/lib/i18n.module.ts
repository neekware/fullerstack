/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ConfigService } from '@fullerstack/ngx-config';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable, map } from 'rxjs';

import { Translatable } from './i18n.model';

/**
 * Custom loader for the translations.
 * If translation `key` is not found, it falls back on to the default language.
 * If translation 'key' is found but empty, it falls back on to `key` as `value`.
 * { // english (en) - default language
 *     INFO.HELLO: 'Hello',
 *     INFO.WELCOME: 'Welcome'
 * }
 * { // german (de)
 *     INFO.HELLO: ''
 * }
 * For (de): INFO.WELCOME doesn't exist, so it'll fallback to (en), the default language ('Welcome').
 * For (de): INFO.HELLO exists, yet empty, so it will fallback to 'INFO.HELLO', visually indicating a missing translation.
 */
export class CustomTranslateHttpLoader extends TranslateHttpLoader {
  constructor(http: HttpClient, prefix?: string, suffix?: string) {
    super(http, prefix, suffix);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(lang: string): Observable<any> {
    return super.getTranslation(lang).pipe(
      map((resp: Translatable) => {
        return this.keyAsTranslation(resp);
      })
    );
  }

  private keyAsTranslation(obj: Translatable) {
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'object') {
        obj[key] = this.keyAsTranslation(obj[key] as Translatable);
      } else obj[key] = obj[key] || key;
    }
    return obj;
  }
}

export function HttpLoaderFactory(http: HttpClient, config: ConfigService) {
  return new CustomTranslateHttpLoader(
    http,
    '/assets/i18n/',
    `.json?hash=${config.options?.i18n?.cacheBustingHash}`
  );
}

// AoT requires an exported function for factories
export const TranslateModuleCustomLoader = TranslateModule.forRoot({
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient, ConfigService],
  },
});

@NgModule({
  imports: [CommonModule, HttpClientModule, TranslateModuleCustomLoader],
  exports: [TranslateModule],
})
export class I18nModule {
  static forRoot(): ModuleWithProviders<I18nModule> {
    return {
      ngModule: I18nModule,
    };
  }

  static forChild(): ModuleWithProviders<TranslateModule> {
    return {
      ngModule: TranslateModule,
    };
  }
}
