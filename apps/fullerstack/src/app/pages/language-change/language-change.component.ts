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
import { I18nService, i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import {
  ConfirmationDialogService,
  ProgressService,
  ValidationService,
} from '@fullerstack/ngx-shared';
import { UserService } from '@fullerstack/ngx-user';

import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'fullerstack-language-change',
  templateUrl: './language-change.component.html',
  styleUrls: ['./language-change.component.scss'],
  providers: [ConfirmationDialogService],
})
export class LanguageChangeComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private destroy$ = new Subject<boolean>();
  title = _('COMMON.SETTINGS');
  subtitle = _('COMMON.LANGUAGE_CHANGE');
  icon = 'translate';
  status = { ok: true, message: '' };

  constructor(
    readonly formBuilder: FormBuilder,
    readonly i18n: I18nService,
    readonly validation: ValidationService,
    readonly auth: AuthService,
    readonly user: UserService,
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

    this.user.stateSub$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (state) => {
        if (!state.language) {
          this.patchForm(state.language);
        }
      },
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [''],
      language: [this.i18n.defaultLanguage, [Validators.required]],
    });
  }

  private patchForm(language: string) {
    language = this.i18n.enabledLanguages.includes(language) ? language : this.i18n.defaultLanguage;
    if (this.form?.controls.language.value !== language) {
      this.form.patchValue({ id: this.user.state.id, language });
    }

    if (this.externallyChanged()) {
      this.form.markAsDirty();
    } else {
      this.form.markAsPristine();
    }
  }

  private externallyChanged(): boolean {
    return this.form?.controls.language.value !== this.user?.state.language;
  }

  locallySelected() {
    this.i18n.setCurrentLanguage(this.form?.controls.language.value);
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
