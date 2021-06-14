/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import * as objectHash from 'object-hash';
import { Observable, of, throwError } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { v4 as uuidV4 } from 'uuid';

import { CACHIFY_CONTEXT_TOKEN, DefaultContextMeta } from './cachify.default';
import { CACHIFY_AUTO_KEY, CachifyContextMeta, CachifyFetchPolicy } from './cachify.model';
import { CachifyService } from './cachify.service';
import { isPolicyEnabled } from './cachify.util';

@Injectable({ providedIn: 'root' })
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

    if (meta?.key) {
      const cachedResponse = this.cache.get(meta.key);
      switch (meta.policy) {
        case CachifyFetchPolicy.CacheFirst:
          if (cachedResponse) {
            return of(cachedResponse);
          }
          return this.playItForward(request, next, meta);

        case CachifyFetchPolicy.CacheAndNetwork:
          if (cachedResponse) {
            this.playItForward(request, next, meta).subscribe();
            return of(cachedResponse);
          }
          return this.playItForward(request, next, meta);

        case CachifyFetchPolicy.NetworkOnly:
          return this.playItForward(request, next, meta);

        case CachifyFetchPolicy.CacheOnly:
          if (cachedResponse) {
            return of(cachedResponse);
          }
          return throwError(new HttpErrorResponse({ status: HttpStatusCode.BadRequest }));

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
        if (event instanceof HttpResponse && event.type && meta?.key) {
          switch (meta.policy) {
            case CachifyFetchPolicy.CacheFirst:
            case CachifyFetchPolicy.CacheAndNetwork:
            case CachifyFetchPolicy.NetworkFirst:
              this.cache.set(meta.key, meta.ttl, event);
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

  /**
   *
   * @param request http request
   * @returns return caching meta data if available or default value (no caching)
   */
  private getContextMeta(request: HttpRequest<any>): CachifyContextMeta {
    const meta =
      request.context.get<CachifyContextMeta>(CACHIFY_CONTEXT_TOKEN) || DefaultContextMeta;
    if (!isPolicyEnabled(meta.policy)) {
      throw Error(`Error: Invalid fetch policy (${meta.policy})`);
    }

    if (meta?.key === CACHIFY_AUTO_KEY) {
      meta.key = this.makeRequestCacheKey(request);
    }

    return meta;
  }

  /**
   * Given a request object, it will return a unique string to be used as cache key
   * @param request Http request object
   * Note: blobs are excluded from the key
   */
  private makeRequestCacheKey(req: HttpRequest<any>): string {
    const uniqueData = {
      method: req.method,
      responseType: req.responseType,
      urlWithParams: req.urlWithParams,
      ...cloneDeep(req.body || {}),
      ...cloneDeep(req.headers || {}),
    };
    return objectHash(uniqueData);
  }
}
