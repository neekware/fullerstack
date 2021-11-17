/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StoreState } from '@fullerstack/agx-store';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';
import { cloneDeep as ldDeepClone, mergeWith as ldMergeWith } from 'lodash-es';
import { DeepReadonly } from 'ts-essentials';

import { DefaultCachifyConfig, DefaultMaxCacheExpiry } from './cachify.default';
import { CachifyEntry } from './cachify.model';

@Injectable({ providedIn: 'root' })
export class CachifyService {
  private nameSpace = 'CACHIFY';
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  private cacheMap = new Map<string, CachifyEntry>();
  private cacheStore: StoreState;

  constructor(readonly config: ConfigService, readonly logger: LoggerService) {
    this.options = ldMergeWith(
      ldDeepClone({ cachify: DefaultCachifyConfig }),
      this.config.options,
      (dest, src) => (Array.isArray(dest) ? src : undefined)
    );
    this.cacheStore = new StoreState({}, this.options.cachify.immutable);
    this.logger.info(`[${this.nameSpace}] CachifyService ready ...`);
  }

  /**
   * Returns an unexpired cache response or null
   * @param key Cache key
   */
  get(key: string): HttpResponse<any> {
    const entry = this.cacheMap.get(key);
    if (!entry) {
      return null;
    }
    if (this.isExpired(entry)) {
      this.cacheMap.delete(entry.key);
      return null;
    }
    return entry.response;
  }

  /**
   * Caches a http response
   * @param key Cache key
   * @param ttl Cache expiry in seconds
   * @param http response
   */
  set(key: string, ttl = 0, response: HttpResponse<any>) {
    ttl = ttl === 0 ? DefaultMaxCacheExpiry : ttl;
    const expiryTime = Date.now() + ttl * 1000;
    const entry: CachifyEntry = { key, response, expiryTime };
    this.cacheMap.set(key, entry);
    this.cacheStore.setState(key, entry.response?.body);
    this.pruneCache();
  }

  /**
   * Returns true if cache is expired, else return false
   * @param entry Cache Entry
   */
  private isExpired(entry: CachifyEntry): boolean {
    return entry.expiryTime <= Date.now();
  }

  /**
   * Removes expired cache entries
   */
  private pruneCache() {
    this.cacheMap.forEach((entry) => {
      if (this.isExpired(entry)) {
        this.cacheMap.delete(entry.key);
      }
    });
  }
}
