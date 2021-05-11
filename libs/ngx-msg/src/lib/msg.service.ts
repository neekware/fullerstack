import { Directionality } from '@angular/cdk/bidi';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { LogLevels, LoggerService } from '@fullerstack/ngx-logger';
import {
  SnackbarComponent,
  SnackbarStatus,
  SnackbarStatusDefault,
  SnackbarType,
} from '@fullerstack/ngx-shared';
import { TranslateService } from '@ngx-translate/core';
import { DeepReadonly } from 'ts-essentials';

@Injectable()
export class MsgService {
  private status: DeepReadonly<SnackbarStatus> = SnackbarStatusDefault;

  constructor(
    readonly dir: Directionality,
    readonly matSnackbar: MatSnackBar,
    readonly logger: LoggerService,
    readonly translate: TranslateService
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
      ...{
        msg,
        color: this.getColor(msg.level),
        console: msg?.console,
      },
    };
    if (this.status.console) {
      this.logToConsole();
    }
  }

  private getColor(level: LogLevels) {
    let color = 'primary';
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
    this.translate.get(this.status.text).subscribe((translatedText: string) => {
      switch (this.status.level) {
        case LogLevels.critical:
          this.logger.critical(translatedText);
          break;
        case LogLevels.error:
          this.logger.error(translatedText);
          break;
        case LogLevels.warn:
          this.logger.warn(translatedText);
          break;
        case LogLevels.info:
          this.logger.info(translatedText);
          break;
        case LogLevels.debug:
          this.logger.debug(translatedText);
          break;
      }
    });
  }

  private openSnackBar(msg: string, msgType: SnackbarType, config?: MatSnackBarConfig) {
    msg = msg || this.status.text;
    config = {
      ...{
        duration: 2000,
        direction: this.dir.value,
        horizontalPosition: this.dir.value === 'ltr' ? 'left' : 'right',
      },
      ...(config || {}),
    };
    this.translate.get(msg).subscribe((translatedText: string) => {
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
}
