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
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { tokenizeFullName } from '@fullerstack/agx-util';
import { AuthService } from '@fullerstack/ngx-auth';
import { UserCreateInput } from '@fullerstack/ngx-gql/schema';
import { I18nService, i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { ValidationService } from '@fullerstack/ngx-util';

import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'fullerstack-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent implements OnInit, OnDestroy {
  @ViewChild('emailInput') emailField?: ElementRef;
  form: FormGroup;
  private destroy$ = new Subject<boolean>();
  @Output() submit$ = new EventEmitter<UserCreateInput>();
  @Input() title = _('COMMON.REGISTER');
  @Input() subtitle = _('COMMON.ACCOUNT_CREATE');
  @Input() icon = 'account-plus-outline';
  @Input() autocomplete = 'off';
  @Input() nameHint: string;
  @Input() emailHint: string;
  @Input() passwordHint: string;
  @Input() passwordConfirmHint: string;
  formTouched = false;
  onFormTouched = () => (this.formTouched = true);

  constructor(
    readonly formBuilder: FormBuilder,
    readonly i18n: I18nService,
    readonly validation: ValidationService,
    readonly auth: AuthService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(this.validation.NAME_MIN_LEN),
            this.validation.validateFullName,
          ],
        ],
        email: [
          '',
          [Validators.required, this.validation.validateEmail],
          [this.auth.validateEmailAvailability()],
        ],
        password: ['', [Validators.required, this.validation.validatePassword]],
        passwordConfirmation: ['', [Validators.required]],
      },
      { validators: this.validation.matchingPasswords }
    );
  }

  submit() {
    this.formTouched = false;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, password, ...ignore } = this.form.value;
    const { firstName, lastName } = tokenizeFullName(this.form.value.name);
    // const language = this.i18n.currentLanguage;

    this.form.disable();
    this.auth
      .registerRequest$({
        firstName,
        lastName,
        email,
        password,
      })
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.form.enable();
          if (this.auth.state.message === 'ERROR.AUTH.EMAIL_IN_USE') {
            this.emailField.nativeElement.select();
          }
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
