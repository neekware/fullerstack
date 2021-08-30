/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { tryGet } from '@fullerstack/agx-util';
import { cloneDeep as ldDeepClone } from 'lodash-es';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GqlHttpOptions, GqlResponseBody, Variables } from './gql.model';
import { createGqlBody, createGqlHeaders } from './gql.util';

export class GraphQLClient {
  constructor(readonly http: HttpClient, readonly endpoint: string) {}

  request<T = any>(
    query: any,
    variables?: Variables,
    options?: GqlHttpOptions,
    url?: string
  ): Observable<T> {
    const body = createGqlBody(query, variables || {});
    const newOptions = {
      ...ldDeepClone(options),
      headers: createGqlHeaders(options?.headers),
      responseType: options?.responseType ?? 'json',
      withCredentials: options?.withCredentials ?? true,
    };

    return this.http.post(url || this.endpoint, body, newOptions).pipe(
      map((resp: GqlResponseBody) => {
        return tryGet(() => resp.data[body.operationName] as T);
      })
    ) as Observable<T>;
  }
}
