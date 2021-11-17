/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { RenderContext, RenderOptions, renderTemplate } from '@fullerstack/nsx-common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { cloneDeep as ldDeepClone, mergeWith as ldMergeWith } from 'lodash';
import { DeepReadonly } from 'ts-essentials';

import { DefaultI18nConfig, RtlLanguageList } from './i18n.default';
import { I18nConfig } from './i18n.model';

@Injectable()
export class I18nService {
  readonly options: DeepReadonly<I18nConfig> = DefaultI18nConfig;

  constructor(readonly config: ConfigService) {
    this.options = ldMergeWith(
      ldDeepClone(this.options),
      this.config.get<I18nConfig>('appConfig.i18nConfig'),
      (dest, src) => (Array.isArray(dest) ? src : undefined)
    );
  }

  render(template: string, params: RenderContext, options?: RenderOptions): string {
    return renderTemplate(template, params, options);
  }

  get defaultLocale(): string {
    return this.options.defaultLocale;
  }

  get availableLocales(): Readonly<string[]> {
    return this.options.availableLocales;
  }

  get enabledLocales(): Readonly<string[]> {
    return this.options.enabledLocales;
  }

  isRightToLeftLocale(locale: string): boolean {
    return RtlLanguageList.includes(locale);
  }

  getPreferredLocale(locales: string[]): string {
    for (let locale of locales || []) {
      if (locale) {
        locale = locale.toLowerCase();
        if (this.enabledLocales.includes(locale)) {
          return locale;
        }

        const shortLocale = locale.split('-')[0];
        if (this.enabledLocales.includes(shortLocale)) {
          return shortLocale;
        }

        for (const fallbackLocale of this.enabledLocales) {
          if (fallbackLocale.startsWith(shortLocale)) {
            return fallbackLocale;
          }
        }
      }
    }

    return this.defaultLocale;
  }
}
