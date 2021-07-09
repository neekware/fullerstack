/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Module } from '@nestjs/common';

import { I18nService } from './i18n.service';

@Module({
  providers: [I18nService],
  exports: [I18nService],
})
export class I18nModule {}
