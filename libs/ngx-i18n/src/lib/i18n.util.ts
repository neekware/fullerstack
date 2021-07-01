/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/**
 * Wrapper for translation extractor tools such as @biesbjerg/ngx-translate-extract
 * @param key - string to be translated
 */
export function i18nExtractor<T extends string | string[]>(key: T): T {
  return key;
}
