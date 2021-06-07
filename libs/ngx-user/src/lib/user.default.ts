import { _ } from '@fullerstack/ngx-i18n';
import { LogLevels } from '@fullerstack/ngx-logger';
import { MessageMap } from '@fullerstack/ngx-msg';

export const UserMessageMap: MessageMap = {
  success: {
    fetch: {
      text: _('SUCCESS.USER.FETCH'),
      code: 'SUCCESS.USER.FETCH',
      level: LogLevels.info,
    },
    update: {
      text: _('SUCCESS.USER.UPDATE'),
      code: 'SUCCESS.USER.UPDATE',
      level: LogLevels.info,
    },
    verify_request: {
      text: _('SUCCESS.USER.VERIFY_REQUEST'),
      code: 'SUCCESS.USER.VERIFY_REQUEST',
      level: LogLevels.info,
    },
    verify: {
      text: _('SUCCESS.USER.VERIFY'),
      code: 'SUCCESS.USER.VERIFY',
      level: LogLevels.info,
    },
    delete: {
      text: _('SUCCESS.USER.DELETE'),
      code: 'SUCCESS.USER.DELETE',
      level: LogLevels.info,
    },
    password_change: {
      text: _('SUCCESS.USER.PASSWORD_CHANGE'),
      code: 'SUCCESS.USER.PASSWORD_CHANGE',
      level: LogLevels.info,
    },
    language_change: {
      text: _('SUCCESS.USER.LANGUAGE_CHANGE'),
      code: 'SUCCESS.USER.LANGUAGE_CHANGE',
      level: LogLevels.info,
    },
    password_reset: {
      text: _('SUCCESS.USER.PASSWORD_RESET'),
      code: 'SUCCESS.USER.PASSWORD_RESET',
      level: LogLevels.info,
    },
    password_reset_verify: {
      text: _('SUCCESS.USER.PASSWORD_RESET_VERIFY'),
      code: 'SUCCESS.USER.PASSWORD_RESET_VERIFY',
      level: LogLevels.info,
    },
    password_renew: {
      text: _('SUCCESS.USER.PASSWORD_RENEW'),
      code: 'SUCCESS.USER.PASSWORD_RENEW',
      level: LogLevels.info,
    },
    email_change_request: {
      text: _('SUCCESS.USER.EMAIL_CHANGE_REQUEST'),
      code: 'SUCCESS.USER.EMAIL_CHANGE_REQUEST',
      level: LogLevels.info,
    },
    email_change: {
      text: _('SUCCESS.USER.EMAIL_CHANGE'),
      code: 'SUCCESS.USER.EMAIL_CHANGE',
      level: LogLevels.info,
    },
  },
  error: {
    fetch: {
      text: _('ERROR.USER.FETCH'),
      code: 'ERROR.USER.FETCH',
      level: LogLevels.warn,
    },
    update: {
      text: _('ERROR.USER.UPDATE'),
      code: 'ERROR.USER.UPDATE',
      level: LogLevels.warn,
    },
    verify_request: {
      text: _('ERROR.USER.VERIFY_REQUEST'),
      code: 'ERROR.USER.VERIFY_REQUEST',
      level: LogLevels.warn,
    },
    verify: {
      text: _('ERROR.USER.VERIFY'),
      code: 'ERROR.USER.VERIFY',
      level: LogLevels.warn,
    },
    delete: {
      text: _('ERROR.USER.DELETE'),
      code: 'ERROR.USER.DELETE',
      level: LogLevels.warn,
    },
    password_change: {
      text: _('ERROR.USER.PASSWORD_CHANGE'),
      code: 'ERROR.USER.PASSWORD_CHANGE',
      level: LogLevels.warn,
    },
    language_change: {
      text: _('ERROR.USER.LANGUAGE_CHANGE'),
      code: 'ERROR.USER.LANGUAGE_CHANGE',
      level: LogLevels.warn,
    },
    password_reset: {
      text: _('ERROR.USER.PASSWORD_RESET'),
      code: 'ERROR.USER.PASSWORD_RESET',
      level: LogLevels.warn,
    },
    password_reset_verify: {
      text: _('ERROR.USER.PASSWORD_RESET_VERIFY'),
      code: 'ERROR.USER.PASSWORD_RESET_VERIFY',
      level: LogLevels.warn,
    },
    password_renew: {
      text: _('ERROR.USER.PASSWORD_RENEW'),
      code: 'ERROR.USER.PASSWORD_RENEW',
      level: LogLevels.warn,
    },
    email_change_request: {
      text: _('ERROR.USER.EMAIL_CHANGE_REQUEST'),
      code: 'ERROR.USER.EMAIL_CHANGE_REQUEST',
      level: LogLevels.warn,
    },
    email_change: {
      text: _('ERROR.USER.EMAIL_CHANGE'),
      code: 'ERROR.USER.EMAIL_CHANGE',
      level: LogLevels.warn,
    },
    server: {
      text: _('ERROR.SERVER'),
      code: 'ERROR.SERVER',
      level: LogLevels.error,
      consoleOnly: true,
    },
  },
};
