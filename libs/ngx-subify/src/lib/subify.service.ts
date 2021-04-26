import { Injectable, OnDestroy } from '@angular/core';

import { Subject, Subscription } from 'rxjs';

import { SubifyManager } from './subify.manager';

/** An injectable service class that handles auto cancellation of subscriptions */
@Injectable()
export class SubifyService extends SubifyManager implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  /**
   * Registers all subscriptions that need auto cancellation on destroy
   * @deprecated Do Not Use!
   */
  autoUnsubscribe(subscription: Subscription | Subscription[]) {
    this.track = subscription;
  }

  /** Handles auto cancellation of all subscriptions on destroy */
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.unsubscribe();
  }
}
