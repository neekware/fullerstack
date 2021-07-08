import {} from 'postmark/dist/client/models';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { merge as ldNestMerge } from 'lodash';
import { createTransport } from 'nodemailer';
import { Client as PostmarkClient, Message as PostmarkMessage } from 'postmark';
import { DeepReadonly } from 'ts-essentials';

import { DefaultMailerConfig } from './mailer.default';
import { MailerConfig, MailerProvider } from './mailer.model';

@Injectable()
export class MailerService {
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
        const user = this.config.get<string>('MAILER_API_USERNAME');
        const pass = this.config.get<string>('MAILER_API_PASSWORD');
        return createTransport({
          service: MailerProvider.Gmail,
          auth: { user, pass },
        });
      case MailerProvider.Postmark:
        const apiKey = this.config.get<string>('MAILER_API_KEY');
        return new PostmarkClient(apiKey);
    }
  }

  sendGmail(from: string, to: string, subject: string, text: string) {
    this.mailer.sendMail({ from, to, subject, text });
  }

  async sendPostmark(message: PostmarkMessage) {
    await this.mailer.sendMail(message);
  }
}
