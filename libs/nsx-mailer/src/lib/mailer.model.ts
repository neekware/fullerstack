/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

export type MailerProvider = 'Gmail' | 'Postmark' | 'SendGrid' | 'AmazonSES';

export type MailerTransport = 'SMTP' | 'API_KEY';

export interface MailerConfig {
  provider: MailerProvider;
  transport: MailerTransport;
}
