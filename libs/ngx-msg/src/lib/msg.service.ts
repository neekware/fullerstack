/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { I18nService } from '@fullerstack/ngx-i18n';
import { LogLevel, LoggerService } from '@fullerstack/ngx-logger';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { DeepReadonly } from 'ts-essentials';

import { SnackbarComponent } from './snackbar/snackbar.component';
import { SnackbarStatusDefault } from './snackbar/snackbar.default';
import { SnackbarStatus, SnackbarType } from './snackbar/snackbar.model';

@Injectable()
export class MsgService implements OnDestroy {
  private status: DeepReadonly<SnackbarStatus> = SnackbarStatusDefault;
  private destroy$ = new Subject<boolean>();

  constructor(
    readonly i18n: I18nService,
    readonly matSnackbar: MatSnackBar,
    readonly logger: LoggerService
  ) {
    this.reset();
  }

  reset() {
    this.status = {
      ...SnackbarStatusDefault,
      level: this.logger.options.logger.level,
      color: this.getColor(this.logger.options.logger.level),
    };
  }

  setMsg(msg: SnackbarStatus) {
    this.status = {
      ...this.status,
      ...msg,
      ...{
        color: this.getColor(msg?.level),
      },
    };
    if (this.status.console) {
      this.logToConsole();
    }
  }

  private getColor(level: LogLevel) {
    let color = 'primary';
    level = level || LogLevel.info;
    switch (level) {
      case LogLevel.critical:
      case LogLevel.error:
        color = 'warn';
        break;
      case LogLevel.warn:
        color = 'accent';
        break;
      case LogLevel.info:
      case LogLevel.debug:
        color = 'primary';
        break;
    }
    return color;
  }

  private logToConsole() {
    this.i18n.translate
      .get(this.status.text)
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe((msgText: string) => {
        switch (this.status.level) {
          case LogLevel.critical:
            this.logger.critical(msgText);
            break;
          case LogLevel.error:
            this.logger.error(msgText);
            break;
          case LogLevel.warn:
            this.logger.warn(msgText);
            break;
          case LogLevel.info:
            this.logger.info(msgText);
            break;
          case LogLevel.debug:
            this.logger.debug(msgText);
            break;
        }
      });
  }

  private openSnackBar(msg: string, msgType: SnackbarType, config?: MatSnackBarConfig) {
    msg = msg || this.status.text;
    config = {
      ...{
        duration: config?.duration || 2000,
        direction: this.i18n.direction,
        horizontalPosition: this.i18n.direction === 'ltr' ? 'left' : 'right',
      },
      ...(config || {}),
    };
    this.i18n.translate
      .get(msg)
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe((translatedText: string) => {
        config.data = {
          msgText: translatedText,
          msgType,
        };
        this.matSnackbar.openFromComponent(SnackbarComponent, config);
      });
  }

  successToast(msg: string, config?: MatSnackBarConfig) {
    this.openSnackBar(msg, SnackbarType.success, config);
  }

  warnToast(msg: string, config?: MatSnackBarConfig) {
    this.openSnackBar(msg, SnackbarType.warn, config);
  }

  errorToast(msg: string, config?: MatSnackBarConfig) {
    this.openSnackBar(msg, SnackbarType.error, config);
  }

  get text() {
    return this.status.text;
  }

  get critical() {
    return this.status.level === LogLevel.critical;
  }

  get error() {
    return this.status.level === LogLevel.error;
  }

  get warn() {
    return this.status.level === LogLevel.warn;
  }

  get info() {
    return this.status.level === LogLevel.info;
  }

  get success() {
    return this.status.level === LogLevel.success;
  }

  get isError() {
    return this.error || this.warn || this.critical;
  }

  get isSuccess() {
    return this.info || this.success;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
