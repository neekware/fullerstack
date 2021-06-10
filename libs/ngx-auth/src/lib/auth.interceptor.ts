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
    if (this.auth && this.auth.state.token) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authorization: `${JWT_BEARER_REALM} ${this.auth.state.token}`,
        },
      });
    }

    return next.handle(request);
  }
}
