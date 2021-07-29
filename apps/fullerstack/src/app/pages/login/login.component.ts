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
import { Subject, distinctUntilChanged, first, takeUntil } from 'rxjs';

@Component({
  selector: 'fullerstack-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private destroy$ = new Subject<boolean>();
  title = _('COMMON.LOGIN');
  subtitle = _('COMMON.ACCOUNT_ACCESS');
  icon = 'lock-open-outline';

  constructor(
    readonly formBuilder: FormBuilder,
    readonly validation: ValidationService,
    readonly auth: AuthService,
    readonly progress: ProgressService
  ) {
    this.auth.msg.reset();
  }

  ngOnInit() {
    if (this.auth.state.isLoggedIn) {
      this.auth.goTo(this.auth.authUrls.landingUrl);
    } else {
      this.buildForm();
      this.form.valueChanges
        .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
        .subscribe(() => this.auth.msg.reset());
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, this.validation.validateEmail]],
      password: ['', [Validators.required]],
    });
  }

  submit() {
    const credentials = this.form.value;
    this.auth.loginRequest$(credentials).pipe(first(), takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
