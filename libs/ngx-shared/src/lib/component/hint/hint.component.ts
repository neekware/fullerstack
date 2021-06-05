import { Direction } from '@angular/cdk/bidi';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { tryGet } from '@fullerstack/agx-util';
import { I18nService } from '@fullerstack/ngx-i18n';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, first, takeUntil } from 'rxjs/operators';

import { HINT_DEBOUNCE_TIME } from './hint.model';
import { validatorHintMessage } from './hint.util';

@Component({
  selector: 'fullerstack-hint',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HintComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() control: AbstractControl;
  @Input() direction: Direction;
  @Input() hint: string;

  private _touched = false;
  @Input()
  set isTouched(value: boolean) {
    this._touched = value;
    this.process();
  }

  private destroy$ = new Subject<boolean>();
  show$ = new BehaviorSubject<boolean>(false);
  error: string = undefined;
  ltrDirection = true;

  constructor(readonly translateService: TranslateService, readonly i18n: I18nService) {}

  reset(): void {
    this.error = undefined;
  }

  ngOnInit() {
    if (this.direction) {
      this.ltrDirection = this.direction === 'ltr';
    } else {
      this.i18n.languageChanges$.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.ltrDirection = this.i18n.direction === 'ltr';
        },
      });
    }
  }

  ngOnChanges() {
    if (this.direction) {
      this.ltrDirection = this.direction === 'ltr';
    } else {
      this.ltrDirection = this.i18n.direction === 'ltr';
    }
  }

  ngAfterViewInit() {
    if (this.control) {
      this.control.statusChanges
        .pipe(debounceTime(HINT_DEBOUNCE_TIME), takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.process();
          },
        });
    }
  }

  process() {
    for (const error in this.control.errors) {
      const hasError = Object.prototype.hasOwnProperty.call(this.control.errors, error);
      if ((hasError && this._touched) || !this.control.pristine) {
        this.processFeedback(error, this.control.errors[error]);
        this.show$.next(!!this.error);
        return;
      }
    }
    this.show$.next(false);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processFeedback(validatorName: string, validatorValue?: any) {
    validatorName = validatorName === 'pattern' ? 'invalidFormat' : validatorName;

    if (validatorName === 'minlength') {
      return this.handleMinimumLength(validatorValue.requiredLength);
    }

    this.error = tryGet(
      () => validatorHintMessage(validatorName),
      validatorHintMessage('invalidInput')
    );
  }

  handleMinimumLength(requiredLength: number) {
    const message = validatorHintMessage('minlength');
    this.translateService
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
