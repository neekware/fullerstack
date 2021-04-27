import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConfigService } from '@fullerstack/ngx-config';

export function HttpLoaderFactory(http: HttpClient, cfg: ConfigService) {
  return new TranslateHttpLoader(
    http,
    '/assets/i18n/',
    `.json?hash=${cfg?.options?.i18n?.cacheBustingHash}`
  );
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient, ConfigService],
      },
    }),
  ],
  exports: [TranslateModule],
})
export class I18nModule {
  static forRoot() {
    return {
      ngModule: I18nModule,
    };
  }

  static forChild() {
    return {
      ngModule: TranslateModule,
    };
  }
}
