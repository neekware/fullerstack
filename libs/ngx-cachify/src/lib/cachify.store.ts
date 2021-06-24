/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { isFunction } from 'lodash-es';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { deepFreeze } from './cachify.freeze';
import { ImmutableStore, SetStateReducer, StoreType } from './cachify.model';

export class CacheStore<T = StoreType> {
  private state$: ImmutableStore<T>;

  /**
   * Initialize the store with the given initial state value
   * @param initialState The initial state of store
   */
  constructor(initialState: T, readonly isImmutable = true) {
    this.state$ = new ImmutableStore<T>(initialState);
  }

  /**
   * Returns the current state as a stream
   * @returns The current state stream
   * Note: Emits the current state as the first item in the stream
   */
  getState(): Observable<T> {
    return this.state$.asObservable();
  }

  /**
   * Returns the current snapshot of the state
   * @returns Object of type T
   */
  getStateSnapshot(): T {
    return this.state$.getValue();
  }

  /**
   * Moves the store to a new state by merging the given (or generated) partial state
   * into the existing state (creating a new state object).
   * @param updater Partial data or function to update state
   * Note: https://github.com/Microsoft/TypeScript/issues/18823
   */
  setState(updater: SetStateReducer<T> | Partial<T>): void;
  setState(updater: any): void {
    const currentState = this.getStateSnapshot();
    const partialState = isFunction(updater) ? updater(currentState) : updater;
    const nextState = Object.assign({}, currentState, partialState);
    this.isImmutable ? this.state$.next(deepFreeze(nextState)) : this.state$.next(nextState);
  }

  /**
   * Returns dot-notation state key (reference) as stream
   * @param key Key to section of state
   * Note: Emits the the current state key match as the first item in the stream
   */
  select<K>(key: string): Observable<K> {
    const selected$ = this.state$.pipe(
      map((state: T) => state[key] as K),
      distinctUntilChanged()
    );
    return selected$;
  }
}
