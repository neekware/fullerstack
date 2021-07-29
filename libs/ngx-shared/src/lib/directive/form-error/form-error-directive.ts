/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { tryGet } from '@fullerstack/agx-util';
import { I18nService } from '@fullerstack/ngx-i18n';
import { Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, first, takeUntil } from 'rxjs/operators';

import { VALIDATION_DEBOUNCE_TIME, validatorMessage } from './form-error.model';

@Directive({
  selector: '[errorDirective]',
})
export class FormErrorDirective implements AfterViewInit, OnDestroy, OnInit {
  private destroy$ = new Subject<boolean>();
  @Input() control: AbstractControl;

  private _touched = false;
  @Input()
  set isTouched(value: boolean) {
    this._touched = value;
    this.process();
  }

  error: string = undefined;

  constructor(readonly el: ElementRef, readonly i18n: I18nService) {}

  reset(): void {
    this.error = undefined;
  }

  ngOnInit() {
    this.i18n.stateChange$.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.process();
      },
    });
  }

  ngAfterViewInit() {
    merge(this.control.valueChanges, this.control.statusChanges)
      .pipe(
        debounceTime(VALIDATION_DEBOUNCE_TIME),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.process();
        },
      });
  }

  process() {
    for (const error in this.control.errors) {
      if (Object.prototype.hasOwnProperty.call(this.control.errors, error)) {
        this.processFeedback(error, this.control.errors[error]);
        this.i18n.translate
          .get(this.error)
          .pipe(first(), takeUntil(this.destroy$))
          .subscribe((translatedError: string) => {
            this.el.nativeElement.innerHTML = translatedError;
          });
        if (this.error) {
          return;
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private processFeedback(validatorName: string, validatorValue?: any) {
    validatorName = validatorName === 'pattern' ? 'invalidFormat' : validatorName;

    if (validatorName === 'minlength') {
      return this.handleMinimumLength(validatorValue.requiredLength);
    }

    if (validatorName === 'maxlength') {
      return this.handleMaximumLength(validatorValue.requiredLength);
    }

    this.error = tryGet(() => validatorMessage(validatorName), validatorMessage('invalidInput'));
  }

  private handleMinimumLength(requiredLength: number) {
    const message = validatorMessage('minlength');
    this.i18n.translate
      .get(message, { __value__: requiredLength })
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe((error: string) => {
        this.error = error;
      });
  }

  private handleMaximumLength(requiredLength: number) {
    const message = validatorMessage('maxlength');
    this.i18n.translate
      .get(message, { __value__: requiredLength })
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe((error: string) => {
        this.error = error;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
