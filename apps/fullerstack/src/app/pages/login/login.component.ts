/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '@fullerstack/ngx-auth';
import { ConfigService } from '@fullerstack/ngx-config';
import { UserCredentialsInput } from '@fullerstack/ngx-gql/schema';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';

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
      this.auth.goTo(this.auth.authUrls.landingUrl);
    }
  }

  login(data: UserCredentialsInput) {
    this.auth.loginRequest$(data).subscribe();
  }
}
