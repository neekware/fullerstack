import { Direction } from '@angular/cdk/bidi/directionality';
import { EventEmitter, Injectable, Output } from '@angular/core';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';
import { TranslateService } from '@ngx-translate/core';
import { merge as ldNestedMerge } from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DeepReadonly } from 'ts-essentials';

import { DefaultI18nConfig, DefaultLanguage, RtlLanguages } from './i18n.default';
import { registerActiveLocales } from './i18n.locale';
import { AvailableLanguage, LanguageDirection } from './i18n.model';

@Injectable({ providedIn: 'root' })
export class I18nService {
  @Output() languageChanges$ = new EventEmitter<string>();
  private destroy$ = new Subject<boolean>();
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  currentLanguage = DefaultLanguage;
  defaultLanguage = DefaultLanguage;
  direction: Direction = LanguageDirection.ltr;
  availableLanguages: AvailableLanguage = {};
  enabledLanguages: string[] = [];

  constructor(
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly xlate: TranslateService
  ) {
    this.options = ldNestedMerge({ i18n: DefaultI18nConfig }, this.config.options);

    this.initLanguage();

    this.logger.info(`I18nService ready ... (${this.currentLanguage} - ${this.direction})`);
  }

  isLanguageEnabled(iso: string): boolean {
    return this.enabledLanguages.indexOf(iso) > -1;
  }

  getLanguageDirection(iso: string): Direction {
    if (this.isLanguageRTL(iso)) {
      return LanguageDirection.rtl;
    }
    return LanguageDirection.ltr;
  }

  isLanguageRTL(iso: string): boolean {
    return RtlLanguages.indexOf(iso) > -1;
  }

  isCurrentLanguage(iso: string): boolean {
    return iso === this.xlate.currentLang;
  }

  getLanguageName(iso: string): string {
    return this.isLanguageEnabled(iso) ? this.availableLanguages[iso].name : null;
  }

  setCurrentLanguage(iso: string) {
    if (this.isLanguageEnabled(iso)) {
      this.xlate.use(iso);
    } else {
      this.logger.warn(`I18nService - language not enabled ... (${this.currentLanguage})`);
    }
  }

  private initLanguage() {
    this.defaultLanguage = this.options.i18n.defaultLanguage;
    this.availableLanguages = this.options.i18n.availableLanguages;
    this.enabledLanguages = this.options.i18n.enabledLanguages;

    this.xlate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      this.currentLanguage = event.lang;
      this.direction = this.getLanguageDirection(event.lang);
      this.languageChanges$.emit(event.lang);
      this.logger.info(`I18nService - language changed ... (${this.currentLanguage})`);
    });

    registerActiveLocales(this.options.i18n.availableLanguages, this.options.i18n.enabledLanguages);

    this.xlate.addLangs(Object.keys(this.options.i18n.enabledLanguages));
    this.xlate.setDefaultLang(this.defaultLanguage);

    let iso = this.xlate.getBrowserCultureLang().toLowerCase();
    if (!this.isLanguageEnabled(iso)) {
      iso = this.defaultLanguage;
    }

    this.setCurrentLanguage(iso);
  }
}
