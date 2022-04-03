/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { I18nConfig, LanguageInfo } from './i18n.model';
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

export const DefaultTranslations = {};

export const DefaultLanguage = 'en';
export const DefaultLanguageName = 'English';
export const RtlLanguageList: string[] = Object.keys(RtlLanguageListMap);
export const EnabledLanguages = ['en', 'fr', 'es', 'he', 'fa'];

export const AvailableLanguages: LanguageInfo = {
  en: {
    name: 'English',
    locale: '@angular/common/locales/en',
    localeExtra: '@angular/common/locales/extra/en',
  },
  fr: {
    name: 'Français',
    locale: '@angular/common/locales/fr',
    localeExtra: '@angular/common/locales/extra/fr',
  },
  es: {
    name: 'Español',
    locale: '@angular/common/locales/es',
    localeExtra: '@angular/common/locales/extra/es',
  },
  he: {
    name: 'עִברִית',
    locale: '@angular/common/locales/he',
    localeExtra: '@angular/common/locales/extra/he',
  },
  fa: {
    name: 'فارسی',
    locale: '@angular/common/locales/fa',
    localeExtra: '@angular/common/locales/extra/fa',
  },
};

/**
 * Default configuration - i18n module
 */
export const DefaultI18nConfig: I18nConfig = {
  defaultLanguage: DefaultLanguage,
  availableLanguages: AvailableLanguages,
  enabledLanguages: EnabledLanguages,
  cacheBustingHash: 'v1.0.0',
};
