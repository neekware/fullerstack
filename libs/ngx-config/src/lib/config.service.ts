import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { merge as ldNestedMerge } from 'lodash-es';
import { of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { DeepReadonly } from 'ts-essentials';

import { DEFAULT_HTTP_TIMEOUT } from './config.constant';
import { CONFIG_TOKEN, DefaultApplicationConfig } from './config.default';
import { ApplicationConfig, HttpMethod, RemoteType } from './config.model';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;

  constructor(
    private http: HttpClient,
    @Inject(CONFIG_TOKEN) private readonly config: ApplicationConfig
  ) {
    this.options = { ...ldNestedMerge(this.options, config) };
    if (!this.options.production) {
      /* istanbul ignore next */
      console.log(`ConfigService ready ...`);
    }
  }

  /**
   * Fetches remote configuration options via get or post
   */
  fetchRemoteConfig(): RemoteType {
    const remoteConfig = this.options.remoteConfig;
    if (remoteConfig) {
      const url = remoteConfig.endpoint;
      if (url) {
        return new Promise((resolve) => {
          let headers = remoteConfig.headers || {};
          if (!Object.keys(headers).length) {
            headers = new HttpHeaders(headers);
          }
          const httpMethod = remoteConfig.method || HttpMethod.GET;
          let httpRequest = this.http.get(url, { headers });
          if (httpMethod === HttpMethod.POST) {
            const postBody = remoteConfig.body || {};
            httpRequest = this.http.post(url, postBody, { headers });
          }
          const httpTimeout =
            (remoteConfig.timeout || DEFAULT_HTTP_TIMEOUT) * 1000;
          httpRequest
            .pipe(
              timeout(httpTimeout),
              catchError((err: Response) => {
                console.warn(
                  `ConfigService failed. (${err.statusText || 'unknown'})`
                );
                return of({});
              })
            )
            .toPromise()
            .then((resp) => {
              if (Object.keys(resp || {}).length) {
                if (!this.options.production) {
                  /* istanbul ignore next */
                  console.log(`ConfigService remote config fetched ...`);
                }
                this.options = { ...this.options, remoteData: resp };
              }
              resolve(resp);
            });
        });
      }
    }
    return new Promise((resolve) => resolve({}));
  }
}
