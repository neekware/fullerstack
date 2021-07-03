/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { DeepReadonly } from 'ts-essentials';

/**
 * Log config declaration
 */
export interface LoggerConfig {
  level: number;
}

/**
 * Log level
 * Each level enables itself and all level(s) above
 */
export enum LogLevel {
  ignore = 0, // we start at level 1, ignoring 0, for programmatic reasons (ie. using in switch)
  critical,
  error,
  warn,
  info,
  debug,
  trace,
  none,
}

/**
 * Log level name - order is important
 */
export const LogNames: DeepReadonly<string[]> = [
  'IGNORE',
  'CRITICAL',
  'ERROR',
  'WARN',
  'INFO',
  'DEBUG',
  'TRACE',
];

/**
 * Log level colors - order is important
 */
export const LogColors: DeepReadonly<string[]> = [
  'ignore',
  'red',
  'OrangeRed ',
  'orange',
  'teal',
  'SlateGrey',
  'LightBlue',
];
