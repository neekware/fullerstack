/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { LogLevel } from '@fullerstack/ngx-logger';

export enum SnackbarType {
  'error' = 'error',
  'warn' = 'warn',
  'success' = 'success',
}

export interface SnackbarData {
  msgText: string;
  msgType: SnackbarType;
  textColor?: string;
  svgIcon?: string;
  iconColor?: string;
}

export const SnackbarDataDefault = {
  msgText: undefined,
  msgType: SnackbarType.success,
  textColor: 'white',
  svgIcon: undefined,
  iconColor: 'white',
};

export class SnackbarStatus {
  // simple public message for end user. (what happened, what next)
  text: string;
  // detailed private message to help with debugging
  detail?: string;
  // unique message code pinpoint to line of code
  code?: string;
  // log level
  level?: LogLevel;
  // color of message
  color?: string;
  // log it to console
  console?: boolean;
  // console logs only
  consoleOnly?: boolean;
  // log it to remote server(s)
  remote?: boolean;
}
