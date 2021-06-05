import { Subscription } from 'rxjs';

import { isFunction } from './subify.util';

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
