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
import { cloneDeep as ldDeepClone, mergeWith as ldMergeWith } from 'lodash-es';
import { DeepReadonly } from 'ts-essentials';

import { DefaultLoggerConfig } from './logger.default';
import { LogColors, LogLevel, LogNames } from './logger.model';

/**
 * An injectable class that handles logging service
 */
@Injectable({ providedIn: 'root' })
export class LoggerService {
  private nameSpace = 'LOGGER';
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;

  constructor(readonly config: ConfigService) {
    this.options = ldMergeWith(
      ldDeepClone({ logger: DefaultLoggerConfig }),
      this.config.options,
      (dest, src) => (Array.isArray(dest) ? src : undefined)
    );

    if (!this.config.options.production) {
      this.info(`[${this.nameSpace}] LogService ready ...`);
    }
  }

  /**
   * Handles mission critical logs
   * @param message logging message
   * @param extras extra messages
   */
  critical(message: any, ...extras: any[]) {
    this.doLog(LogLevel.critical, message, extras);
  }

  /**
   * Handles system error logs
   * @param message logging message
   * @param extras extra messages
   */
  error(message: any, ...extras: any[]) {
    this.doLog(LogLevel.error, message, extras);
  }

  /**
   * Handles warning logs
   * @param message logging message
   * @param extras extra messages
   */
  warn(message: any, ...extras: any[]) {
    this.doLog(LogLevel.warn, message, extras);
  }

  /**
   * Handles info logs
   * @param message logging message
   * @param extras extra messages
   */
  info(message: any, ...extras: any[]) {
    this.doLog(LogLevel.info, message, extras);
  }

  /**
   * Handles debugging logs
   * @param message logging message
   * @param extras extra messages
   */
  debug(message: any, ...extras: any[]) {
    this.doLog(LogLevel.debug, message, extras);
  }

  /**
   * Handles trace logs
   * @param message logging message
   * @param extras extra messages
   */
  trace(message: any, ...extras: any[]) {
    this.doLog(LogLevel.trace, message, extras);
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
  private doLog(level: LogLevel, message: any, extras: any[] = []) {
    if (
      !message ||
      level === LogLevel.none ||
      level > this.options.logger.level ||
      this.options.logger.level === LogLevel.none
    ) {
      return;
    }

    const color = LogColors[level];
    console.log(`%c${this.time} [${LogNames[level]}]`, `color:${color}`, message, ...extras);
  }
}
