import { HttpClient } from '@angular/common/http';
import { tryGet } from '@fullerstack/agx-util';
import { cloneDeep } from 'lodash-es';
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
      ...cloneDeep(options),
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
