/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

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

import { DefaultI18nConfig, DefaultLanguage, RtlLanguageList } from './i18n.default';
import { registerActiveLocales } from './i18n.locale';
import { AvailableLanguage, LanguageDirection } from './i18n.model';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private nameSpace = 'I18N';
  @Output() stateChange$ = new EventEmitter<string>();
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
    readonly translate: TranslateService
  ) {
    this.options = ldNestedMerge({ i18n: DefaultI18nConfig }, this.config.options);

    this.initLanguage();

    this.logger.info(
      `[${this.nameSpace}] I18nService ready ... (${this.currentLanguage} - ${this.direction})`
    );
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
    return RtlLanguageList.indexOf(iso) > -1;
  }

  isCurrentLanguage(iso: string): boolean {
    return iso === this.translate.currentLang;
  }

  getLanguageName(iso: string): string {
    return this.isLanguageEnabled(iso) ? this.availableLanguages[iso].name : null;
  }

  setCurrentLanguage(iso: string) {
    if (iso && iso !== this.currentLanguage) {
      if (this.isLanguageEnabled(iso)) {
        this.translate.use(iso);
      } else {
        this.logger.warn(
          `[${this.nameSpace}] I18nService - language not enabled ... (${this.currentLanguage})`
        );
      }
    }
  }

  getBrowserLangs(): Readonly<string[]> {
    return window?.navigator?.languages || ([] as string[]);
  }

  private initLanguage() {
    this.availableLanguages = this.options.i18n.availableLanguages;
    this.enabledLanguages = this.options.i18n.enabledLanguages;
    this.defaultLanguage = this.getInitialLanguage() || this.options.i18n.defaultLanguage;

    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      this.currentLanguage = event.lang;
      this.direction = this.getLanguageDirection(event.lang);
      this.stateChange$.emit(event.lang);
      this.logger.debug(
        `[${this.nameSpace}] I18nService - language changed ... (${this.currentLanguage} - ${this.direction})`
      );
    });

    registerActiveLocales(this.options.i18n.availableLanguages, this.options.i18n.enabledLanguages);

    this.translate.addLangs(Object.keys(this.options.i18n.enabledLanguages));
    this.translate.setDefaultLang(this.defaultLanguage);
    this.setCurrentLanguage(this.defaultLanguage);
  }

  /*
   * Get/Guess the initial language to load the app with
   */
  private getInitialLanguage(): string {
    const browserLangs = this.getBrowserLangs();

    for (let lang of browserLangs) {
      if (lang) {
        lang = lang.toLowerCase();
        if (this.enabledLanguages.includes(lang)) {
          return lang;
        }

        const shortLang = lang.split('-')[0];
        if (shortLang && this.enabledLanguages.includes(shortLang)) {
          return shortLang;
        }

        for (const fallbackLang of this.enabledLanguages) {
          if (fallbackLang.startsWith(shortLang)) {
            return fallbackLang;
          }
        }
      }
    }

    return this.defaultLanguage;
  }
}
