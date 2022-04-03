/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
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
