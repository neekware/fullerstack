import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { HttpStatusCode, JWT_BEARER_REALM } from '@fullerstack/agx-dto';
import { Observable, throwError } from 'rxjs';
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
          return this.auth.refreshRequest().pipe(
            map((token) => {
              if (!token) {
                this.auth.logoutDispatch();
                return throwError(error);
              }
              return token;
            }),
            switchMap((token: string) => {
              request = this.insertToken(request, token);
              return next.handle(request);
            })
          ) as Observable<HttpEvent<unknown>>;
        }

        return throwError(error);
      })
    );
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
