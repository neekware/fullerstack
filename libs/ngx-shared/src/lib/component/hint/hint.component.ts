import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { tryGet } from '@fullerstack/agx-util';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, first, takeUntil } from 'rxjs/operators';

import { HINT_DEBOUNCE_TIME } from './hint.model';
import { validatorHintMessage } from './hint.util';

@Component({
  selector: 'fullerstack-hint',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HintComponent implements OnDestroy, AfterViewInit {
  @Input() control: AbstractControl;
  @Input() below = true;
  @Input() right = true;

  private destroy$ = new Subject<boolean>();
  show$ = new BehaviorSubject<boolean>(false);
  hint: string = undefined;

  constructor(readonly translateService: TranslateService) {}

  reset(): void {
    this.hint = undefined;
  }

  ngAfterViewInit() {
    if (this.control) {
      this.control.valueChanges
        .pipe(debounceTime(HINT_DEBOUNCE_TIME), takeUntil(this.destroy$))
        .subscribe({
          next: (state) => {
            for (const error in this.control.errors) {
              const hasError = Object.prototype.hasOwnProperty.call(this.control.errors, error);
              if (hasError && !this.control.pristine) {
                this.processFeedback(error, this.control.errors[error]);
                this.show$.next(!!this.hint);
                return;
              }
            }
            this.show$.next(false);
          },
        });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processFeedback(validatorName: string, validatorValue?: any) {
    validatorName = validatorName === 'pattern' ? 'invalidFormat' : validatorName;

    if (validatorName === 'minlength') {
      return this.handleMinimumLength(validatorValue.requiredLength);
    }

    this.hint = tryGet(
      () => validatorHintMessage(validatorName),
      validatorHintMessage('invalidInput')
    );
  }

  handleMinimumLength(requiredLength: number) {
    const message = validatorHintMessage('minlength');
    this.translateService
      .get(message, { value: requiredLength })
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe((translatedHint: string) => {
        this.hint = translatedHint;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
