import { _ } from '@fullerstack/ngx-i18n';
import { LogLevels } from '@fullerstack/ngx-logger';
import { MessageMap } from '@fullerstack/ngx-msg';
import { DeepReadonly } from 'ts-essentials';

import { AuthState } from './auth-state.model';

export const DefaultAuthState: DeepReadonly<AuthState> = {
  isLoggedIn: false,
  isRegistering: false,
  isAuthenticating: false,
  hasError: false,
  token: null,
};

export const AuthMessageMap: MessageMap = {
  success: {
    login: {
      text: _('SUCCESS.AUTH.LOGIN'),
      code: 'SUCCESS.AUTH.LOGIN',
      level: LogLevels.info,
    },
    logout: {
      text: _('SUCCESS.AUTH.LOGOUT'),
      code: 'SUCCESS.AUTH.LOGOUT',
      level: LogLevels.info,
    },
    register: {
      text: _('SUCCESS.AUTH.REGISTER'),
      code: 'SUCCESS.AUTH.REGISTER',
      level: LogLevels.info,
    },
    refresh: {
      text: _('SUCCESS.AUTH.REFRESH'),
      code: 'SUCCESS.AUTH.REFRESH',
      level: LogLevels.info,
      consoleOnly: true,
    },
  },
  error: {
    login: {
      text: _('ERROR.AUTH.LOGIN'),
      code: 'ERROR.AUTH.LOGIN',
      level: LogLevels.warn,
    },
    logout: {
      text: _('ERROR.AUTH.LOGOUT'),
      code: 'ERROR.AUTH.LOGOUT',
      level: LogLevels.warn,
    },
    register: {
      text: _('ERROR.AUTH.REGISTER'),
      code: 'ERROR.AUTH.REGISTER',
      level: LogLevels.warn,
    },
    refresh: {
      text: _('ERROR.AUTH.REFRESH'),
      code: 'ERROR.AUTH.REFRESH',
      level: LogLevels.warn,
      consoleOnly: true,
    },
    server: {
      text: _('ERROR.SERVER'),
      code: 'ERROR.SERVER',
      level: LogLevels.error,
      consoleOnly: true,
    },
  },
};
