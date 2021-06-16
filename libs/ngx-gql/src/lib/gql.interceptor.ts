import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { gqlErrorsConverter } from './gql.error';
import { GqlService } from './gql.service';

@Injectable({ providedIn: 'root' })
export class GqlInterceptor implements HttpInterceptor {
  private gql: GqlService;

  constructor(private injector: Injector) {
    setTimeout(() => {
      this.gql = this.injector.get(GqlService);
    });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(gqlErrorsConverter());
  }
}
