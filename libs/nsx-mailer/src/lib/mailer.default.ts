/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { MailerConfig, MailerProvider, MailerTransport } from './mailer.model';

export const DefaultMailerConfig: MailerConfig = {
  // The default mailer configuration
  provider: MailerProvider.Postmark,
  transport: MailerTransport.API_KEY,
};
