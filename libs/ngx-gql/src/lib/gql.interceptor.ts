import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { gqlErrorsConverter } from './gql.error';
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
      request = request.clone({
        headers: request.headers
          .set('Cache-Control', 'no-cache, no-store')
          .set('Pragma', 'no-cache'),
        responseType: 'json',
      });
      return next.handle(request).pipe(
        gqlErrorsConverter(),
        // catchError((error) => {
        //   if (error.error instanceof ErrorEvent) {
        //     console.log(`Error: ${error.error.message}`);
        //   } else {
        //     console.log(`Error: ${error.message}`);
        //   }
        //   return of([]);
        // }),
        map((event) => {
          if (event instanceof HttpResponse && event?.type) {
            // gqlParseError(event);
            return event;
          }
          return event;
        })
      );
    }

    return next.handle(request);
  }
}
