import { HTTP_INTERCEPTORS, HttpInterceptor } from '@angular/common/http';

export function getHttpInterceptor(interceptor: HttpInterceptor) {
  // HTTP_INTERCEPTORS token can be used for many interceptors, hence `multi: true`
  return { provide: HTTP_INTERCEPTORS, useClass: interceptor, multi: true };
}
