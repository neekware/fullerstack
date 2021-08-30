/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { HttpContextToken } from '@angular/common/http';
import { DeepReadonly } from 'ts-essentials';

import { CachifyConfig, CachifyContextMeta, CachifyFetchPolicy } from './cachify.model';

/**
 * Max cache is one month
 */
export const DefaultMaxCacheExpiry = 60 * 60 * 24 * 30;

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
 * Default configuration - Cachify module
 */
export const DefaultCachifyConfig: DeepReadonly<CachifyConfig> = {
  // by default cache is disabled
  disabled: false,

  // by default the following policies are enabled
  policies: DefaultFetchPolicies,

  // freeze state
  immutable: true,

  // by default, expiry time of http cache is 60 seconds
  ttl: DefaultMaxCacheExpiry,
} as const;

/**
 * Default fetch policy
 */
export const DefaultFetchPolicy = CachifyFetchPolicy.CacheFirst;

/**
 * Default cache context meta data
 */
export const DefaultContextMeta: CachifyContextMeta = {
  key: null,
  ttl: DefaultMaxCacheExpiry,
  policy: DefaultFetchPolicy,
};

/**
 * Cache context token
 */
export const CACHIFY_CONTEXT_TOKEN = new HttpContextToken<CachifyContextMeta>(
  () => DefaultContextMeta
);
