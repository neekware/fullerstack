/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '@fullerstack/ngx-auth';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { UserService, UserState } from '@fullerstack/ngx-user';
import { ValidationService } from '@fullerstack/ngx-util';

import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'fullerstack-email-change-request',
  templateUrl: './email-change-request.component.html',
  styleUrls: ['./email-change-request.component.scss'],
})
export class EmailChangeRequestComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private destroy$ = new Subject<boolean>();
  title = _('COMMON.SETTINGS');
  subtitle = _('COMMON.EMAIL.CHANGE_REQUEST');
  icon = 'email-sync';
  isLoading = false;
  status = { ok: true, message: '' };

  constructor(
    readonly formBuilder: FormBuilder,
    readonly validation: ValidationService,
    readonly auth: AuthService,
    readonly user: UserService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.user.stateSub$.pipe(debounceTime(200), takeUntil(this.destroy$)).subscribe({
      next: (state) => {
        this.buildForm(state);
      },
    });
  }

  private buildForm(state?: UserState) {
    const caseInsensitiveEmail = true;
    const errorKey = 'emailInUse';

    this.form = this.formBuilder.group({
      currentEmail: [{ value: state?.email || '', disabled: true }],
      email: [
        '',
        [
          Validators.required,
          this.validation.validateEmail,
          this.validation.matchOtherThan(state?.email, caseInsensitiveEmail, errorKey),
        ],
        [this.auth.validateEmailAvailability()],
      ],
      password: ['', [Validators.required], [this.auth.validateUserPassword()]],
    });
  }

  submit() {
    this.isLoading = true;
    const { email } = this.form.value;

    this.auth
      .emailChangeRequest$({ email })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (status) => {
          this.isLoading = false;

          if (status.ok) {
            this.status = { ...status, message: _('INFO.PASSWORD.RESET_SUCCESS') };
            this.form.disable();
          } else {
            this.status = {
              ...status,
              message: status.message || _('ERROR.USER.EMAIL_CHANGE_REQUEST'),
            };
          }
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
