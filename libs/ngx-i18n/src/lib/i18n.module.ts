import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ConfigService } from '@fullerstack/ngx-config';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient, config: ConfigService) {
  return new TranslateHttpLoader(
    http,
    '/assets/i18n/',
    `.json?hash=${config.options?.i18n?.cacheBustingHash}`
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
