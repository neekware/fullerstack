import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { HealthCheck } from '@fullerstack/api-dto';
import { ConfigService } from '@fullerstack/ngx-config';
import { LoggerService } from '@fullerstack/ngx-logger';

@Component({
  selector: 'fullerstack-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  healthCheck$: Observable<HealthCheck>;

  constructor(
    private http: HttpClient,
    public configService: ConfigService,
    public loggerService: LoggerService
  ) {
    if (!this.configService.options.production) {
      /* istanbul ignore next */
      this.loggerService.info('AppComponent starting ... ');
    }
  }

  ngOnInit(): void {
    this.healthCheck$ = this.http.get<HealthCheck>('/api/ping');
  }
}
