/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { GqlService } from '@fullerstack/ngx-gql';
import { AuthIsEmailAvailable } from '@fullerstack/ngx-gql/operations';
import { AuthStatus } from '@fullerstack/ngx-gql/schema';
import { LoggerService } from '@fullerstack/ngx-logger';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthAsyncValidation {
  constructor(
    readonly http: HttpClient,
    readonly gql: GqlService,
    readonly logger: LoggerService
  ) {}

  validateEmailAvailability(debounce = 600): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return timer(debounce).pipe(
        switchMap(() => this.isEmailAvailable(control.value)),
        take(1)
      );
    };
  }

  isEmailAvailable(email: string): Observable<ValidationErrors | null> {
    return this.gql.client
      .request<AuthStatus>(AuthIsEmailAvailable, { email })
      .pipe(
        map((resp) => {
          return resp.ok ? null : { emailInUse: true };
        }),
        catchError((error) => {
          this.logger.error(error);
          return of({ emailInUse: true });
        })
      );
  }
}
