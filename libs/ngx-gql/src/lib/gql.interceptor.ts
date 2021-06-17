import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { gqlErrorsConverter } from './gql.error';

@Injectable({ providedIn: 'root' })
export class GqlInterceptor implements HttpInterceptor {
  /**
   *
   * @param request outgoing request object
   * @param next next interceptor to call
   * @returns observable of http event type
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    /**
     * Graphql Errors are wrapped in a 200 http status code.
     * This interceptor will pull the errors out, and re-raise them as http error
     * Other interceptors then can handle them as regular http errors
     */
    return next.handle(request).pipe(gqlErrorsConverter());
  }
}
