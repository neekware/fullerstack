/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { SecurityConfig } from '@fullerstack/nsx-auth';
import { MailerConfig, MailerProvider, MailerTransport } from '@fullerstack/nsx-mailer';
import { NestApplicationOptions } from '@nestjs/common';
import { ConfigModuleOptions } from '@nestjs/config';
import { GqlModuleOptions } from '@nestjs/graphql';

const serverConfig: NestApplicationOptions = {
  logger: ['error', 'warn', 'log', 'debug', 'verbose'],
};

const appConfig: ConfigModuleOptions = {
  isGlobal: true,
};

const securityConfig: SecurityConfig = {
  accessTokenExpiry: '30s',
  sessionTokenExpiry: '24h',
  bcryptSaltOrRound: 2,
};

const graphqlConfig: GqlModuleOptions = {
  debug: true,
  playground: true,
  sortSchema: true,
  installSubscriptionHandlers: true,
  autoSchemaFile: 'apps/api/src/prisma/schema.gql',
  buildSchemaOptions: {
    numberScalarMode: 'integer',
  },
  cors: {
    credentials: true,
    origin: 'http://localhost:4200',
  },
};

const mailerConfig: MailerConfig = {
  provider: MailerProvider.Postmark,
  transport: MailerTransport.API_KEY,
};

export const environment = {
  production: false,
  port: 4201,
  prefix: 'api',
  serverConfig,
  appConfig,
  graphqlConfig,
  securityConfig,
  mailerConfig,
} as const;
