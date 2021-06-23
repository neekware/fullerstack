/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { HttpStatusCode, JWT_BEARER_REALM } from '@fullerstack/agx-dto';
import { tryGet } from '@fullerstack/agx-util';
import { GqlErrorsHandler } from '@fullerstack/ngx-gql';
import { AuthTokenStatus } from '@fullerstack/ngx-gql/schema';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import {
  AuthLogoutOperation,
  AuthRefreshTokenOperation,
  AuthResponseOperationName,
} from './auth.default';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  private auth: AuthService;

  constructor(private injector: Injector) {
    /**
     * This interceptor will initialize before the the auth module
     * So, we inject it manually, with a bit of delay to prevent circular injection deps
     */
    setTimeout(() => {
      this.auth = this.injector.get(AuthService);
    });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Auth module is not ready yet, so pass the request through
    if (!this.auth) {
      return next.handle(request);
    }

    request = this.insertToken(request, this.auth?.state.token);

    return next.handle(request).pipe(
      catchError((errors) => {
        const gqlErrors = new GqlErrorsHandler(errors);
        if (gqlErrors.find(HttpStatusCode.UNAUTHORIZED)) {
          const operationName = tryGet(() => request?.body[AuthResponseOperationName]);
          switch (operationName) {
            case AuthRefreshTokenOperation:
              this.auth.logoutDispatch();
              return of(null);
            case AuthLogoutOperation:
              return of(null);
          }
          return this.retryOperationPostRefreshToken(request, next);
        }
        return throwError(() => gqlErrors);
      })
    );
  }

  private retryOperationPostRefreshToken(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.auth.refreshRequest().pipe(
      map((resp) => {
        if (!resp?.ok) {
          this.auth.logoutDispatch();
        }
        return resp;
      }),
      switchMap((resp: AuthTokenStatus) => {
        request = this.insertToken(request, resp.token);
        return next.handle(request).pipe(
          catchError((errors) => {
            const gqlErrors = new GqlErrorsHandler(errors);
            if (gqlErrors.find(HttpStatusCode.UNAUTHORIZED)) {
              this.auth.logoutDispatch();
              return of(null);
            }
            return throwError(() => gqlErrors);
          })
        );
      })
    ) as Observable<HttpEvent<unknown>>;
  }

  private insertToken(request: HttpRequest<unknown>, token: string) {
    if (!token) {
      return request;
    }
    return request.clone({ setHeaders: { Authorization: `${JWT_BEARER_REALM} ${token}` } });
  }
}
