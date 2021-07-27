/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { tryGet } from '@fullerstack/agx-util';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';

/**
 * Debounce time for verification and showing the hint
 */
export const VALIDATION_DEBOUNCE_TIME = 300;

export const ValidatorMessages = {
  required: _('VALIDATION.REQUIRED'),
  minlength: _('VALIDATION.MINIMUM_LENGTH'),
  maxlength: _('VALIDATION.MAXIMUM_LENGTH'),
  nonZero: _('VALIDATION.NON_ZERO'),
  invalidNumber: _('VALIDATION.INVALID_NUMBER'),
  negativeNumber: _('VALIDATION.NEGATIVE_NUMBER'),
  invalidEmailAddress: _('VALIDATION.INVALID_EMAIL'),
  emailInUse: _('VALIDATION.EMAIL_IN_USE'),
  emailNotFound: _('VALIDATION.EMAIL_NOT_FOUND'),
  notAccountEmail: _('VALIDATION.NOT_ACCOUNT_EMAIL'),
  invalidCreditCard: _('VALIDATION.INVALID_CREDIT_CARD'),
  invalidPassword: _('VALIDATION.INVALID_PASSWORD'),
  mismatchPassword: _('VALIDATION.INVALID_PASSWORD_CONFIRMATION'),
  incorrectPassword: _('VALIDATION.INCORRECT_PASSWORD'),
  invalidFirstName: _('VALIDATION.SHORT_FIRST_NAME'),
  invalidLastName: _('VALIDATION.SHORT_LAST_NAME'),
  invalidFullName: _('VALIDATION.INVALID_FULL_NAME'),
  invalidFormat: _('VALIDATION.INVALID_FORMAT'),
  invalidInput: _('VALIDATION.INVALID_INPUT'),
  serverError: _('VALIDATION.SERVER_ERROR'),
  inputNotAsExpected: _('VALIDATION.INPUT_NOT_AS_EXPECTED'),
  inputShouldDiffer: _('VALIDATION.INPUT_SHOULD_DIFFER'),
};

export const validatorMessage = (key: string): string => {
  return tryGet(() => ValidatorMessages[key]);
};
