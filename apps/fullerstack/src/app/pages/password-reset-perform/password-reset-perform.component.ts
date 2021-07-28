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
import { ProgressService, ValidationService } from '@fullerstack/ngx-shared';
import { Subject, filter, first, map, switchMap, takeUntil } from 'rxjs';

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
  status = { ok: true, message: '' };
  resetLinkValid = false;
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
    readonly progress: ProgressService
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        map((params) => params.get('token')),
        filter((token) => !!token),
        first(),
        switchMap((token) => {
          this.token = token;
          return this.auth.verifyPasswordResetRequest$({ token });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (resp) => {
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
        password: ['', [Validators.required, this.validation.validatePassword]],
        passwordConfirmation: ['', [Validators.required]],
        resetOtherSessions: [false, [Validators.required]],
      },
      { validators: this.validation.matchingPasswords }
    );
  }

  submit() {
    this.auth
      .passwordResetPerform$({
        token: this.token,
        password: this.form.value?.password,
        resetOtherSessions: this.form.value?.resetOtherSessions,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (status) => {
          if (status.ok) {
            this.status = { ...status, message: _('INFO.PASSWORD.RENEW_SUCCESS') };
            this.form.disable();
          } else {
            this.status = {
              ...status,
              message: status.message || _('INFO.PASSWORD.PASSWORD_RENEW'),
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
