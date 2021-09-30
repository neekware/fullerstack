/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HealthCheck } from '@fullerstack/agx-dto';
import { AuthService } from '@fullerstack/ngx-auth';
import { ConfigService } from '@fullerstack/ngx-config';
import { I18nService } from '@fullerstack/ngx-i18n';
import { LayoutService } from '@fullerstack/ngx-layout';
import { LoggerService } from '@fullerstack/ngx-logger';
import { StoreService } from '@fullerstack/ngx-store';
import { SystemService } from '@fullerstack/ngx-system';
import { UixService } from '@fullerstack/ngx-uix';
import { UserService } from '@fullerstack/ngx-user';
import { Observable } from 'rxjs';

@Component({
  selector: 'fullerstack-root',
  template: '<fullerstack-layout></fullerstack-layout>',
})
export class AppComponent implements OnInit {
  healthCheck$: Observable<HealthCheck>;

  constructor(
    readonly http: HttpClient,
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly store: StoreService,
    readonly auth: AuthService,
    readonly i18n: I18nService,
    readonly uix: UixService,
    readonly layout: LayoutService,
    readonly user: UserService,
    readonly system: SystemService
  ) {
    if (!this.config.options.production) {
      /* istanbul ignore next */
      this.logger.info('AppComponent starting ... ');
    }
  }

  ngOnInit(): void {
    this.healthCheck$ = this.http.get<HealthCheck>('/api/ping');
  }
}
