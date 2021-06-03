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
      console: true,
      show: true,
    },
    logout: {
      text: _('SUCCESS.AUTH.LOGOUT'),
      code: 'SUCCESS.AUTH.LOGOUT',
      level: LogLevels.info,
      console: true,
      show: true,
    },
    register: {
      text: _('SUCCESS.AUTH.REGISTER'),
      code: 'SUCCESS.AUTH.REGISTER',
      level: LogLevels.info,
      console: true,
      show: true,
    },
    refresh: {
      text: _('SUCCESS.AUTH.REFRESH'),
      code: 'SUCCESS.AUTH.REFRESH',
      level: LogLevels.info,
      console: true,
    },
  },
  error: {
    login: {
      text: _('ERROR.AUTH.LOGIN'),
      code: 'ERROR.AUTH.LOGIN',
      level: LogLevels.warn,
      show: true,
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
      show: true,
    },
    refresh: {
      text: _('ERROR.AUTH.REFRESH'),
      code: 'ERROR.AUTH.REFRESH',
      level: LogLevels.warn,
    },
    server: {
      text: _('ERROR.SERVER'),
      code: 'ERROR.SERVER',
      level: LogLevels.error,
    },
  },
};
