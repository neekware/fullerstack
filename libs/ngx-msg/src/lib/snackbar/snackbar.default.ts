import { LogLevels } from '@fullerstack/ngx-logger';

import { SnackbarStatus } from './snackbar.model';

export const SnackbarStatusDefault: SnackbarStatus = {
  text: null,
  detail: null,
  code: null,
  level: LogLevels.info,
  color: null,
  console: true,
  consoleOnly: false,
  remote: false,
};
