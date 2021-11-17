/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable } from '@angular/core';
import { StoreLogger, StoreState, StoreStateReducer, StoreStateType } from '@fullerstack/agx-store';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';
import { cloneDeep as ldDeepClone, mergeWith as ldMergeWith } from 'lodash-es';
import { Observable } from 'rxjs';
import { DeepReadonly } from 'ts-essentials';

import { DefaultStoreConfig } from './store.default';

@Injectable()
export class StoreService<T = StoreStateType> {
  private nameSpace = 'STORE';
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  private store: StoreState;

  constructor(readonly config: ConfigService, readonly logger: LoggerService) {
    this.options = ldMergeWith(
      ldDeepClone({ store: DefaultStoreConfig }),
      this.config.options,
      (dest, src) => (Array.isArray(dest) ? src : undefined)
    );
    this.store = new StoreState<T>({} as T, { ...this.options.store });
    this.logger.info(`[${this.nameSpace}] StoreService ready ...`);
  }

  /**
   * Claim a slice within state
   * @param sliceName slice name (hint: attribute key of an object)
   * @returns Slice ownership claim ID (required for write/update and release of slice)
   */
  claimSlice(sliceName: string, logger?: StoreLogger): string {
    return this.store.claimSlice(sliceName, logger);
  }

  /**
   * Release slice
   * @param claimId Slice ownership claim ID
   */
  releaseSlice(claimId: string) {
    return this.store.releaseSlice(claimId);
  }

  /**
   * Mutates (create/update) a slice within state
   * @param claimId Claim ID of slice required for any mutation, full or partial
   * @param updater object or function that returns a partial object of type T
   */
  setState<K = any>(
    claimId: string,
    updater: StoreStateReducer<T, K> | Partial<T> | K,
    action?: string
  ): K;
  setState<K = any>(claimId: string, updater: K, action?: string): K {
    return this.store.setState<K>(claimId, updater, action);
  }

  /**
   * Read only operation
   * @returns snapshot of the full state
   */
  getState(): T {
    return this.store.getState() as T;
  }

  /**
   * Read only operation
   * @returns observable on any change to the full state
   */
  state$(): Observable<T> {
    return this.store.state$() as Observable<T>;
  }

  /**
   * Read only operation
   * @param sliceName slice name to select (listen) on
   * @returns observable on any changes to the slice within state
   */
  select$<K>(sliceName: string): Observable<K> {
    return this.store.select$(sliceName);
  }
}
