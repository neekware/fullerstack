import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConfigService } from '@fullerstack/ngx-config';

export function HttpLoaderFactory(
  http: HttpClient,
  configService: ConfigService
) {
  return new TranslateHttpLoader(
    http,
    '/assets/i18n/',
    `.json?hash=${configService.options?.i18n?.cacheBustingHash}`
  );
}

export const TranslateModuleInitialized = TranslateModule.forRoot({
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient, ConfigService],
  },
});

@NgModule({
  imports: [CommonModule, HttpClientModule, TranslateModuleInitialized],
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
