import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { JWT_BEARER_REALM } from '@fullerstack/agx-dto';
import { tryGet } from '@fullerstack/agx-util';
import { GqlService } from '@fullerstack/ngx-gql';
import { Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'zen-observable';

import { AuthService } from './auth.service';
import { AuthEffectsService } from './store/auth-state.effect';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  private gql: GqlService;
  private auth: AuthService;
  private effects: AuthEffectsService;

  constructor(private injector: Injector) {
    setTimeout(() => {
      this.gql = this.injector.get(GqlService);
      this.auth = this.injector.get(AuthService);
      this.effects = this.injector.get(AuthEffectsService);
    });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.auth) {
      return next.handle(request);
    }

    if (this.auth.state.token) {
      request = this.insertToken(request, this.auth.state.token);
    }

    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          if (request.url.includes(`${this.gql?.options?.gql?.endpoint}`)) {
            const httpResp = tryGet(() => event?.body?.errors[0].extensions.exception.response);
            if (httpResp?.statusCode === HttpStatusCode.Unauthorized) {
              const gqlError = new Error('Unauthorized access');
              gqlError['status'] = HttpStatusCode.Unauthorized;
              gqlError['body'] = event.body;
              throw gqlError;
            }
          }
        }
        return event;
      }),
      catchError((error, caught$) => {
        if (request.url.includes(`${this.gql?.options?.gql?.endpoint}`)) {
          error = tryGet(() => error?.body?.errors[0].extensions.exception.response);
        }
        if (
          error?.status === HttpStatusCode.Unauthorized ||
          error?.statusCode === HttpStatusCode.Unauthorized
        ) {
          return this.effects.tokenRefreshRequest().pipe(
            tap((sdf) => console.log(sdf)),
            switchMap((token) => {
              if (token) {
                request = this.insertToken(request, token as string);
                return next.handle(request).pipe(tap((resp) => console.log(resp)));
              }
              return caught$;
            })
          );
        }
        return caught$;
      })
    );
  }

  insertToken(request: HttpRequest<unknown>, token: string) {
    return request.clone({
      setHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        Authorization: `${JWT_BEARER_REALM} ${token}`,
      },
    });
  }
}
