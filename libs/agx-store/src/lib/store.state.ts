/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import {
  ImmutableStore,
  StoreLogger,
  StoreRegistryEntry,
  StoreStateReducer,
  StoreStateType,
} from './store.model';
import { deepFreeze, getUniqueString, isFunction } from './store.util';

export class StoreState<T = StoreStateType> {
  private immutable = true;
  private registry = new Map<string, StoreRegistryEntry>();
  private storeState$: ImmutableStore<T>;

  /**
   * Initialize the store with the given initial state value
   * @param initialState The initial state of store
   */
  constructor(initialState: T, immutable?: boolean) {
    this.immutable = immutable;
    this.storeState$ = new ImmutableStore<T>(initialState);
  }

  /**
   * Claim a slice within state
   * @param sliceName slice name (hint: attribute key of an object)
   * @returns Slice ownership claim ID (required for write/update and release of slice)
   */
  claimSlice(sliceName: string, logger?: StoreLogger): string {
    this.registry.forEach((entity) => {
      if (entity.sliceName === sliceName) {
        throw new Error(`claimSlice: Slice ${sliceName} already claimed (${entity.sliceName})`);
      }
    });

    const claimId = getUniqueString();
    this.registry.set(claimId, { sliceName, claimId, logger });
    return claimId;
  }

  /**
   * Release slice
   * @param claimId Slice ownership claim ID
   */
  releaseSlice(claimId: string) {
    const entity = this.registry.get(claimId);
    if (!entity) {
      throw new Error(`releaseSlice: No slice found with claim ID: (${claimId})`);
    }

    const state = this.getState();
    const newState = { ...state, ...{ [entity.sliceName]: undefined } };
    this.immutable ? this.storeState$.next(deepFreeze(newState)) : this.storeState$.next(newState);

    this.registry.delete(claimId);
  }

  /**
   * Moves the store to a new state by merging the given (or generated) partial state
   * into the existing state (creating a new state object).
   *
   * @param claimId private key to claim write permission to this slice
   * @param updater Partial data or function to update state
   *
   * this.store.setState(this.claimId, {
   *  ...DefaultAuthState,
   *  isSigningUp: true,
   *  isLoading: true,
   * }, 'AUTH_SIGNUP_REQUEST');
   *
   * this.store.setState(this.claimId, (state) => {
   *  ...state[this.sliceName],
   *  isSigningUp: true,
   *  isLoading: true,
   * }, 'AUTH_SIGNUP_REQUEST');
   */
  setState<K = any>(claimId: string, updater: StoreStateReducer<T, K>, action?: string): K;
  setState<K = any>(claimId: string, updater: Partial<T>, action?: string): K; // required (reducer <=> object)
  setState<K = any>(claimId: string, updater: K, action?: string): K {
    const entry = this.registry.get(claimId);
    if (!entry) {
      throw new Error(`setState: No slice registration with private key: (${claimId})`);
    }
    const currentState = this.getState();
    if (entry.logger)
      entry.logger(`[STORE][PREV][${action ? action : entry.sliceName}]`, {
        [entry.sliceName]: currentState[entry.sliceName],
      });

    const partialState = isFunction(updater) ? updater(currentState) : updater;
    const nextState = Object.assign({}, currentState, { [entry.sliceName]: partialState });
    this.immutable
      ? this.storeState$.next(deepFreeze(nextState))
      : this.storeState$.next(nextState);

    if (entry.logger)
      entry.logger(`[STORE][NEXT][${action ? action : entry.sliceName}]`, {
        [entry.sliceName]: nextState[entry.sliceName],
      });

    return this.getState()[entry.sliceName] as K;
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
    return this.storeState$.pipe(
      map((state: T) => state[sliceName] as K),
      distinctUntilChanged()
    );
  }
}
