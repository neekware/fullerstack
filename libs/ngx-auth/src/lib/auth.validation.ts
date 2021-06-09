import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { GqlService } from '@fullerstack/ngx-gql';
import { AuthIsEmailAvailable } from '@fullerstack/ngx-gql/operations';
import { isEmailAvailable } from '@fullerstack/ngx-gql/schema';
import { GTagService } from '@fullerstack/ngx-gtag';
import { Observable, from, of, timer } from 'rxjs';
import { catchError, map, switchMapTo, take } from 'rxjs/operators';

@Injectable()
export class AuthAsyncValidation {
  constructor(readonly gql: GqlService, readonly gtag: GTagService) {}

  validateEmailAvailability(debounce = 600): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return timer(debounce).pipe(switchMapTo(from(this.isEmailAvailable(control.value))), take(1));
    };
  }

  isEmailAvailable(email: string): Observable<unknown> {
    return from(
      this.gql.client.mutate<isEmailAvailable>({
        mutation: AuthIsEmailAvailable,
        variables: { email },
      })
    ).pipe(
      map(({ data }) => {
        return data.isEmailAvailable;
      }),
      map((resp) => {
        this.gtag.trackEvent('email_available', {
          method: 'query',
          event_category: 'auth',
          event_label: email,
        });
        return resp.ok ? null : { emailInUse: true };
      }),
      catchError((error) => {
        this.gtag.trackEvent('email_available_failed', {
          method: 'query',
          event_category: 'auth',
          event_label: `(${email} ): ${error.message}`,
        });
        return of({ serverError: true });
      })
    );
  }
}
