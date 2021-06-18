/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { registerLocaleData } from '@angular/common';

import { LanguageInfo } from './i18n.model';

export function registerActiveLocales(
  availableLanguages: LanguageInfo,
  enabledLanguages: string[]
) {
  for (const lang of enabledLanguages) {
    const { locale, localeExtra } = availableLanguages[lang];
    registerLocaleData(locale, localeExtra);
  }
}
