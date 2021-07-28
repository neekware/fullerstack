/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '@fullerstack/ngx-auth';
import { CachifyInterceptor } from '@fullerstack/ngx-cachify';
import { GqlInterceptor } from '@fullerstack/ngx-gql';
import { I18nInterceptor } from '@fullerstack/ngx-i18n';
import { LoggerInterceptor, ProgressInterceptor } from '@fullerstack/ngx-shared';

/**
 * List of interceptors. Order is very important.
 * Request is processed from top to bottom.
 * Response is processed from bottom to top.
 * `HTTP_INTERCEPTORS` token is used to register `multiple` interceptors. (hence `multi: true`)
 */
export const httpInterceptorProvidersOrderedList = [
  /**
   * Logger Interceptor, tracks and logs all requests and responses.
   * When a response is received, the elapsed time is logged.
   */
  { provide: HTTP_INTERCEPTORS, useClass: LoggerInterceptor, multi: true },

  /**
   * Progress Interceptor, tracks the progress of all pending requests.
   * When total progress is 100% then all pending requests are completed.
   */
  { provide: HTTP_INTERCEPTORS, useClass: ProgressInterceptor, multi: true },

  /**
   * I18n Interceptor, injects the language headers in every request.
   * The language is based on user's profile settings, then the browser's language.
   */
  { provide: HTTP_INTERCEPTORS, useClass: I18nInterceptor, multi: true },

  /**
   * Auth Interceptor, injects the auth token in every request, handle 401 errors and refresh token.
   * If access token is expired, it will try to refresh it one more time, then will trigger a logout.
   */
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

  /**
   * Cachify interceptor, injects the cache every request, and returns a cached response if available &| requested.
   * The url along with headers are used to generate the cache key. Caching is based on the cache options, passed in via HttpContext.
   * This is to prevent herding requests, where multiple components are requesting the same url with a short amount of time.
   */
  { provide: HTTP_INTERCEPTORS, useClass: CachifyInterceptor, multi: true },

  /**
   * Gql Interceptor, handles every gql response and converts gql errors of 200 http code to real http errors
   * Gql sends a 200 "ok" http status even when it has an error. Here, we catch those errors and convert them to real http errors.
   * This way, the callers can catch the errors and handle them.
   */
  { provide: HTTP_INTERCEPTORS, useClass: GqlInterceptor, multi: true },
];
