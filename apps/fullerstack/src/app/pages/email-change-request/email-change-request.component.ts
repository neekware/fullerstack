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
import {
  ConfirmationDialogService,
  ProgressService,
  ValidationService,
} from '@fullerstack/ngx-shared';
import { UserService, UserState } from '@fullerstack/ngx-user';
import { Observable, Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'fullerstack-email-change-request',
  templateUrl: './email-change-request.component.html',
  styleUrls: ['./email-change-request.component.scss'],
  providers: [ConfirmationDialogService],
})
export class EmailChangeRequestComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private destroy$ = new Subject<boolean>();
  title = _('COMMON.EMAIL');
  subtitle = _('COMMON.EMAIL.CHANGE_REQUEST');
  icon = 'email-sync';
  status = { ok: true, message: '' };

  constructor(
    readonly formBuilder: FormBuilder,
    readonly validation: ValidationService,
    readonly auth: AuthService,
    readonly user: UserService,
    readonly progress: ProgressService,
    readonly confirm: ConfirmationDialogService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.user.stateSub$.pipe(debounceTime(200), takeUntil(this.destroy$)).subscribe({
      next: (state) => {
        this.updateForm(state);
      },
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      currentEmail: [{ value: '', disabled: true }],
      email: [
        '',
        [Validators.required, this.validation.validateEmail],
        [this.auth.validateEmailAvailability()],
      ],
      password: ['', [Validators.required], [this.auth.validateUserPassword()]],
    });
  }

  private updateForm(state: UserState) {
    this.form.patchValue({
      currentEmail: state.email,
    });
  }

  submit() {
    const { email } = this.form.value;

    this.auth
      .emailChangeRequest$({ email })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (status) => {
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

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.form?.disabled && this.form?.dirty && this.auth.state.isLoggedIn) {
      const title = _('COMMON.LEAVE_PAGE');
      const info = _('WARN.DISCARD_CHANGES_ACTION');
      return this.confirm.confirmation(title, info);
    }
    return true;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
