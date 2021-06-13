import { HttpClient } from '@angular/common/http';
import { cloneDeep } from 'lodash-es';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GqlHttpOptions, GqlResponseBody, Variables } from './gql.model';
import { createGqlBody, createHeaders } from './gql.util';

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
      headers: createHeaders(options?.headers),
      responseType: options?.responseType ?? 'json',
      withCredentials: options?.withCredentials ?? true,
    };

    return this.http.post<T>(url || this.endpoint, body, newOptions);
    // .pipe(map((resp: GqlResponseBody) => resp.data as T));
  }
}
