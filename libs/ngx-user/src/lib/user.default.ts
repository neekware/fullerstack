/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { User } from '@fullerstack/ngx-gql/schema';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { LogLevel } from '@fullerstack/ngx-logger';
import { MessageMap } from '@fullerstack/ngx-msg';

export const DefaultUser = {
  firstName: null,
  lastName: null,
  email: null,
  id: null,
} as User;

export const UserMessageMap: MessageMap = {
  success: {
    fetch: {
      text: _('SUCCESS.USER.FETCH'),
      code: 'SUCCESS.USER.FETCH',
      level: LogLevel.info,
    },
    update: {
      text: _('SUCCESS.USER.UPDATE'),
      code: 'SUCCESS.USER.UPDATE',
      level: LogLevel.info,
    },
    verify_request: {
      text: _('SUCCESS.USER.VERIFY_REQUEST'),
      code: 'SUCCESS.USER.VERIFY_REQUEST',
      level: LogLevel.info,
    },
    verify: {
      text: _('SUCCESS.USER.VERIFY'),
      code: 'SUCCESS.USER.VERIFY',
      level: LogLevel.info,
    },
    delete: {
      text: _('SUCCESS.USER.DELETE'),
      code: 'SUCCESS.USER.DELETE',
      level: LogLevel.info,
    },
    password_change: {
      text: _('SUCCESS.USER.PASSWORD_CHANGE'),
      code: 'SUCCESS.USER.PASSWORD_CHANGE',
      level: LogLevel.info,
    },
    language_change: {
      text: _('SUCCESS.USER.LANGUAGE_CHANGE'),
      code: 'SUCCESS.USER.LANGUAGE_CHANGE',
      level: LogLevel.info,
    },
    password_reset: {
      text: _('SUCCESS.USER.PASSWORD_RESET'),
      code: 'SUCCESS.USER.PASSWORD_RESET',
      level: LogLevel.info,
    },
    password_reset_verify: {
      text: _('SUCCESS.USER.PASSWORD_RESET_VERIFY'),
      code: 'SUCCESS.USER.PASSWORD_RESET_VERIFY',
      level: LogLevel.info,
    },
    password_renew: {
      text: _('SUCCESS.USER.PASSWORD_RENEW'),
      code: 'SUCCESS.USER.PASSWORD_RENEW',
      level: LogLevel.info,
    },
    email_change_request: {
      text: _('SUCCESS.USER.EMAIL_CHANGE_REQUEST'),
      code: 'SUCCESS.USER.EMAIL_CHANGE_REQUEST',
      level: LogLevel.info,
    },
    email_change: {
      text: _('SUCCESS.USER.EMAIL_CHANGE'),
      code: 'SUCCESS.USER.EMAIL_CHANGE',
      level: LogLevel.info,
    },
  },
  error: {
    fetch: {
      text: _('ERROR.USER.FETCH'),
      code: 'ERROR.USER.FETCH',
      level: LogLevel.warn,
    },
    update: {
      text: _('ERROR.USER.UPDATE'),
      code: 'ERROR.USER.UPDATE',
      level: LogLevel.warn,
    },
    verify_request: {
      text: _('ERROR.USER.VERIFY_REQUEST'),
      code: 'ERROR.USER.VERIFY_REQUEST',
      level: LogLevel.warn,
    },
    verify: {
      text: _('ERROR.USER.VERIFY'),
      code: 'ERROR.USER.VERIFY',
      level: LogLevel.warn,
    },
    delete: {
      text: _('ERROR.USER.DELETE'),
      code: 'ERROR.USER.DELETE',
      level: LogLevel.warn,
    },
    password_change: {
      text: _('ERROR.USER.PASSWORD_CHANGE'),
      code: 'ERROR.USER.PASSWORD_CHANGE',
      level: LogLevel.warn,
    },
    language_change: {
      text: _('ERROR.USER.LANGUAGE_CHANGE'),
      code: 'ERROR.USER.LANGUAGE_CHANGE',
      level: LogLevel.warn,
    },
    password_reset: {
      text: _('ERROR.USER.PASSWORD_RESET'),
      code: 'ERROR.USER.PASSWORD_RESET',
      level: LogLevel.warn,
    },
    password_reset_verify: {
      text: _('ERROR.USER.PASSWORD_RESET_VERIFY'),
      code: 'ERROR.USER.PASSWORD_RESET_VERIFY',
      level: LogLevel.warn,
    },
    password_renew: {
      text: _('ERROR.USER.PASSWORD_RENEW'),
      code: 'ERROR.USER.PASSWORD_RENEW',
      level: LogLevel.warn,
    },
    email_change_request: {
      text: _('ERROR.USER.EMAIL_CHANGE_REQUEST'),
      code: 'ERROR.USER.EMAIL_CHANGE_REQUEST',
      level: LogLevel.warn,
    },
    email_change: {
      text: _('ERROR.USER.EMAIL_CHANGE'),
      code: 'ERROR.USER.EMAIL_CHANGE',
      level: LogLevel.warn,
    },
    server: {
      text: _('ERROR.SERVER'),
      code: 'ERROR.SERVER',
      level: LogLevel.error,
      consoleOnly: true,
    },
  },
};
