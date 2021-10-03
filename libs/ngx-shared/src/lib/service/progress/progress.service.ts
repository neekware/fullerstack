/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private stateSubject = new BehaviorSubject<boolean>(false);
  private inflight = 0;
  state$: Observable<boolean>;

  constructor() {
    this.state$ = this.stateSubject.asObservable();
  }

  start() {
    this.inflight++;
    this.stateSubject.next(this.inflight > 0);
  }

  end() {
    this.inflight--;
    this.stateSubject.next(this.inflight > 0);
  }
}
