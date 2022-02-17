/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { AuthModule } from '@fullerstack/nsx-auth';
import { HttpRequest, HttpResponse } from '@fullerstack/nsx-common';
import { MailerModule } from '@fullerstack/nsx-mailer';
import { PrismaModule } from '@fullerstack/nsx-prisma';
import { SystemModule } from '@fullerstack/nsx-system';
import { UserModule } from '@fullerstack/nsx-user';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { environment } from '../environments/environment';
import { appConfiguration } from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      ...environment.appConfig,
      load: [appConfiguration],
    }),
    PrismaModule,
    MailerModule,
    SystemModule,
    AuthModule,
    UserModule,
    GraphQLModule.forRoot({
      ...environment.graphqlConfig,
      context: ({ req, res }) => ({
        request: req as HttpRequest,
        response: res as HttpResponse,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [ConfigService, AppService],
  exports: [ConfigService],
})
export class AppModule {}
