import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { HttpStatusCode, JWT_BEARER_REALM } from '@fullerstack/agx-dto';
import { tryGet } from '@fullerstack/agx-util';
import { AuthTokenStatus } from '@fullerstack/ngx-gql/schema';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  private auth: AuthService;

  constructor(private injector: Injector) {
    setTimeout(() => {
      this.auth = this.injector.get(AuthService);
    });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.auth) {
      return next.handle(request);
    }

    request = this.insertToken(request, this.auth?.state.token);

    return next.handle(request).pipe(
      catchError((error) => {
        if (error?.status === HttpStatusCode.UNAUTHORIZED) {
          const operationName = tryGet(() => request?.body['operationName']);
          if (operationName === 'authRefreshToken') {
            this.auth.logoutDispatch();
          } else if (operationName === 'authLogout') {
            return of(null);
          }

          return this.retryOperationPostRefreshToken(request, next, error);
        }

        return throwError(error);
      })
    );
  }

  private retryOperationPostRefreshToken(
    request: HttpRequest<unknown>,
    next: HttpHandler,
    error: any
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
        return next.handle(request);
      })
    ) as Observable<HttpEvent<unknown>>;
  }

  private insertToken(request: HttpRequest<unknown>, token: string) {
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `${JWT_BEARER_REALM} ${token}`,
        },
      });
    }
    return request;
  }
}
