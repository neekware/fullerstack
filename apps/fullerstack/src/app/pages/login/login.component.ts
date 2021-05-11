import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { tryGet } from '@fullerstack/agx-util';
import { AuthService } from '@fullerstack/ngx-auth';
import { ConfigService } from '@fullerstack/ngx-config';
import { _ } from '@fullerstack/ngx-i18n';
import { LayoutService } from '@fullerstack/ngx-layout';
import { ValidationService } from '@fullerstack/ngx-util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  title = _('COMMON.LOGIN');
  subtitle = _('COMMON.ACCOUNT_ACCESS');
  icon = 'lock-open-outline';

  constructor(
    public config: ConfigService,
    public auth: AuthService,
    public layout: LayoutService,
    public formBuilder: FormBuilder,
    public validation: ValidationService
  ) {
    this.auth.msg.reset();
    if (this.auth.state.isLoggedIn) {
      const redirectUrl = tryGet(() => this.config.options.localConfig.loggedInLandingPageUrl, '/');
      this.auth.goTo(redirectUrl);
    } else {
      this.auth.initiateLoginState();
    }
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  login() {
    this.auth.loginDispatch(this.form.value);
  }

  getControl(name: string): FormControl {
    return tryGet<FormControl>(() => this.form.controls[name] as FormControl);
  }

  submit() {
    this.auth.loginDispatch(this.form.value);
  }
}
