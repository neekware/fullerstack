/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { BehaviorSubject } from 'rxjs';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type StoreLogger = (message: any, ...extras: any[]) => void;

/**
 * Store config declaration
 */
export class StoreConfig {
  // freeze state, full or partial
  immutable?: boolean;
}

/**
 * State Reducer that gives the caller the option of defining the new state partial using a callback by
 * providing the current state snapshot.
 */
export type SetStateReducer<T = any, K = any> = (currentState: T) => Partial<T> | K;

/**
 * Store Type - Object
 */
export interface StoreType {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: any;
}

export class ImmutableStore<T extends StoreType> extends BehaviorSubject<T> {
  constructor(initialData: T) {
    super(initialData);
  }

  next(data: T): void {
    super.next(data);
  }

  getValue(): Readonly<T> {
    return super.getValue() as Readonly<T>;
  }
}

export interface StoreRegistryEntry {
  sliceName: string;
  privateKey: string;
  logger?: StoreLogger;
}
