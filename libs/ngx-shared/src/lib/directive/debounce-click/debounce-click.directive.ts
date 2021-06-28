/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/**
 * Usage
 * <button debounceClick (debounceClick)="doSomething()" [debounceTime]="700">Debounce Button</button>
 */
@Directive({
  selector: '[debounceClick]',
})
export class DebounceClickDirective implements OnInit, OnDestroy {
  @Output() debounceClick = new EventEmitter();
  @Input() debounceTime = 500;
  private click$ = new Subject();
  private destroy$ = new Subject<boolean>();

  ngOnInit() {
    this.click$.pipe(debounceTime(this.debounceTime)).subscribe({
      next: (event) => this.debounceClick.emit(event),
    });
  }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    this.click$.next(event);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
