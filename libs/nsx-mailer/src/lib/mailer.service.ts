/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { cloneDeep as ldDeepClone, mergeWith as ldMergeWith } from 'lodash';
import * as nodemailer from 'nodemailer';
import { DeepReadonly } from 'ts-essentials';

import { DefaultMailerConfig } from './mailer.default';
import { MailerConfig, MailerMessage } from './mailer.model';

@Injectable()
export class MailerService implements OnModuleDestroy {
  readonly options: DeepReadonly<MailerConfig> = DefaultMailerConfig;
  private transporter: any;

  constructor(readonly config: ConfigService) {
    this.options = ldMergeWith(
      ldDeepClone(this.options),
      this.config.get<MailerConfig>('appConfig.mailerConfig'),
      (dest, src) => (Array.isArray(dest) ? src : undefined)
    );

    this.createMailerInstance();
  }

  private createMailerInstance() {
    const user = this.config.get<string>('MAILER_SMTP_USERNAME');
    const pass = this.config.get<string>('MAILER_SMTP_PASSWORD');

    this.transporter = nodemailer.createTransport({
      host: this.options.host,
      port: this.options.port,
      secure: this.options.secureConnection,
      auth: { user, pass },
    });
  }

  sendMail(message: MailerMessage) {
    return this.transporter.sendMail(message);
  }

  async onModuleDestroy() {
    this.transporter = null;
  }
}
