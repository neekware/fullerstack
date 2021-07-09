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
  logger: ['error', 'warn'],
};

const appConfig: ConfigModuleOptions = {
  isGlobal: true,
};

const securityConfig: SecurityConfig = {
  accessTokenExpiry: '5m',
  sessionTokenExpiry: '7d',
  bcryptSaltOrRound: 10,
};

const graphqlConfig: GqlModuleOptions = {
  debug: true,
  playground: true,
  autoSchemaFile: 'apps/api/src/prisma/schema.gql',
  cors: {
    credentials: true,
    origin: 'http://localhost:4201',
  },
};

const mailerConfig: MailerConfig = {
  provider: 'postmark',
  transport: 'api-key',
};

export const environment = {
  production: false,
  port: 4301,
  prefix: 'api',
  serverConfig,
  appConfig,
  graphqlConfig,
  securityConfig,
  mailerConfig,
} as const;
