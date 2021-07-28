/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tryGet } from '@fullerstack/agx-util';
import { GqlOperationNameKey } from '@fullerstack/ngx-gql';
import { LoggerService } from '@fullerstack/ngx-logger';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements HttpInterceptor {
  private nameSpace = 'INTERCEPT';
  constructor(private logger: LoggerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const startTime = this.startTime;
    const operationName = tryGet(() => request?.body[GqlOperationNameKey], request.urlWithParams);
    return next.handle(request).pipe(
      tap((event) => {
        const elapsed = Math.ceil(this.endTime - startTime);
        if (event instanceof HttpResponse) {
          this.logger.debug(
            `[${this.nameSpace}][SUCCESS][${operationName}] Http Request took ${elapsed} ms!`
          );
        } else if (event instanceof HttpErrorResponse) {
          this.logger.debug(
            `[${this.nameSpace}][ERROR][${operationName}] Http Request took ${elapsed} ms!`
          );
        }
      })
    );
  }

  get startTime(): number {
    return performance.now();
  }

  get endTime(): number {
    return performance.now();
  }
}
