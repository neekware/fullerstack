/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { i18nExtractor as _ } from './dto.util';

export interface HealthCheck {
  ping: boolean;
}

export const ApiConstants = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 200,
  USERNAME_MIN_LENGTH: 2,
  USERNAME_MAX_LENGTH: 64,
};

export const ThrottlerException = 'ThrottlerException: Too Many Requests';

export const ApiError = {
  Error_TooManyRequests: _('ERROR.SERVER.THROTTLE'),
  Error_UserNotFound: _('ERROR.AUTH.LOGIN'),
  Error_TokenRefresh: _('ERROR.AUTH.REFRESH'),
  Error_Unauthorized: _('ERROR.AUTH.UNAUTHORIZED'),
  Error_Forbidden: _('ERROR.AUTH.FORBIDDEN'),
  Error_EmailInUse: _('ERROR.AUTH.EMAIL_IN_USE'),
  Error_UsernameInUse: _('ERROR.AUTH.USERNAME_IN_USE'),
};

export enum ActionStatus {
  success = 'success',
  failure = 'failure',
}
