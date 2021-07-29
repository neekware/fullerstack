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
import { GqlErrorsHandler, GqlOperationNameKey } from '@fullerstack/ngx-gql';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import {
  AuthLogoutOperation,
  AuthRefreshTokenOperation,
  AuthSignupOperation,
} from './auth.default';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private auth: AuthService;

  constructor(readonly injector: Injector) {
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
        if (errors instanceof GqlErrorsHandler) {
          if (errors.find(HttpStatusCode.UNAUTHORIZED)) {
            const operationName = tryGet(() => request?.body[GqlOperationNameKey]);
            switch (operationName) {
              case AuthRefreshTokenOperation:
                this.auth.logoutRequest();
                return of(null);
              case AuthLogoutOperation:
                return of(null);
              case AuthSignupOperation:
                return throwError(() => errors);
            }
            return this.retryOperationPostRefreshToken(request, next);
          }
        }
        return throwError(() => errors);
      })
    );
  }

  private retryOperationPostRefreshToken(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.auth.tokenRefreshRequest$().pipe(
      map((authState) => {
        if (authState?.logoutRequired) {
          this.auth.logoutRequest();
        }
        return authState;
      }),
      switchMap((authState) => {
        request = this.insertToken(request, authState.token);
        return next.handle(request).pipe(
          catchError((errors) => {
            if (errors instanceof GqlErrorsHandler) {
              if (errors.find(HttpStatusCode.UNAUTHORIZED)) {
                this.auth.logoutRequest();
                return of(null);
              }
            }
            return throwError(() => errors);
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
