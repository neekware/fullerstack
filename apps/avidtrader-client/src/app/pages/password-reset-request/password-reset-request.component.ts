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
import { ProgressService, ValidationService } from '@fullerstack/ngx-shared';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'fullerstack-password-reset-request',
  templateUrl: './password-reset-request.component.html',
  styleUrls: ['./password-reset-request.component.scss'],
})
export class PasswordResetRequestComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private destroy$ = new Subject<boolean>();
  title = _('COMMON.PASSWORD');
  subtitle = _('COMMON.PASSWORD.RESET_REQUEST');
  icon = 'lock-open-outline';
  status = { ok: true, message: '' };

  constructor(
    readonly formBuilder: FormBuilder,
    readonly validation: ValidationService,
    readonly auth: AuthService,
    readonly progress: ProgressService
  ) {}

  ngOnInit() {
    if (this.auth.state.isLoggedIn) {
      this.auth.goTo(this.auth.authUrls.landingUrl);
    } else {
      this.buildForm();
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      email: [
        '',
        [Validators.required, this.validation.validateEmail],
        [this.auth.validateEmailExistence()],
      ],
    });
  }

  submit() {
    this.auth
      .passwordResetRequest$(this.form.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (status) => {
          if (status.ok) {
            this.status = { ...status, message: _('INFO.PASSWORD.RESET_SUCCESS') };
            this.form.disable();
          } else {
            this.status = {
              ...status,
              message: status.message || _('INFO.PASSWORD.RESET_SUCCESS'),
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
