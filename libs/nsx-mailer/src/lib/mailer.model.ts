/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

export interface MailerConfig {
  providerName: string;
  auth?: {
    user: string;
    pass: string;
  };
  port: 587;
  host: string;
  secureConnection: boolean;
}

export declare class MailerMessage {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  replayTo?: string;
  cC?: string;
  bCc?: string;
}
