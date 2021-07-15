/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { I18nService } from './i18n.service';

@Injectable({ providedIn: 'root' })
export class I18nInterceptor implements HttpInterceptor {
  private i18n: I18nService;

  constructor(readonly injector: Injector) {
    /**
     * This interceptor will initialize before the the auth module
     * So, we inject it manually, with a bit of delay to prevent circular injection deps
     */
    setTimeout(() => {
      this.i18n = this.injector.get(I18nService);
    });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.i18n) {
      request = request.clone({ setHeaders: { 'Accept-Language': this.i18n.currentLanguage } });
    }
    return next.handle(request);
  }
}
