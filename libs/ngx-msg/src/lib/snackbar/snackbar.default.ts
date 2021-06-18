/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

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
