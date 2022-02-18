/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@fullerstack/ngx-auth';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import {
  ConfirmationDialogService,
  ProgressService,
  ValidationService,
} from '@fullerstack/ngx-shared';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'fullerstack-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss'],
  providers: [ConfirmationDialogService],
})
export class PasswordChangeComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private destroy$ = new Subject<boolean>();
  title = _('COMMON.PASSWORD');
  subtitle = _('COMMON.PASSWORD_CHANGE');
  icon = 'lock-open-outline';
  status = { ok: true, message: '' };
  token: string;

  sessionResetMapping = [
    { name: _('COMMON.PASSWORD.TERMINATE_ALL_SESSIONS'), reset: true },
    { name: _('COMMON.PASSWORD.SESSIONS_IGNORE'), reset: false },
  ];

  constructor(
    readonly route: ActivatedRoute,
    readonly formBuilder: FormBuilder,
    readonly validation: ValidationService,
    readonly auth: AuthService,
    readonly progress: ProgressService,
    readonly confirm: ConfirmationDialogService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.auth.stateSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (state) => {
        if (!state.isLoggedIn) {
          this.auth.goTo(this.auth.authUrls.loginUrl);
        }
      },
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group(
      {
        oldPassword: ['', [Validators.required], [this.auth.validateUserPassword()]],
        password: ['', [Validators.required, this.validation.validatePassword]],
        passwordConfirmation: ['', [Validators.required]],
        resetOtherSessions: [false, [Validators.required]],
      },
      { validators: this.validation.matchingPasswords }
    );
  }

  submit() {
    this.auth
      .passwordChange$({
        oldPassword: this.form.value.oldPassword,
        newPassword: this.form.value.password,
        resetOtherSessions: this.form.value?.resetOtherSessions,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (status) => {
          if (status.ok) {
            this.status = { ...status, message: _('SUCCESS.USER.PASSWORD_CHANGE') };
            this.form.disable();
          } else {
            this.status = {
              ...status,
              message: status.message || _('ERROR.USER.PASSWORD_CHANGE'),
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
