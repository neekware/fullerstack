/**
 * Wrapper for translation extractor tools such as @biesbjerg/ngx-translate-extract
 * @param key - string to be translated
 */
export function i18nExtractor<T extends string | string[]>(key: T): T {
  return key;
}
