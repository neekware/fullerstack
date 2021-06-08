import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { GqlService } from './gql.service';

@Injectable()
export class GqlInterceptor implements HttpInterceptor {
  private gql: GqlService;

  constructor(private injector: Injector) {
    setTimeout(() => {
      this.gql = this.injector.get(GqlService);
    });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.gql && request.url.includes(`${this.gql.options.gql.endpoint}`)) {
      const nextReq = request.clone({
        headers: request.headers
          .set('Cache-Control', 'no-cache, no-store')
          .set('Pragma', 'no-cache'),
      });
      return next.handle(nextReq);
    }

    return next.handle(request);
  }
}
