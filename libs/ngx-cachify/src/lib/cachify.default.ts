import { HttpContextToken } from '@angular/common/http';

import { CachifyConfig, CachifyContextMeta, CachifyFetchPolicy } from './cachify.model';

export const DEFAULT_CACHE_EXPIRY = 60;

/**
 * Default configuration - Cachify module
 */
export const DefaultCachifyConfig: CachifyConfig = {
  // by default cache is disabled
  disabled: true,

  // freeze state, full or partial
  immutable: false,

  // by default, expiry time of http cache is 60 seconds
  ttl: DEFAULT_CACHE_EXPIRY,
};

/**
 * Enabled fetch policy
 */
export const DefaultFetchPolicies = [
  CachifyFetchPolicy.CacheOff,
  CachifyFetchPolicy.CacheFirst,
  CachifyFetchPolicy.CacheOnly,
  CachifyFetchPolicy.NetworkOnly,
  CachifyFetchPolicy.NetworkFirst,
  CachifyFetchPolicy.CacheAndNetwork,
];

/**
 * Default fetch policy
 */
export const DefaultFetchPolicy = CachifyFetchPolicy.CacheFirst;

/**
 * Max cache is one month
 */
export const DefaultMaxCacheExpiry = 60 * 60 * 24 * 30;

/**
 * Default cache context meta data
 */
export const DefaultContextMeta: CachifyContextMeta = {
  key: null,
  ttl: DEFAULT_CACHE_EXPIRY,
  policy: DefaultFetchPolicy,
};

/**
 * Cache context token
 */
export const CACHIFY_CONTEXT_TOKEN = new HttpContextToken<CachifyContextMeta>(
  () => DefaultContextMeta
);
