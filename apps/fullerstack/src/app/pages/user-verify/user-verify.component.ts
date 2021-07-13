/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '@fullerstack/ngx-auth';
import { GqlService } from '@fullerstack/ngx-gql';
import { I18nService } from '@fullerstack/ngx-i18n';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { LoggerService } from '@fullerstack/ngx-logger';
import { UserService } from '@fullerstack/ngx-user';
import { Subject } from 'rxjs';
import { filter, first, map, switchMap, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'fullerstack-user-verify',
  templateUrl: './user-verify.component.html',
})
export class UserVerifyComponent implements OnInit, OnDestroy {
  form: FormGroup;
  title = _('COMMON.VERIFICATION');
  subtitle = _('COMMON.ACCOUNT.VERIFY');
  icon = 'lock-open-outline';
  isVerifyLinkValid = false;
  isLoading = false;
  private destroy$ = new Subject<boolean>();

  constructor(public route: ActivatedRoute, public i18n: I18nService, public auth: AuthService) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        filter((params) => !!(params.get('token') && params.get('idb64'))),
        first(),
        switchMap((params) => {
          this.isLoading = true;
          return this.auth.verifyUserRequest$({
            token: params.get('token'),
            idb64: params.get('idb64'),
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (resp) => {
          this.isLoading = false;
          // this.isVerifyLinkValid = isValid;
          if (resp.ok) {
            if (this.auth.state.isLoggedIn) {
              this.auth.tokenRefreshRequest$().pipe(first(), takeUntil(this.destroy$)).subscribe();
            }
          } else {
            // handle known errors
          }
        },
        error: (err) => {
          // handler server errors
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
