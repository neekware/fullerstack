import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { HealthCheck } from '@fullerstack/api-dto';
import { ConfigService } from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';
import { I18nService } from '@fullerstack/ngx-i18n';
import { UixService } from '@fullerstack/ngx-uix';
import { AuthService } from '@fullerstack/ngx-auth';

@Component({
  selector: 'fullerstack-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  healthCheck$: Observable<HealthCheck>;

  constructor(
    readonly http: HttpClient,
    readonly configService: ConfigService,
    readonly loggerService: LoggerService,
    readonly i18n: I18nService,
    readonly uix: UixService,
    readonly auth: AuthService
  ) {
    if (!this.configService.options.production) {
      /* istanbul ignore next */
      this.loggerService.info('AppComponent starting ... ');
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
