/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { I18nModule } from '@fullerstack/nsx-i18n';
import { MailerModule } from '@fullerstack/nsx-mailer';
import { PrismaModule } from '@fullerstack/nsx-prisma';
import { Global, Module } from '@nestjs/common';

import { AuthGuardGql } from './auth.guard.gql';
import { AuthGuardPermission } from './auth.guard.permission';
import { AuthGuardRole } from './auth.guard.role';
import { AuthResolver } from './auth.resolver';
import { SecurityService } from './auth.security.service';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [PrismaModule, I18nModule, MailerModule],
  providers: [
    SecurityService,
    AuthService,
    AuthGuardRole,
    AuthGuardPermission,
    AuthResolver,
    AuthGuardGql,
  ],
  exports: [
    SecurityService,
    AuthService,
    AuthGuardRole,
    AuthGuardPermission,
    AuthGuardGql,
    AuthResolver,
  ],
})
export class AuthModule {}
