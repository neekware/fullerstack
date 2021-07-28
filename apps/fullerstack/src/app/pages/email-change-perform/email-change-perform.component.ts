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
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { ProgressService, ValidationService } from '@fullerstack/ngx-shared';
import { UserService } from '@fullerstack/ngx-user';
import { Subject, filter, first, map, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'fullerstack-email-change-perform',
  templateUrl: './email-change-perform.component.html',
  styleUrls: ['./email-change-perform.component.scss'],
})
export class EmailChangePerformComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  title = _('COMMON.EMAIL');
  subtitle = _('COMMON.ACCOUNT.EMAIL_CHANGE');
  icon = 'email';
  status = { ok: true, message: '' };

  constructor(
    readonly route: ActivatedRoute,
    readonly validation: ValidationService,
    readonly auth: AuthService,
    readonly user: UserService,
    readonly progress: ProgressService
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        map((params) => params.get('token')),
        filter((token) => !!token),
        first(),
        switchMap((token) => this.auth.emailChangePerform$({ token })),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (resp) => {
          if (resp.ok) {
            this.icon = 'email-check';
            this.status = {
              ok: true,
              message: resp.message || _('INFO.EMAIL.CHANGE_SUCCESS'),
            };
          } else {
            // handle known errors
            this.icon = 'email-remove';
            this.status = {
              ok: false,
              message: resp.message || _('ERROR.AUTH.EMAIL_CHANGE_INVALID_LINK'),
            };
          }
        },
        error: (err) => {
          // handler server errors
          this.icon = 'email-remove';
          this.status = {
            ok: false,
            message: err.error?.message || _('ERROR.AUTH.EMAIL_CHANGE_INVALID_LINK'),
          };
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
