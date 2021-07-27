/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiConstants } from '@fullerstack/agx-dto';
import { AuthService } from '@fullerstack/ngx-auth';
import { ConfigService } from '@fullerstack/ngx-config';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { LoggerService } from '@fullerstack/ngx-logger';
import { ConfirmationDialogService } from '@fullerstack/ngx-shared';
import { UserService, UserState } from '@fullerstack/ngx-user';
import { Observable, Subject, first, takeUntil } from 'rxjs';

@Component({
  selector: 'fullerstack-user-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss'],
  providers: [ConfirmationDialogService],
})
export class ProfileUpdateComponent implements OnDestroy, OnInit {
  private destroy$ = new Subject<boolean>();
  form: FormGroup;
  title = _('COMMON.PROFILE');
  subtitle = _('COMMON.PROFILE_UPDATE');
  icon = 'account-edit-outline';
  isLoading = false;
  status = { ok: true, message: '' };

  constructor(
    readonly formBuilder: FormBuilder,
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly auth: AuthService,
    readonly user: UserService,
    readonly confirm: ConfirmationDialogService
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.user.stateSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (state) => {
        this.updateForm(state);
      },
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [''],
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(ApiConstants.FIRST_NAME_MIN_LENGTH),
          Validators.maxLength(ApiConstants.FIRST_NAME_MAX_LENGTH),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(ApiConstants.LAST_NAME_MIN_LENGTH),
          Validators.maxLength(ApiConstants.LAST_NAME_MAX_LENGTH),
        ],
      ],
    });
  }

  private updateForm(state: UserState) {
    const { id, firstName, lastName } = state;
    this.form.patchValue({ id, firstName, lastName });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.form?.disabled && this.form?.dirty && this.auth.state.isLoggedIn) {
      const title = _('COMMON.LEAVE_PAGE');
      const info = _('WARN.DISCARD_CHANGES_ACTION');
      return this.confirm.confirmation(title, info);
    }
    return true;
  }

  submit() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, firstName, lastName } = this.form.value;
    this.user
      .userSelfUpdateMutate$({ id, firstName, lastName })
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.status = { ok: true, message: _('SUCCESS.USER.UPDATE') };
          this.form.disable();
        },
        error: (error) => {
          this.status = {
            ok: false,
            message: error.message || _('ERROR.USER.UPDATE'),
          };
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}