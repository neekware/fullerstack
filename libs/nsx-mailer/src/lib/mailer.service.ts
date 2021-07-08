/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { merge as ldNestMerge } from 'lodash';
import { createTransport } from 'nodemailer';
import { Client as PostmarkClient, Message as PostmarkMessage } from 'postmark';
import { DeepReadonly } from 'ts-essentials';

import { DefaultMailerConfig } from './mailer.default';
import { MailerConfig, MailerProvider } from './mailer.model';

@Injectable()
export class MailerService implements OnModuleDestroy {
  readonly options: DeepReadonly<MailerConfig> = DefaultMailerConfig;
  private mailer: any;

  constructor(readonly config: ConfigService) {
    this.options = ldNestMerge(
      { ...this.options },
      this.config.get<MailerConfig>('appConfig.mailerConfig')
    );

    this.mailer = this.createMailerInstance();
  }

  private async createMailerInstance() {
    switch (this.options.provider) {
      case MailerProvider.Gmail:
        return createTransport({
          service: MailerProvider.Gmail,
          auth: {
            user: this.config.get<string>('MAILER_API_USERNAME'),
            pass: this.config.get<string>('MAILER_API_PASSWORD'),
          },
        });
      case MailerProvider.Postmark:
        return new PostmarkClient(this.config.get<string>('MAILER_API_KEY'));
    }
  }

  sendGmail(from: string, to: string, subject: string, text: string) {
    this.mailer.sendMail({ from, to, subject, text });
  }

  async sendPostmark(message: PostmarkMessage) {
    await this.mailer.sendMail(message);
  }

  async onModuleDestroy() {
    this.mailer = null;
  }
}
