import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { GqlResponseBody, GqlService } from '@fullerstack/ngx-gql';
import { AuthIsEmailAvailable } from '@fullerstack/ngx-gql/operations';
import { AuthStatus } from '@fullerstack/ngx-gql/schema';
import { GTagService } from '@fullerstack/ngx-gtag';
import { Observable, from, of, timer } from 'rxjs';
import { catchError, map, switchMapTo, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthAsyncValidation {
  constructor(readonly http: HttpClient, readonly gql: GqlService, readonly gtag: GTagService) {}

  validateEmailAvailability(debounce = 600): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return timer(debounce).pipe(switchMapTo(from(this.isEmailAvailable(control.value))), take(1));
    };
  }

  isEmailAvailable<isEmailAvailable>(email: string): Observable<unknown> {
    return this.gql.client
      .request<AuthStatus>(AuthIsEmailAvailable, { email })
      .pipe(
        map((resp) => {
          return resp.ok ? null : { emailInUse: true };
        }),
        catchError((error, caught$) => {
          return caught$;
        })
      );
  }
}
