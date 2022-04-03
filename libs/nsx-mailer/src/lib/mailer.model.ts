/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

export interface MailerConfig {
  providerName: string;
  host: string;
  secureConnection: boolean;
  port: number;
  auth?: {
    user: string;
    pass: string;
  };
}

export declare class MailerMessage {
  from: string;
  to: string;
  subject: string;
  html?: string;
  text?: string;
  replayTo?: string;
  cC?: string;
  bCc?: string;
}
