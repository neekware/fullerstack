/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@fullerstack/ngx-auth';
import { ChangePasswordRequestInput } from '@fullerstack/ngx-gql/schema';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { ValidationService } from '@fullerstack/ngx-util';
import { Subject } from 'rxjs';

@Component({
  selector: 'fullerstack-password-reset-request-form',
  templateUrl: './password-reset-request-form.component.html',
  styleUrls: ['./password-reset-request-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordResetRequestFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private destroy$ = new Subject<boolean>();
  @Output() submit$ = new EventEmitter<ChangePasswordRequestInput>();
  @Input() title = _('COMMON.PASSWORD');
  @Input() subtitle = _('COMMON.PASSWORD.RESET_REQUEST');
  @Input() icon = 'lock-open-outline';
  @Input() autocomplete = 'off';
  @Input() emailHint: string;
  @Input() passwordHint: string;
  formTouched = false;
  onFormTouched = () => (this.formTouched = true);

  constructor(
    readonly formBuilder: FormBuilder,
    readonly validation: ValidationService,
    readonly auth: AuthService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, this.validation.validateEmail]],
    });
  }

  submit() {
    this.formTouched = false;
    this.submit$.emit(this.form.value);

    // this.form.disable();
    // this.auth
    //   .passwordResetRequest$(this.form.value)
    //   .pipe(first(), takeUntil(this.destroy$))
    //   .subscribe({
    //     next: () => {
    //       this.form.enable();
    //     },
    //   });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
