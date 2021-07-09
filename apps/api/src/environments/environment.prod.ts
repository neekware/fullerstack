/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { SecurityConfig } from '@fullerstack/nsx-auth';
import { I18nConfig } from '@fullerstack/nsx-i18n';
import { MailerConfig } from '@fullerstack/nsx-mailer';
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
  provider: 'Postmark',
  transport: 'API_KEY',
};

const i18nConfig: I18nConfig = {
  defaultLanguage: 'en',
  availableLanguages: ['de', 'en', 'es', 'fa', 'fr', 'he', 'zh-hans'],
  enabledLanguages: ['de', 'en', 'es', 'fa', 'fr', 'he', 'zh-hans'],
  translationDirectory: 'assets/i18n/',
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
  i18nConfig,
} as const;
