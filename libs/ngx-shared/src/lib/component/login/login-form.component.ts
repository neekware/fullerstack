/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@fullerstack/ngx-auth';
import { UserCredentialsInput } from '@fullerstack/ngx-gql/schema';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { ValidationService } from '@fullerstack/ngx-util';
import { Subject } from 'rxjs';

@Component({
  selector: 'fullerstack-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private destroy$ = new Subject<boolean>();
  @Output() submit$ = new EventEmitter<UserCredentialsInput>();
  @Input() title = _('COMMON.LOGIN');
  @Input() subtitle = _('COMMON.ACCOUNT_ACCESS');
  @Input() icon = 'lock-open-outline';
  @Input() autocomplete = 'off';
  @Input() emailHint: string;
  @Input() passwordHint: string;
  formTouched = false;
  onFormTouched = () => (this.formTouched = true);

  constructor(
    readonly formBuilder: FormBuilder,
    readonly validation: ValidationService,
    readonly auth: AuthService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, this.validation.validateEmail]],
      password: ['', [Validators.required]],
    });
  }

  submit() {
    this.formTouched = false;
    this.submit$.emit(this.form.value);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
