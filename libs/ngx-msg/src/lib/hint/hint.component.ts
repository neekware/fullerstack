import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { tryGet } from '@fullerstack/agx-util';
import { validatorHintMessage } from './hint.util';

@Component({
  selector: 'fullerstack-hint',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HintComponent implements OnDestroy {
  @Input() control: FormControl;
  @Input() below = true;
  @Input() right = true;

  private destroy$ = new Subject<boolean>();
  hint: string = undefined;

  constructor(readonly translateService: TranslateService) {}

  reset(): void {
    this.hint = undefined;
  }

  get show(): boolean {
    this.reset();
    if (this.control) {
      for (const error in this.control.errors) {
        const hasError = Object.prototype.hasOwnProperty.call(
          this.control.errors,
          error
        );

        if (hasError && this.control.touched) {
          this.processFeedback(error, this.control.errors[error]);
          return !!this.hint;
        }
      }
    }

    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processFeedback(validatorName: string, validatorValue?: any) {
    validatorName =
      validatorName === 'pattern' ? 'invalidFormat' : validatorName;

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
