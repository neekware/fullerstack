/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { HTTP_INTERCEPTORS, HttpInterceptor } from '@angular/common/http';

export function getHttpInterceptor(interceptor: HttpInterceptor) {
  // HTTP_INTERCEPTORS token can be used for many interceptors, hence `multi: true`
  return { provide: HTTP_INTERCEPTORS, useClass: interceptor, multi: true };
}
