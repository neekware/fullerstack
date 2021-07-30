/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Injectable } from '@angular/core';
import { AuthService } from '@fullerstack/ngx-auth';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@fullerstack/ngx-config';
import { GqlErrorsHandler, GqlService } from '@fullerstack/ngx-gql';
import { SystemContactUsMutation } from '@fullerstack/ngx-gql/operations';
import { SystemContactUsInput, SystemStatus } from '@fullerstack/ngx-gql/schema';
import { I18nService, i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { LogLevel, LoggerService } from '@fullerstack/ngx-logger';
import { MsgService } from '@fullerstack/ngx-msg';
import { Observable, Subject, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DeepReadonly } from 'ts-essentials';

@Injectable({
  providedIn: 'root',
})
export class SystemService {
  private nameSpace = 'SYSTEM';
  private destroy$ = new Subject<boolean>();
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;

  constructor(
    readonly config: ConfigService,
    readonly msg: MsgService,
    readonly gql: GqlService,
    readonly logger: LoggerService,
    readonly i18n: I18nService,
    readonly auth: AuthService
  ) {}

  systemContactUsMutate$(input: SystemContactUsInput): Observable<SystemStatus> {
    this.msg.reset();
    this.logger.debug(`[${this.nameSpace}] Contact message sent ...`);

    return this.gql.client.request<SystemStatus>(SystemContactUsMutation, { input }).pipe(
      map((resp) => {
        if (resp.ok) {
          this.logger.debug(`[${this.nameSpace}] Contact message  success ...`);
          this.msg.setMsg({ text: _('SUCCESS.CONTACT.MESSAGE.SENT'), level: LogLevel.success });
          this.msg.successToast('INFO.CONTACT_MESSAGE_SENT', { duration: 5000 });
          return resp;
        } else {
          const message = resp?.message || _('ERROR.CONTACT.MESSAGE.SENT');
          this.logger.error(`[${this.nameSpace}] Contact message  failed ...`, message);
          this.msg.setMsg({ text: message, level: LogLevel.error });
          return { ...resp, message: resp.message || message };
        }
      }),
      catchError((err: GqlErrorsHandler) => {
        const errorMessage = err.topError?.message || _('ERROR.CONTACT.MESSAGE.SENT');
        this.logger.error(`[${this.nameSpace}] Contact message  failed ...`, err);
        this.msg.setMsg({ text: errorMessage, level: LogLevel.error });
        return of({ ok: false, message: errorMessage } as SystemStatus);
      })
    );
  }
}
