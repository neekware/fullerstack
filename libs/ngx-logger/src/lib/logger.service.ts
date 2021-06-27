/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable } from '@angular/core';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { merge as ldNestedMerge } from 'lodash-es';
import { DeepReadonly } from 'ts-essentials';

import { DefaultLoggerConfig } from './logger.default';
import { LogColors, LogLevels, LogNames } from './logger.model';

/**
 * An injectable class that handles logging service
 */
@Injectable({ providedIn: 'root' })
export class LoggerService {
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;

  constructor(readonly config: ConfigService) {
    this.options = ldNestedMerge({ logger: DefaultLoggerConfig }, this.config.options);

    if (!this.config.options.production) {
      this.info('LogService ready ...');
    }
  }

  /**
   * Handles mission critical logs
   * @param message logging message
   * @param extras extra messages
   */
  critical(message: any, ...extras: any[]) {
    this.doLog(LogLevels.critical, message, extras);
  }

  /**
   * Handles system error logs
   * @param message logging message
   * @param extras extra messages
   */
  error(message: any, ...extras: any[]) {
    this.doLog(LogLevels.error, message, extras);
  }

  /**
   * Handles warning logs
   * @param message logging message
   * @param extras extra messages
   */
  warn(message: any, ...extras: any[]) {
    this.doLog(LogLevels.warn, message, extras);
  }

  /**
   * Handles info logs
   * @param message logging message
   * @param extras extra messages
   */
  info(message: any, ...extras: any[]) {
    this.doLog(LogLevels.info, message, extras);
  }

  /**
   * Handles debugging logs
   * @param message logging message
   * @param extras extra messages
   */
  debug(message: any, ...extras: any[]) {
    this.doLog(LogLevels.debug, message, extras);
  }

  /**
   * Handles trace logs
   * @param message logging message
   * @param extras extra messages
   */
  trace(message: any, ...extras: any[]) {
    this.doLog(LogLevels.trace, message, extras);
  }

  /**
   * Returns current time in ISO format (2018-03-04T22:46:09.346Z)
   */
  private get time() {
    return new Date().toISOString();
  }

  /**
   * Handles the platform logging
   * @param level logging level
   * @param message logging message
   * @param extras extra message
   */
  private doLog(level: LogLevels, message: any, extras: any[] = []) {
    if (
      !message ||
      level === LogLevels.none ||
      level > this.options.logger.level ||
      this.options.logger.level === LogLevels.none
    ) {
      return;
    }

    const color = LogColors[level];
    console.log(`%c${this.time} [${LogNames[level]}]`, `color:${color}`, message, ...extras);
  }
}
