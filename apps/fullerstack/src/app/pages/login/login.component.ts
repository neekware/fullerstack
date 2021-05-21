import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tryGet } from '@fullerstack/agx-util';
import { AuthService } from '@fullerstack/ngx-auth';
import { ConfigService } from '@fullerstack/ngx-config';
import { _ } from '@fullerstack/ngx-i18n';
import { LayoutService } from '@fullerstack/ngx-layout';
import { ValidationService } from '@fullerstack/ngx-util';

@Component({
  selector: 'fullerstack-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  title = _('COMMON.LOGIN');
  subtitle = _('COMMON.ACCOUNT_ACCESS');
  icon = 'lock-open-outline';

  constructor(
    readonly formBuilder: FormBuilder,
    readonly config: ConfigService,
    readonly auth: AuthService,
    readonly layout: LayoutService,
    readonly validation: ValidationService
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
    this.form.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, this.validation.validateEmail]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    this.auth.loginDispatch(this.form.value);
  }

  submit() {
    this.auth.loginDispatch(this.form.value);
  }
}
