/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { I18nConfig, LanguageInfo } from './i18n.model';

export const DefaultTranslations = {};

export const DefaultLanguage = 'en';
export const DefaultLanguageName = 'English';
export const RtlLanguages: string[] = ['ar', 'fa', 'he'];
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
