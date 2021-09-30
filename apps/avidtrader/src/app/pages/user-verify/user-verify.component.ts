/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@fullerstack/ngx-auth';
import { I18nService } from '@fullerstack/ngx-i18n';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { ProgressService } from '@fullerstack/ngx-shared';
import { Subject } from 'rxjs';
import { filter, first, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'fullerstack-user-verify',
  templateUrl: './user-verify.component.html',
})
export class UserVerifyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  title = _('COMMON.VERIFICATION');
  subtitle = _('COMMON.ACCOUNT.VERIFY');
  status: string = _('SUCCESS.USER.VERIFY');
  icon = 'account-check-outline';
  isUserVerified = false;

  constructor(
    readonly route: ActivatedRoute,
    readonly i18n: I18nService,
    readonly auth: AuthService,
    readonly progress: ProgressService
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        filter((params) => !!params.get('token')),
        first(),
        switchMap((params) => {
          return this.auth.verifyUserRequest$({
            token: params.get('token'),
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (resp) => {
          if (resp.ok) {
            this.isUserVerified = true;
            if (this.auth.state.isLoggedIn) {
              this.auth.tokenRefreshRequest$().pipe(first(), takeUntil(this.destroy$)).subscribe();
            }
          } else {
            // handle known errors
            this.icon = 'account-alert-outline';
            this.status = resp.message || _('WARN.USER.VERIFICATION_FAILURE');
          }
        },
        error: (err) => {
          // handler server errors
          this.icon = 'account-alert-outline';
          this.status = err.error?.message || _('WARN.USER.VERIFICATION_FAILURE');
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
