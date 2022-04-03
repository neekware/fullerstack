/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { I18nConfig } from './i18n.model';

export const DefaultI18nConfig: I18nConfig = {
  defaultLocale: 'en',
  availableLocales: ['en'],
  enabledLocales: ['en'],
  translationDirectory: 'assets/i18n/',
};

const RtlLanguageListMap: { [key: string]: string } = {
  ar: 'Arabic',
  arc: 'Aramaic',
  dv: 'Divehi',
  fa: 'Persian',
  ha: 'Hausa',
  he: 'Hebrew',
  khw: 'Khowar',
  ks: 'Kashmiri',
  ku: 'Kurdish',
  ps: 'Pashto',
  ur: 'Urdu',
  yi: 'Yiddish',
};

export const RtlLanguageList: string[] = Object.keys(RtlLanguageListMap);
