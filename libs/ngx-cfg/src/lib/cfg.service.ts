import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { of } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { merge as ldNestedMerge } from 'lodash-es';

import { DEFAULT_HTTP_TIMEOUT } from './cfg.constants';
import { ApplicationCfg, HttpMethod, RemoteType } from './cfg.models';
import { CFG_TOKEN, DefaultApplicationCfg } from './cfg.defaults';

@Injectable({
  providedIn: 'root',
})
export class CfgService {
  private _options: Readonly<ApplicationCfg> = DefaultApplicationCfg;

  constructor(
    private http: HttpClient,
    @Inject(CFG_TOKEN) private readonly config: ApplicationCfg
  ) {
    this._options = ldNestedMerge(this._options, config);
    if (!this._options.production) {
      /* istanbul ignore next */
      console.log(`CfgService ready ...`);
    }
  }

  /**
   * Make the internal options publicly accessible.
   */
  get options(): Readonly<ApplicationCfg> {
    return this._options;
  }

  /**
   * Fetches remote configuration options via get or post
   */
  fetchRemoteCfg(): RemoteType {
    const remoteCfg = this._options.remoteCfg;
    if (remoteCfg) {
      const url = remoteCfg.endpoint;
      if (url) {
        return new Promise((resolve) => {
          let headers = remoteCfg.headers || {};
          if (!Object.keys(headers).length) {
            headers = new HttpHeaders(headers);
          }
          const httpMethod = remoteCfg.method || HttpMethod.GET;
          let httpRequest = this.http.get(url, { headers });
          if (httpMethod === HttpMethod.POST) {
            const postBody = remoteCfg.body || {};
            httpRequest = this.http.post(url, postBody, { headers });
          }
          const httpTimeout =
            (remoteCfg.timeout || DEFAULT_HTTP_TIMEOUT) * 1000;
          httpRequest
            .pipe(
              timeout(httpTimeout),
              catchError((err: Response) => {
                console.warn(
                  `CfgService failed. (${err.statusText || 'unknown'})`
                );
                return of({});
              })
            )
            .toPromise()
            .then((resp) => {
              if (Object.keys(resp || {}).length) {
                if (!this._options.production) {
                  /* istanbul ignore next */
                  console.log(`CfgService remote cfg fetched ...`);
                }
                this._options = { ...this._options, remoteData: resp };
              }
              resolve(resp);
            });
        });
      }
    }
    return new Promise((resolve) => resolve({}));
  }
}
