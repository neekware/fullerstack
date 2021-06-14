/* eslint-disable @typescript-eslint/no-explicit-any */

import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';
import { merge as ldNestedMerge } from 'lodash-es';
import { DeepReadonly } from 'ts-essentials';

import { DefaultCachifyConfig, DefaultMaxCacheExpiry } from './cachify.default';
import { CachifyEntry } from './cachify.model';
import { CacheStore } from './cachify.store';

@Injectable({ providedIn: 'root' })
export class CachifyService {
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  private cacheMap = new Map<string, CachifyEntry>();
  private cacheStore: CacheStore;

  constructor(private config: ConfigService, private logger: LoggerService) {
    this.options = ldNestedMerge({ cachify: DefaultCachifyConfig }, this.config.options);
    this.cacheStore = new CacheStore({}, this.options.cachify.immutable);
    this.logger.debug('CachifyService ready ...');
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
    this.cacheStore.setState({ [key]: entry.response?.body });
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
