import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { HealthCheck } from '@fullerstack/api-dto';
import { CfgService } from '@fullerstack/ngx-cfg';
import { map } from 'rxjs/operators';

@Component({
  selector: 'fullerstack-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  healthCheck$: Observable<HealthCheck>;

  constructor(private http: HttpClient, public cfgService: CfgService) {
    this.healthCheck$ = this.http.get<HealthCheck>('/api/ping');
  }

  ngOnInit(): void {
    this.healthCheck$.pipe(
      map((msg) => {
        if (msg.ping) {
          return 'Server is online';
        } else {
          return 'Server is offline';
        }
      })
    );
  }
}
