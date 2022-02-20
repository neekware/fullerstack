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
import { SystemStatus } from '@fullerstack/ngx-gql/schema';
import { I18nService, i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import {
  ConfirmationDialogService,
  ProgressService,
  ValidationService,
} from '@fullerstack/ngx-shared';
import { SystemService } from '@fullerstack/ngx-system';
import { UserService, UserState } from '@fullerstack/ngx-user';
import { Observable, Subject, distinctUntilChanged, filter, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'fullerstack-contact',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
  providers: [ConfirmationDialogService],
})
export class ContactUsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  form: FormGroup;
  title = _('COMMON.CONTACT');
  subtitle = _('COMMON.CONTACT_US');
  icon = 'send';
  isSubmitted = false;
  status: SystemStatus;

  constructor(
    readonly formBuilder: FormBuilder,
    readonly validation: ValidationService,
    readonly i18n: I18nService,
    readonly auth: AuthService,
    readonly user: UserService,
    readonly system: SystemService,
    readonly progress: ProgressService,
    readonly confirm: ConfirmationDialogService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.form.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(() => {
      this.isSubmitted = false;
      this.auth.msg.reset();
    });

    this.user.stateSub$
      .pipe(
        filter((user) => !!user?.id),
        takeUntil(this.destroy$)
      )
      .subscribe((user) => {
        this.updateForm(user);
      });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(ApiConstants.NAME_MIN_LENGTH)]],
      email: ['', [Validators.required, this.validation.validateEmail]],
      subject: [
        '',
        [Validators.required, Validators.minLength(ApiConstants.EMAIL_SUBJECT_MIN_LENGTH)],
      ],
      body: ['', [Validators.required, Validators.minLength(ApiConstants.EMAIL_BODY_MIN_LENGTH)]],
    });
  }

  private updateForm(user: UserState) {
    if (user) {
      this.form.patchValue({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      });
    }
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
    this.system
      .systemContactUsMutate$(this.form.value)
      .pipe(
        tap((status) => (this.status = { ...status })),
        takeUntil(this.destroy$)
      )
      .subscribe({
        complete: () => {
          this.isSubmitted = true;
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
