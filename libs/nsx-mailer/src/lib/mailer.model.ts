export enum MailerProvider {
  Gmail = 'Gmail',
  Postmark = 'Postmark',
  SendGrid = 'SendGrid',
  AmazonSES = 'AmazonSES',
}

export enum MailerTransport {
  SMTP = 'SMTP',
  SMTP_SSL = 'SMTP_SSL',
  API_KEY = 'API_KEY',
}

export interface MailerConfig {
  provider: MailerProvider | string;
  transport: MailerTransport | string;
}
