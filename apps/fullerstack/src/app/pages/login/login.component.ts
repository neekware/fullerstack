import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

// import { ValidationService } from '@fullerstack/shared/services';
import { tryGet } from '@fullerstack/agx-util';
import { AuthService } from '@fullerstack/ngx-auth';
import { ConfigService } from '@fullerstack/ngx-config';
import { LayoutService } from '@fullerstack/ngx-layout';

@Component({
  selector: 'fullerstack-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    public config: ConfigService,
    public auth: AuthService,
    public layout: LayoutService,
    public ngFormBuilder: FormBuilder // public validation: ValidationService
  ) {
    if (this.auth.state.isLoggedIn) {
      const redirectUrl = tryGet(
        () => this.config.options.localConfig.loggedInLandingPageUrl,
        '/'
      );
      this.layout.goTo(redirectUrl);
    } else {
      this.auth.initiateLoginState();
    }
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.ngFormBuilder.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  login() {
    this.auth.loginDispatch(this.form.value);
  }
}
