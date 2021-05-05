import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { HealthCheck } from '@fullerstack/api-dto';
import { ConfigService } from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';
import { I18nService } from '@fullerstack/ngx-i18n';
import { UixService } from '@fullerstack/ngx-uix';
import { AuthService } from '@fullerstack/ngx-auth';
import { LayoutService } from '@fullerstack/ngx-layout';

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
    readonly auth: AuthService,
    readonly i18n: I18nService,
    readonly uix: UixService,
    readonly layout: LayoutService
  ) {
    if (!this.config.options.production) {
      /* istanbul ignore next */
      this.logger.info('AppComponent starting ... ');
    }
  }

  ngOnInit(): void {
    this.healthCheck$ = this.http.get<HealthCheck>('/api/ping');
  }

  login() {
    this.auth.loginDispatch({
      email: 'admin@fullerstack.net',
      password: 'hello',
    });
  }

  logout() {
    this.auth.logoutDispatch();
  }
}
