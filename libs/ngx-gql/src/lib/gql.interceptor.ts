import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { HttpStatusCode } from '@fullerstack/agx-dto';
import { tryGet } from '@fullerstack/agx-util';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { gqlErrorsConverter } from './gql.error';
import { GqlRequestBody } from './gql.model';
import { GqlService } from './gql.service';

@Injectable({ providedIn: 'root' })
export class GqlErrorInterceptor implements HttpInterceptor {
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

@Injectable({ providedIn: 'root' })
export class GqlSuccessInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      map((event) => {
        if (event instanceof HttpResponse && event?.type && event.status === HttpStatusCode.OK) {
          const operationName = (request.body as GqlRequestBody)?.operationName;
          if (operationName) {
            event = new HttpResponse({ ...event, body: event.body.data[operationName] });
          }
        }
        return event;
      })
    );
  }
}
