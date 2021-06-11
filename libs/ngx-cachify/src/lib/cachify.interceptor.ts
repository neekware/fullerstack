/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidV4 } from 'uuid';

import { CACHIFY_CONTEXT_TOKEN, DefaultContextMeta } from './cachify.default';
import { CachifyContextMeta, CachifyFetchPolicy } from './cachify.model';
import { CachifyService } from './cachify.service';
import { isPolicyEnabled } from './cachify.util';

@Injectable()
export class CachifyInterceptor implements HttpInterceptor {
  constructor(private cache: CachifyService) {}

  /**
   * The logic to handle the cache intercept per meta data instructions
   * @param request Intercepted request
   * @param next Handler for this intercept
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.addUniqueRequestId(request.headers);
    const meta = this.getContextMeta(request);

    if (meta && meta.key) {
      const cachedResponse = this.cache.get(meta.key);
      switch (meta.policy) {
        case CachifyFetchPolicy.CacheFirst:
          if (cachedResponse) {
            return of(cachedResponse);
          }
          return this.playItForward(request, next, meta);

        case CachifyFetchPolicy.CacheAndNetwork:
          if (cachedResponse) {
            this.playItForward(request, next, meta);
            return of(cachedResponse);
          }
          return this.playItForward(request, next, meta);

        case CachifyFetchPolicy.NetworkOnly:
          return this.playItForward(request, next, meta);

        case CachifyFetchPolicy.CacheOnly:
          if (cachedResponse) {
            return of(cachedResponse);
          }
          return throwError(new HttpErrorResponse({}));

        case CachifyFetchPolicy.CacheOff:
          return this.playItForward(request, next, meta);
      }
    }
    return this.playItForward(request, next);
  }

  /**
   * Completes http request
   * @param request Initial request
   * @param next Next step
   * @param meta Intercept meta data
   */
  playItForward(
    request: HttpRequest<any>,
    next: HttpHandler,
    meta?: CachifyContextMeta
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((event) => {
        if (meta && event instanceof HttpResponse) {
          if (meta.key) {
            switch (meta.policy) {
              case CachifyFetchPolicy.CacheFirst:
              case CachifyFetchPolicy.CacheAndNetwork:
              case CachifyFetchPolicy.NetworkFirst:
                this.cache.set(meta.key, meta.ttl, event);
                break;
              default:
                break;
            }
          }
        }
      })
    );
  }

  /**
   * Inserts a unique identifier to each requests headers.
   * The purpose is for client request / server response / log correlation.
   * @param headers Http headers
   */
  private addUniqueRequestId(headers: HttpHeaders) {
    const uuid = uuidV4();
    headers.set('X-Request-ID', uuid).set('X-Correlation-ID', uuid);
  }

  private getContextMeta(request: HttpRequest<any>): CachifyContextMeta {
    const meta =
      request.context.get<CachifyContextMeta>(CACHIFY_CONTEXT_TOKEN) || DefaultContextMeta;
    if (!isPolicyEnabled(meta.policy)) {
      throw Error(`Error: Invalid fetch policy (${meta.policy})`);
    }
    return meta;
  }
}
