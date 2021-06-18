/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

export interface HealthCheck {
  ping: boolean;
}

export const ApiConstants = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 200,
  USERNAME_MIN_LENGTH: 2,
  USERNAME_MAX_LENGTH: 254,
};

export const NESTJS_THROTTLE_ERROR = 'ThrottlerException: Too Many Requests';
