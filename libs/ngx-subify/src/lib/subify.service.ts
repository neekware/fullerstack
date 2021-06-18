/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { SubifyManager } from './subify.manager';

/** An injectable service class that handles auto cancellation of subscriptions */
@Injectable()
export class SubifyService extends SubifyManager implements OnDestroy {
  destroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.unsubscribe();
  }
}
