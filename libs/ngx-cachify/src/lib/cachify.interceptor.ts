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
import { Observable, of as observableOf, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidV4 } from 'uuid';

import {
  CACHIFY_FETCH_POLICY,
  CACHIFY_KEY,
  CACHIFY_TTL,
  CachifyFetchPolicy,
  CachifyMetaData,
} from './cachify.model';
import { CachifyService } from './cachify.service';
import { isPolicyEnabled } from './cachify.util';

@Injectable()
export class CachifyInterceptor implements HttpInterceptor {
  constructor(private cache: CachifyService) {}

  /**
   * Extracts and returns the intercept meta data from request header
   * @param request Intercepted request
   */
  private getMeta(req: HttpRequest<any>): CachifyMetaData {
    const policy = req.headers.get(CACHIFY_FETCH_POLICY);
    if (policy && !isPolicyEnabled(policy)) {
      throw Error(`Error: Invalid fetch policy (${policy})`);
    }

    const meta = {
      policy: policy as CachifyFetchPolicy,
      key: req.headers.get(CACHIFY_KEY),
      ttl: +(req.headers.get(CACHIFY_TTL) || this.cache.options.httpCache.ttl),
    };

    this.cleanMeta(req);
    return meta;
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
   * Removes intercept meta data from http headers
   * @param request Intercepted request
   */
  private cleanMeta(request: HttpRequest<any>) {
    [CACHIFY_TTL, CACHIFY_KEY, CACHIFY_FETCH_POLICY].forEach((item) =>
      request.headers.delete(item)
    );
  }

  /**
   * The logic to handle the cache intercept per meta data instructions
   * @param request Intercepted request
   * @param next Handler for this intercept
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.addUniqueRequestId(request.headers);

    const meta = this.getMeta(request);
    if (meta && meta.key) {
      const cachedResponse = this.cache.get(meta.key);
      switch (meta.policy) {
        case CachifyFetchPolicy.CacheFirst:
          if (cachedResponse) {
            return observableOf(cachedResponse);
          }
          return this.playItForward(request, next, meta);

        case CachifyFetchPolicy.CacheAndNetwork:
          if (cachedResponse) {
            this.playItForward(request, next, meta);
            return observableOf(cachedResponse);
          }
          return this.playItForward(request, next, meta);

        case CachifyFetchPolicy.NetworkOnly:
          return this.playItForward(request, next, meta);

        case CachifyFetchPolicy.CacheOnly:
          if (cachedResponse) {
            return observableOf(cachedResponse);
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
   * @param req Initial request
   * @param next Next step
   * @param meta Intercept meta data
   */
  playItForward(
    req: HttpRequest<any>,
    next: HttpHandler,
    meta?: CachifyMetaData
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
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
}
