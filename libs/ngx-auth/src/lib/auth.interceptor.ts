import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { HttpStatusCode, JWT_BEARER_REALM } from '@fullerstack/agx-dto';
import { Observable, of, throwError } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { AuthEffectsService } from './store/auth-state.effect';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  private auth: AuthService;
  private effects: AuthEffectsService;

  constructor(private injector: Injector) {
    setTimeout(() => {
      this.auth = this.injector.get(AuthService);
      this.effects = this.injector.get(AuthEffectsService);
    });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // include cookie in all request
    request = this.insertToken(request, this.auth?.state.token);

    return next.handle(request).pipe(
      catchError((error) => {
        if (error?.status === HttpStatusCode.UNAUTHORIZED) {
          return this.effects?.tokenRefreshRequest().pipe(
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
          );
        }

        return throwError(error);
      })
    );
  }

  private insertToken(request: HttpRequest<unknown>, token: string) {
    // include token only/if we have one
    if (token) {
      return request.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authorization: `${JWT_BEARER_REALM} ${this.auth.state.token}`,
        },
      });
    }
    return request;
  }
}
