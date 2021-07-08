/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { AuthModule } from '@fullerstack/nsx-auth';
import { MailerModule } from '@fullerstack/nsx-mailer';
import { PrismaModule } from '@fullerstack/nsx-prisma';
import { Global, Module } from '@nestjs/common';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [AuthModule, PrismaModule, MailerModule],
  providers: [UserService, UserResolver],
  exports: [UserService, UserResolver],
})
export class UserModule {}
