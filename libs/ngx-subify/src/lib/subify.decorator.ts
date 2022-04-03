/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { OnDestroy } from '@angular/core';
import { isFunction } from 'lodash-es';

import { DefaultSubifyDecoratorOptions } from './subify.default';

/**
 * SubifyDecorator decorator - streamline canceling of subscriptions
 */
export function SubifyDecorator(options = DefaultSubifyDecoratorOptions) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function _subify<T extends new (...args: any[]) => any>(target: T) {
    const className = target.name.length > 2 ? target.name : options.className;

    if (!isFunction(target.prototype['ngOnDestroy'])) {
      throw new Error(`${className} must implement OnDestroy when decorated with @SubifyDecorator`);
    }

    return class extends target implements OnDestroy {
      _options = {
        ...DefaultSubifyDecoratorOptions,
        ...options,
        className,
      } as const;

      /**
       * Validates options
       * @returns void
       */
      _validateOptions(): void {
        if (
          this._options.takeUntilInputName &&
          !Object.prototype.hasOwnProperty.call(this, this._options.takeUntilInputName)
        ) {
          console.error(
            `${this._options.className} must have "${this._options.takeUntilInputName}: Subject<boolean> = new Subject<boolean>();" when decorated with @SubifyDecorator`
          );
        }
      }

      /**
       * Cancels all subscriptions on destroy
       * @returns void
       */
      ngOnDestroy(): void {
        this._validateOptions();
        this._processTakeUtil();
        if (this._options.includes.length > 0) {
          this._processIncludes();
        } else {
          this._processExcludes();
        }
        super.ngOnDestroy();
      }

      /**
       * Cancels all subscriptions that use takeUntil
       * @returns void
       */
      _processTakeUtil(): void {
        if (Object.prototype.hasOwnProperty.call(this, this._options.takeUntilInputName)) {
          this[this._options.takeUntilInputName].next(true);
          this[this._options.takeUntilInputName].complete();
        }
      }

      /**
       * Cancels only the subscriptions that are explicitly includes
       * @returns void
       */
      _processIncludes(): void {
        this._options.includes.forEach((prop) => {
          if (Object.prototype.hasOwnProperty.call(this, prop)) {
            const subscription = this[prop];
            if (subscription && subscription.unsubscribe && isFunction(subscription.unsubscribe)) {
              subscription.unsubscribe();
            }
          } else {
            console.warn(`${target.name} has no subscription property called ${prop}`);
          }
        });
      }

      /**
       * Cancels all auto-detected subscriptions except those that are explicitly excluded
       * @returns void
       */
      _processExcludes(): void {
        for (const prop in this) {
          if (
            Object.prototype.hasOwnProperty.call(this, prop) &&
            prop !== this._options.takeUntilInputName &&
            this._options.excludes.indexOf(prop) <= -1
          ) {
            const subscription = this[prop];
            if (subscription && subscription.unsubscribe && isFunction(subscription.unsubscribe)) {
              subscription.unsubscribe();
            }
          }
        }
      }
    };
  };
}
