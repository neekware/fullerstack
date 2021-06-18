/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { isFunction } from 'lodash-es';
import { Subscription } from 'rxjs';

export class SubifyManager {
  protected trackedSubs: Subscription[] = [];

  /**
   * Registers all subscriptions that need auto cancellation on destroy
   * @param subscription Subscription or a list of Subscription
   */
  set track(subscription: Subscription | Subscription[]) {
    if (Array.isArray(subscription)) {
      this.trackedSubs = [...this.trackedSubs, ...subscription];
    } else {
      this.trackedSubs.push(subscription);
    }
  }

  /** Unsubscribes from all tracked subscriptions */
  unsubscribe() {
    this.trackedSubs.forEach((sub) => sub && isFunction(sub.unsubscribe) && sub.unsubscribe());
    this.trackedSubs = [];
  }
}
