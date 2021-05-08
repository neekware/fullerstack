import { LogLevels } from '@fullerstack/ngx-logger';

import { SnackbarStatus } from './msg.model';

export const SnackbarStatusDefault: SnackbarStatus = {
  text: null,
  detail: null,
  code: null,
  level: LogLevels.info,
  color: null,
  console: true,
  remote: false,
};
