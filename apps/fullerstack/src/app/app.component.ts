import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { HealthCheck } from '@fullerstack/api-dto';
import { CfgService } from '@fullerstack/ngx-cfg';
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
    public cfgService: CfgService,
    public loggerService: LoggerService
  ) {
    if (!this.cfgService.options.production) {
      /* istanbul ignore next */
      this.loggerService.info('AppComponent starting ... ');
    }
  }

  ngOnInit(): void {
    this.healthCheck$ = this.http.get<HealthCheck>('/api/ping');
  }
}
