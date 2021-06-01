import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { tryGet } from '@fullerstack/agx-util';
import { AuthLoginCredentials, AuthService } from '@fullerstack/ngx-auth';
import { ConfigService } from '@fullerstack/ngx-config';
import { _ } from '@fullerstack/ngx-i18n';

@Component({
  selector: 'fullerstack-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  title = _('COMMON.LOGIN');
  subtitle = _('COMMON.ACCOUNT_ACCESS');
  icon = 'lock-open-outline';

  constructor(readonly config: ConfigService, readonly auth: AuthService) {
    this.auth.msg.reset();
  }

  ngOnInit() {
    if (this.auth.state.isLoggedIn) {
      const redirectUrl = tryGet(() => this.config.options.localConfig.loggedInLandingPageUrl, '/');
      this.auth.goTo(redirectUrl);
    } else {
      this.auth.initiateLoginState();
    }
  }

  login(data: AuthLoginCredentials) {
    this.auth.loginDispatch(data);
  }
}
