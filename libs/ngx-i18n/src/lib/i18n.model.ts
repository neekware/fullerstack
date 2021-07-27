/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

export interface LanguageInfo {
  // iso code for language
  [iso: string]: {
    // native name of language
    name: string;
    // angular locale path for language
    locale?: string;
    // angular extra locale path for language
    localeExtra?: string;
    // one or more optional fullerstack-specific field(s)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [id: string]: any;
  };
}

export interface AvailableLanguage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface Translatable {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export enum LanguageDirection {
  // Left to Right
  'ltr' = 'ltr',
  // Right to Left
  'rtl' = 'rtl',
}

export class I18nConfig {
  // default language (default = 'en')
  defaultLanguage?: string;
  // enabled languages (default ['en'])
  enabledLanguages: string[];
  // available languages
  availableLanguages: LanguageInfo;
  // cache busting hash
  cacheBustingHash: string;
}
