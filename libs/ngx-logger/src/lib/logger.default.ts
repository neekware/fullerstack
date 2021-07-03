/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { DeepReadonly } from 'ts-essentials';

import { LogLevel, LoggerConfig } from './logger.model';

/**
 * Default configuration - logger module
 */
export const DefaultLoggerConfig: DeepReadonly<LoggerConfig> = {
  level: LogLevel.none,
};
