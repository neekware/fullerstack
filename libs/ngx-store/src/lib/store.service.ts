/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable } from '@angular/core';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';
import { merge as ldNestedMerge } from 'lodash-es';
import { Observable } from 'rxjs';
import { DeepReadonly } from 'ts-essentials';

import { DefaultStoreConfig } from './store.default';
import { SetStateReducer, StoreType } from './store.model';
import { Store } from './store.state';

@Injectable()
export class StoreService<T = StoreType> {
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  private store: Store;

  constructor(private config: ConfigService, private logger: LoggerService) {
    this.options = ldNestedMerge({ store: DefaultStoreConfig }, this.config.options);
    this.store = new Store<StoreType>({}, this.options.store.immutable);
    this.logger.debug('StoreService ready ...');
  }

  /**
   * Claim slice within state
   * @param sliceName slice name to claim write ownership
   * @returns registration private key
   */
  registerSlice(sliceName: string): string {
    return this.store.registerSlice(sliceName);
  }

  /**
   * Remove ownership of a slice, and delete the slice
   * @param privateKey slice ownership proof
   * @returns void
   */
  deregisterSlice(privateKey: string) {
    return this.store.deregisterSlice(privateKey);
  }

  /**
   * Mutates (create/update) a slice within state
   * @param privateKey key required by owner of slice for `write` operation
   * @param updater object or function that returns a partial object of type T
   */
  setState<K = any>(privateKey: string, updater: SetStateReducer<T> | Partial<T> | K): void;
  setState<K = any>(privateKey: string, updater: K): void {
    this.setState<K>(privateKey, updater);
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
