import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { GqlService, gqlMgr } from '@fullerstack/ngx-gql';
import * as schema from '@fullerstack/ngx-gql/schema';
import { Observable, from, of as observableOf, timer } from 'rxjs';
import { catchError, map, switchMapTo, take } from 'rxjs/operators';

const EmailFoundQueryNode = gqlMgr.getOperation('EmailFound');

@Injectable()
export class AsyncValidationService {
  constructor(readonly gql: GqlService) {}

  validateEmailAvailability(debounce = 600): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return timer(debounce).pipe(
        switchMapTo(
          from(
            this.gql.client.query<schema.EmailFoundQuery>({
              query: EmailFoundQueryNode,
              variables: { email: control.value },
            })
          ).pipe(map(({ data }) => data.emailFound))
        ),
        map((exists) => (exists ? { emailInUse: true } : null)),
        catchError((error) => {
          console.error(error);
          return observableOf({ serverError: true });
        }),
        take(1)
      );
    };
  }
}
