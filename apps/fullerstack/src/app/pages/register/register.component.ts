import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { get, pick } from 'lodash';

import { LayoutService } from '@fullerstack/ngx-layout';
import { ConfigService } from '@fullerstack/ngx-config';
import { AuthService } from '@fullerstack/ngx-auth';
import {
  ValidationService,
  AsyncValidationService,
} from '@fullerstack/ngx-util';
import { tokenizeFullName, tryGet } from '@fullerstack/agx-util';
import { AuthRegisterCredentials } from '@fullerstack/ngx-auth';
import { I18nService } from '@fullerstack/ngx-i18n';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  constructor(
    public config: ConfigService,
    public auth: AuthService,
    public i18n: I18nService,
    public layout: LayoutService,
    public ngFormBuilder: FormBuilder,
    public validation: ValidationService,
    public asyncValidation: AsyncValidationService
  ) {
    if (this.auth.state.isLoggedIn) {
      const redirectUrl = tryGet(
        () => this.config.options.localConfig.registerInLandingPageUrl,
        '/'
      );
      this.layout.goTo(redirectUrl);
    } else {
      this.auth.initiateRegisterState();
    }
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.ngFormBuilder.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(this.validation.NAME_MIN_LEN),
            this.validation.validateFullName,
          ],
        ],
        email: [
          '',
          [Validators.required, this.validation.validateEmail],
          [this.asyncValidation.validateEmailAvailability()],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(this.validation.PASSWORD_MIN_LEN),
          ],
        ],
        passwordConfirmation: ['', [Validators.required]],
      },
      {
        validator: this.validation.matchingPasswords(
          'password',
          'passwordConfirmation'
        ),
      }
    );
  }

  register() {
    const registerData: AuthRegisterCredentials = {
      ...tokenizeFullName(this.form.value.name),
      ...pick(this.form.value, ['email', 'password']),
      ...{ language: this.i18n.currentLanguage },
    };
    this.auth.registerDispatch(registerData);
  }

  getControl(name: string): FormControl {
    return tryGet<FormControl>(() => this.form.controls[name] as FormControl);
  }
}
