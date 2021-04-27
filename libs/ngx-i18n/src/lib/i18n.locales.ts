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
