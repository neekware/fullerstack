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
import { ValidationService } from '@fullerstack/ngx-util';
import { Subject, filter, first, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'fullerstack-password-reset-perform',
  templateUrl: './password-reset-perform.component.html',
  styleUrls: ['./password-reset-perform.component.scss'],
})
export class PasswordResetPerformComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private destroy$ = new Subject<boolean>();
  title = _('COMMON.RECOVERY');
  subtitle = _('COMMON.PASSWORD.RENEW');
  icon = 'lock-open-outline';
  isLoading = false;
  status = { ok: true, message: '' };
  resetLinkValid = false;

  sessionResetMapping = [
    { name: _('COMMON.PASSWORD.TERMINATE_ALL_SESSIONS'), reset: true },
    { name: _('COMMON.PASSWORD.SESSIONS_IGNORE'), reset: false },
  ];

  constructor(
    readonly route: ActivatedRoute,
    readonly formBuilder: FormBuilder,
    readonly validation: ValidationService,
    readonly auth: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        filter((params) => !!params.get('token')),
        first(),
        switchMap((params) => {
          this.isLoading = true;
          return this.auth.verifyPasswordResetRequest$({
            token: params.get('token'),
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (resp) => {
          this.isLoading = false;
          if (resp.ok) {
            this.resetLinkValid = true;
          } else {
            // handle known errors
            this.icon = 'account-alert-outline';
            this.status = {
              ok: false,
              message: resp.message || _('WARN.USER.VERIFICATION_FAILURE'),
            };
          }
        },
        error: (err) => {
          // handler server errors
          this.icon = 'account-alert-outline';
          this.isLoading = false;
          this.status = {
            ok: false,
            message: err.error?.message || _('WARN.USER.VERIFICATION_FAILURE'),
          };
        },
      });

    this.auth.stateSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (state) => {
        if (state.isLoggedIn) {
          this.auth.goTo(this.auth.authUrls.landingUrl);
        } else if (!this.form) {
          this.buildForm();
        }
      },
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group(
      {
        password: [
          '',
          [Validators.required, Validators.minLength(this.validation.PASSWORD_MIN_LEN)],
        ],
        passwordConfirmation: ['', [Validators.required]],
        resetOtherSessions: [false, [Validators.required]],
      },
      { validators: this.validation.matchingPasswords }
    );
  }

  submit() {
    this.isLoading = true;
    this.auth
      .passwordResetRequest$(this.form.value)
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
