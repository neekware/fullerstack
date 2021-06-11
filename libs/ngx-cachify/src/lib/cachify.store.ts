/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { ImmutableStore, SetStateReducer, StoreType } from './cachify.model';
import { deepFreeze, isFunction } from './cachify.util';

export class CacheStore<T = StoreType> {
  private state$: ImmutableStore<T>;

  /**
   * Initialize the store with the given initial state value
   * @param initialState The initial state of store
   */
  constructor(initialState: T, readonly isProduction = true) {
    this.state$ = new ImmutableStore<T>(initialState);
  }

  /**
   * Returns the current state as a stream
   * @returns The current state stream
   * Note: Emits the current state as the first item in the stream
   */
  getState(): Observable<T> {
    return this.state$.asObservable().pipe(map((state) => this.immutable(state)));
  }

  /**
   * Returns the current snapshot of the state
   * @returns Object of type T
   */
  getStateSnapshot(): T {
    return this.immutable(this.state$.getValue());
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
    this.state$.next(nextState);
  }

  /**
   * Returns dot-notation state key (reference) as stream
   * @param key Key to section of state
   * Note: Emits the the current state key match as the first item in the stream
   */
  select<K>(key: string): Observable<K> {
    const selected$ = this.state$.pipe(
      map((state: T) => state[key] as K),
      distinctUntilChanged(),
      map((state) => this.immutable(state))
    );
    return selected$;
  }

  /**
   *
   * @param state partial or full state to be returned
   * @returns immutable state during development, mutable during production
   */
  private immutable<J>(state: J): J {
    if (!this.isProduction) {
      return deepFreeze(state) as J;
    }
    return state as J;
  }
}