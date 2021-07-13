/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { MailerConfig } from './mailer.model';

export const DefaultMailerConfig: MailerConfig = {
  // The default mailer configuration
  provider: 'postmark',
  host: 'smtp.postmarkapp.com',
  transportMethod: 'smtp',
  secureConnection: true,
  port: 587,
};
