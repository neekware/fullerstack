/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { tryGet } from '@fullerstack/agx-util';
import { AuthService } from '@fullerstack/ngx-auth';
import { ConfigService } from '@fullerstack/ngx-config';
import { AuthUserSignupInput } from '@fullerstack/ngx-gql/schema';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'fullerstack-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  title = _('COMMON.SIGNUP');
  subtitle = _('COMMON.ACCOUNT_CREATE');
  icon = 'account-plus-outline';

  constructor(public config: ConfigService, public auth: AuthService) {}

  ngOnInit() {
    if (this.auth.state.isLoggedIn) {
      const redirectUrl = tryGet(() => this.config.options.localConfig.signupLandingPageUrl, '/');
      this.auth.goTo(redirectUrl);
    }
  }

  submit(data: AuthUserSignupInput) {
    this.auth.signupRequest$(data).pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
