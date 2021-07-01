/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthAsyncValidation {
  constructor(readonly auth: AuthService) {}

  validateEmailAvailability(debounce = 600): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return timer(debounce).pipe(
        switchMap(() => this.auth.isEmailAvailable(control.value)),
        map((available) => (available ? null : { emailInUse: true }))
      );
    };
  }
}
