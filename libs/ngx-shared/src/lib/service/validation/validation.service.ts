/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable */
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { tokenizeFullName } from '@fullerstack/agx-util';

export enum compareType {
  'sameAs' = 'sameAs', // two values to be the same
  'otherThan' = 'otherThan', // two values not be the same
}

@Injectable({ providedIn: 'root' })
export class ValidationService {
  // Visa, MasterCard, American Express, Diners Club, Discover, JCB
  validateCreditCard(control: FormControl): ValidationErrors | null {
    if (
      control.value.match(
        /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
      )
    ) {
      // tslint:disable-line:max-line-length
      return null;
    } else {
      return { invalidCreditCard: true };
    }
  }

  // RFC 2822 compliant regex
  validateEmail(control: FormControl): ValidationErrors | null {
    if (
      control.value.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      // tslint:disable-line:max-line-length
      return null;
    } else {
      return { invalidEmailAddress: true };
    }
  }

  // Password is between 6 and 100 characters and has at least one number.
  validatePassword(control: FormControl): ValidationErrors | null {
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return { invalidPassword: true };
    }
  }

  // Matching two passwords
  matchingPasswords(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('passwordConfirmation');

    if (password.pristine || confirmPassword.pristine) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatchPassword: true });
      return {
        mismatchedPasswords: true,
      };
    }

    return null;
  }

  // Full name should not have numbers, must have at least one space and each part must be at least 2 char long
  validateFullName(control: FormControl): ValidationErrors | null {
    const { firstName, lastName } = tokenizeFullName(control.value);
    if (firstName.length < 2) {
      return { invalidFirstName: true };
    }
    if (lastName.length < 2) {
      return { invalidLastName: true };
    }
    return null;
  }

  // Value cannot be less than zero (int/float)
  validateNonNegative = (control: FormControl): ValidationErrors | null => {
    const value = parseFloat(control.value);
    if (isNaN(value)) {
      return { invalidNumber: true };
    }
    if (value < 0) {
      return { negativeNumber: true };
    }
    return null;
  };

  // Value cannot be a zero (int/float, +ve/-ve)
  validateNonZero = (control: FormControl): ValidationErrors | null => {
    const value = parseFloat(control.value);
    if (isNaN(value)) {
      return { invalidNumber: true };
    }
    if (value === 0) {
      return { nonZero: true };
    }
    return null;
  };

  // Value cannot be non-float (float, +ve/-ve)
  validateFloat = (control: FormControl): ValidationErrors | null => {
    const value = parseFloat(control.value);
    if (isNaN(value)) {
      return { invalidNumber: true };
    }
    return null;
  };

  // Value cannot be non-int (int, +ve/-ve)
  validateInt = (control: FormControl): ValidationErrors | null => {
    const value = parseInt(control.value);
    if (isNaN(value)) {
      return { invalidNumber: true };
    }
    return null;
  };

  /**
   * Compares two values to be the same or different
   * @param givenValue - Value to compare the control's value with
   * @param operationType - Type of comparison, sameAs, DifferentThan
   * @param caseInsensitive
   * @param errorCode
   */
  compareFor = (
    givenValue: string,
    caseInsensitive = true,
    operationType = compareType.sameAs,
    errorCode = 'inputNotAsExpected'
  ): ValidatorFn => {
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.pristine) {
        return null;
      }

      const left = caseInsensitive ? control.value.toLowerCase() : control.value;
      const right = caseInsensitive ? givenValue.toLowerCase() : givenValue;

      let conditionMet = left === right;
      if (operationType === compareType.otherThan) {
        conditionMet = left !== right;
      }

      if (conditionMet) {
        return null;
      }

      return { [errorCode]: true };
    };
  };

  // Input must be different than the given value
  matchOtherThan = (
    givenValue: any,
    error = 'inputShouldDiffer',
    caseInsensitive = true
  ): ValidatorFn => {
    return this.compareFor(givenValue, caseInsensitive, compareType.otherThan, error);
  };

  // Input must be the same as the expected value
  matchExpected = (
    givenValue: any,
    error = 'inputNotAsExpected',
    caseInsensitive = true
  ): ValidatorFn => {
    return this.compareFor(givenValue, caseInsensitive, compareType.sameAs, error);
  };
}
