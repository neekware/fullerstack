import { MailerConfig, MailerProvider, MailerTransport } from './mailer.model';

export const DefaultMailerConfig: MailerConfig = {
  // The default mailer configuration
  provider: MailerProvider.Postmark,
  transport: MailerTransport.API_KEY,
};
