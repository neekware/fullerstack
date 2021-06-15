import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { I18nService } from '@fullerstack/ngx-i18n';
import { LogLevels, LoggerService } from '@fullerstack/ngx-logger';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash-es';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { DeepReadonly } from 'ts-essentials';

import { SnackbarComponent } from './snackbar/snackbar.component';
import { SnackbarStatusDefault } from './snackbar/snackbar.default';
import { SnackbarStatus, SnackbarType } from './snackbar/snackbar.model';

@Injectable()
export class MsgService implements OnDestroy {
  status: DeepReadonly<SnackbarStatus> = SnackbarStatusDefault;
  destroy$ = new Subject<boolean>();

  constructor(
    readonly i18n: I18nService,
    readonly matSnackbar: MatSnackBar,
    readonly logger: LoggerService,
    readonly translateService: TranslateService
  ) {
    this.reset();
  }

  reset() {
    this.status = {
      ...cloneDeep(SnackbarStatusDefault),
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

  private getColor(level: LogLevels) {
    let color = 'primary';
    level = level || LogLevels.info;
    switch (level) {
      case LogLevels.critical:
      case LogLevels.error:
        color = 'warn';
        break;
      case LogLevels.warn:
        color = 'accent';
        break;
      case LogLevels.info:
      case LogLevels.debug:
        color = 'primary';
        break;
    }
    return color;
  }

  private logToConsole() {
    this.translateService
      .get(this.status.text)
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe((msgText: string) => {
        switch (this.status.level) {
          case LogLevels.critical:
            this.logger.critical(msgText);
            break;
          case LogLevels.error:
            this.logger.error(msgText);
            break;
          case LogLevels.warn:
            this.logger.warn(msgText);
            break;
          case LogLevels.info:
            this.logger.info(msgText);
            break;
          case LogLevels.debug:
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
    this.translateService
      .get(msg)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedText: string) => {
        config.data = {
          msgText: translatedText,
          msgType,
        };
        this.matSnackbar.openFromComponent(SnackbarComponent, config);
      });
  }

  successSnackBar(msg: string, config?: MatSnackBarConfig) {
    this.openSnackBar(msg, SnackbarType.success, config);
  }

  warnSnackBar(msg: string, config?: MatSnackBarConfig) {
    this.openSnackBar(msg, SnackbarType.warn, config);
  }

  errorSnackBar(msg: string, config?: MatSnackBarConfig) {
    this.openSnackBar(msg, SnackbarType.error, config);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
