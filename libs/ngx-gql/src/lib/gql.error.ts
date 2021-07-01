/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpResponse } from '@angular/common/http';
import { ApiError, ThrottlerException } from '@fullerstack/agx-dto';
import { Observable, of, throwError } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { GraphQLResponseError } from './gql.model';

/**
 * Intercepts incoming responses and throws gql error to be handled by catchError
 * @returns Observable<any>
 */
export const gqlErrorsInterceptor = () => (source: Observable<any>) =>
  source.pipe(
    concatMap((event) => {
      if (event instanceof HttpResponse && event?.type) {
        if (event?.body?.errors?.length) {
          return throwError(() => event.body.errors);
        }
      }
      return of(event);
    })
  );

export class GqlErrorsHandler {
  original: any;
  parsed: GraphQLResponseError[] = [];

  constructor(errors: any) {
    this.original = errors;
    this.parsed = this.parseGqlErrors(errors);
  }

  find(error: string | number): GraphQLResponseError {
    if (typeof error === 'string') {
      return this.parsed.find((err) => err.error === error);
    } else if (typeof error === 'number') {
      return this.parsed.find((err) => err.statusCode === error);
    }
    throw new Error('Invalid argument to find');
  }

  throttleError(): boolean {
    return (
      !!this.find(ApiError.Error.Server.Error_TooManyRequests) || !!this.find(ThrottlerException)
    );
  }

  parseGqlErrors(errors: any[]): Array<any> {
    const parsed = (errors || [])
      .map((item) => {
        const response = item?.extensions?.exception?.response;
        if (response) {
          if (typeof response === 'string') {
            return {
              operationName: item?.path[0],
              error: item.error || item.message,
              statusCode: item?.extensions?.exception?.status,
            };
          }
          return {
            operationName: item?.path[0],
            error: response.message || item.message || item.error,
            statusCode: response.statusCode,
          };
        }
        return null;
      })
      .filter((item) => !!item);
    return parsed;
  }
}

export const handleGqlErrors = (errors: any) => throwError(() => new GqlErrorsHandler(errors));
