import { HttpErrorResponse } from '@angular/common/http';
import { HttpStatusCode } from '@fullerstack/agx-dto';
import { tryGet } from '@fullerstack/agx-util';
import { Observable, of, throwError } from 'rxjs';
import { concatMap } from 'rxjs/operators';

/**
 * Pipe-able gql  -> http error converter
 * It iterates through `gql` errors, and elevates the hightest priority http Error and raises an http error instead
 * @returns Observable<any>
 */
export const gqlErrorsConverter = () => (source: Observable<any>) =>
  source.pipe(
    concatMap((event) => {
      const errors = (event?.body?.errors || [])
        .filter((item: any) => item?.extensions?.exception?.response)
        .map((item: any) => item?.extensions?.exception?.response);
      if (errors?.length) {
        const status = tryGet(() => errors.map((item: any) => item.statusCode).sort()[0], 200);
        const statusText = HttpStatusCode[status];
        const newEvent = new HttpErrorResponse({
          status,
          statusText,
          headers: event.headers,
          url: event.url,
          error: { original: event.body, errors },
        });
        return throwError(newEvent);
      }
      return of(event);
    })
  );
