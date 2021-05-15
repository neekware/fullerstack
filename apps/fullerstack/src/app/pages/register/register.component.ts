import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { tokenizeFullName, tryGet } from '@fullerstack/agx-util';
import { AuthService } from '@fullerstack/ngx-auth';
import { ConfigService } from '@fullerstack/ngx-config';
import { I18nService } from '@fullerstack/ngx-i18n';
import { LayoutService } from '@fullerstack/ngx-layout';
import { AsyncValidationService, ValidationService, getControl } from '@fullerstack/ngx-util';

@Component({
  selector: 'fullerstack-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  getControl = getControl;

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
      this.auth.goTo(redirectUrl);
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
          [Validators.required, Validators.minLength(this.validation.PASSWORD_MIN_LEN)],
        ],
        passwordConfirmation: ['', [Validators.required]],
      },
      {
        validator: this.validation.matchingPasswords('password', 'passwordConfirmation'),
      }
    );
  }

  register() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, password, ...rest } = this.form.value;
    const { firstName, lastName } = tokenizeFullName(this.form.value.name);
    const language = this.i18n.currentLanguage;
    this.auth.registerDispatch({
      firstName,
      lastName,
      email,
      password,
      language,
    });
  }
}
