/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@fullerstack/ngx-auth';
import { ConfigService } from '@fullerstack/ngx-config';
import { ChangePasswordRequestInput } from '@fullerstack/ngx-gql/schema';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'fullerstack-password-reset-request',
  templateUrl: './password-reset-request.component.html',
  styleUrls: ['./password-reset-request.component.scss'],
})
export class PasswordResetRequestComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  title = _('COMMON.PASSWORD');
  subtitle = _('COMMON.PASSWORD.RESET_REQUEST');
  icon = 'lock-open-outline';

  constructor(readonly config: ConfigService, readonly auth: AuthService) {}

  ngOnInit() {
    if (this.auth.state.isLoggedIn) {
      this.auth.goTo(this.auth.authUrls.landingUrl);
    }
  }

  passwordResetRequest(data: ChangePasswordRequestInput) {
    this.auth.passwordResetRequest$(data).pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
