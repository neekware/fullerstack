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
  Error: {
    Server: {
      Error_TooManyRequests: _('ERROR.SERVER.THROTTLE'),
    },
    Auth: {
      UserNotFound: _('ERROR.AUTH.LOGIN'),
      InvalidOrExpiredSession: _('ERROR.AUTH.INVALID_OR_EXPIRED_SESSION'),
      MissingAccessToken: _('ERROR.AUTH.MISSING_ACCESS_TOKEN'),
      InvalidAccessToken: _('ERROR.AUTH.INVALID_ACCESS_TOKEN'),
      InvalidOrInactiveUser: _('ERROR.AUTH.INVALID_INACTIVE_USER'),
      InvalidOrRemotelyTerminatedSession: _('ERROR.AUTH.INVALID_OR_REMOTELY_TERMINATED_SESSION'),
      Unauthorized: _('ERROR.AUTH.UNAUTHORIZED'),
      Forbidden: _('ERROR.AUTH.FORBIDDEN'),
      EmailInUse: _('ERROR.AUTH.EMAIL_IN_USE'),
      UsernameInUse: _('ERROR.AUTH.USERNAME_IN_USE'),
      InvalidPassword: _('ERROR.AUTH.INVALID_PASSWORD'),
      InvalidUserOrPassword: _('ERROR.AUTH.INVALID_USER_OR_PASSWORD'),
    },
  },
};

export enum ActionStatus {
  success = 'success',
  failure = 'failure',
}
