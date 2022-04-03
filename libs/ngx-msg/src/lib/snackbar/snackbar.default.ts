/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { LogLevel } from '@fullerstack/ngx-logger';

import { SnackbarStatus } from './snackbar.model';

export const SnackbarStatusDefault: SnackbarStatus = {
  text: null,
  detail: null,
  code: null,
  level: LogLevel.info,
  color: null,
  console: true,
  consoleOnly: false,
  remote: false,
};
