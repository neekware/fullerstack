/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { isFunction } from 'lodash-es';
import { merge as ldNestedMerge } from 'lodash-es';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { DeepReadonly } from 'ts-essentials';
import { v4 as uuidV4 } from 'uuid';

import { DefaultStoreConfig } from './store.default';
import { deepFreeze } from './store.freeze';
import { ImmutableStore, SetStateReducer, StoreConfig, StoreType } from './store.model';

export class Store<T = StoreType> {
  private config: DeepReadonly<StoreConfig> = DefaultStoreConfig;
  private registry = new Map<string, string>(); // <privateKey, sliceName>
  private storeState$: ImmutableStore<T>;

  /**
   * Initialize the store with the given initial state value
   * @param initialState The initial state of store
   */
  constructor(initialState: T, config?: StoreConfig) {
    this.config = ldNestedMerge({ ...DefaultStoreConfig, ...config });
    this.storeState$ = new ImmutableStore<T>(initialState);
  }

  /**
   * A slice of the state can be registered by only one entity
   * @param sliceName name of a slice from state (hint: attribute key of an object)
   * @returns Private key confirming `write` permission of the slice
   */
  registerSlice(sliceName: string): string {
    this.registry.forEach((pKey, sName) => {
      if (sliceName === sName) {
        throw new Error(
          `registerSlice: Found slice registration with private key: (${privateKey})`
        );
      }
    });

    const privateKey = uuidV4();
    this.registry.set(privateKey, sliceName);
    return privateKey;
  }

  /**
   * Remove registration of a slice `write` permission
   * @param privateKey private key for state slice registration
   */
  deregisterSlice(privateKey: string) {
    if (this.registry.get(privateKey)) {
      this.registry.delete(privateKey);
    }

    throw new Error(`deregisterSlice: No slice registration with private key: (${privateKey})`);
  }

  /**
   * Moves the store to a new state by merging the given (or generated) partial state
   * into the existing state (creating a new state object).
   * @param updater Partial data or function to update state
   * Note: https://github.com/Microsoft/TypeScript/issues/18823
   */
  setState(privateKey: string, updater: SetStateReducer<T> | Partial<T>): void;
  setState(privateKey: string, updater: any): void {
    if (!this.registry.get(privateKey)) {
      throw new Error(`setState: No slice registration with private key: (${privateKey})`);
    }
    const currentState = this.getState();
    const partialState = isFunction(updater) ? updater(currentState) : updater;
    const nextState = Object.assign({}, currentState, partialState);
    this.config?.immutable
      ? this.storeState$.next(deepFreeze(nextState))
      : this.storeState$.next(nextState);
  }

  /**
   * Returns the current snapshot of the state
   * @returns Object of type T
   */
  getState(): T {
    return this.storeState$.getValue();
  }

  /**
   * Returns the current state as a stream
   * @returns The current state stream
   * Note: Emits the current state as the first item in the stream
   */
  state$(): Observable<T> {
    return this.storeState$.asObservable();
  }

  /**
   * Returns dot-notation state key (reference) as stream
   * @param key Key to section of state
   * Note: Emits the the current state key match as the first item in the stream
   */
  select$<K>(sliceName: string): Observable<K> {
    const selected$ = this.storeState$.pipe(
      map((state: T) => state[sliceName] as K),
      distinctUntilChanged()
    );
    return selected$;
  }
}
