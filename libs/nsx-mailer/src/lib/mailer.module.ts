/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { I18nModule } from '@fullerstack/nsx-i18n';
import { Module } from '@nestjs/common';

import { MailerService } from './mailer.service';

@Module({
  imports: [I18nModule],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
