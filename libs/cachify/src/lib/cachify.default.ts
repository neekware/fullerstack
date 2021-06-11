import { CachifyConfig, CachifyFetchPolicy } from './cachify.model';

/**
 * Default configuration - Cachify module
 */
export const DefaultCachifyConfig: CachifyConfig = {
  // by default cache is disabled
  disabled: true,

  // by default, expiry time of http cache is 60 seconds
  ttl: 60,
};

/**
 * Default interpolation options
 */
export const DefaultInterpolationOptions = {
  singleSpace: true,
  trim: true,
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
