/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpResponse } from '@angular/common/http';
import { ApiError } from '@fullerstack/agx-dto';
import { Observable, of, throwError } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { GqlResponse, GraphQLResponseError } from './gql.model';

/**
 * Intercepts incoming responses and throws gql error to be handled by catchError
 * @returns Observable<any>
 */
export const gqlErrorsInterceptor = () => (source: Observable<any>) =>
  source.pipe(
    concatMap((event) => {
      if (event instanceof HttpResponse && event?.type) {
        if (event?.body?.errors?.length) {
          return throwError(() => event);
        }
      }
      return of(event);
    })
  );

export class GqlErrorsHandler {
  original: any;
  parsed: GraphQLResponseError[] = [];

  constructor(event: any) {
    this.original = event;
    this.parsed = this.parseGqlErrors(event);
  }

  find(error: string | number): GraphQLResponseError {
    if (typeof error === 'string') {
      return this.parsed.find((err) => err.message === error);
    } else if (typeof error === 'number') {
      return this.parsed.find((err) => err.statusCode === error);
    }
    throw new Error('Invalid argument to find');
  }

  get topError(): GraphQLResponseError | null {
    return this.parsed?.length ? this.parsed[0] : null;
  }

  throttleError(): boolean {
    return (
      !!this.find(ApiError.Error.Server.Error_TooManyRequests) ||
      !!this.find(ApiError.Error.Server.Error_TooManyRequestsNestJs)
    );
  }

  parseGqlErrors(event: any): GraphQLResponseError[] {
    let parsed: GraphQLResponseError[] = [];
    if (event.ok) {
      parsed = (event?.body?.errors || [])
        .map((item: GqlResponse) => {
          const response = item?.extensions?.exception?.response;
          if (response) {
            if (typeof response === 'string') {
              return {
                operationName: item?.path[0],
                message: item.error || item.message,
                statusCode: item?.extensions?.exception?.status,
              };
            }
            return {
              operationName: item?.path[0],
              message: response.message || item.message || item.error,
              statusCode: response.statusCode,
            };
          }
          return null;
        })
        .filter((item) => !!item);
    } else {
      parsed = (event?.error?.errors || [])
        .map((item: GqlResponse) => {
          const code = item?.extensions?.code;
          if (code) {
            return {
              message: code,
              statusCode: event.status,
            };
          }
          return null;
        })
        .filter((item) => !!item);
    }

    return parsed;
  }
}

export const handleGqlErrors = (errors: any) => throwError(() => new GqlErrorsHandler(errors));
