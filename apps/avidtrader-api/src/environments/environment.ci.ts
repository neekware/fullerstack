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
  autoSchemaFile: 'apps/avidtrader-api/src/prisma/schema.gql',
  cors: {
    credentials: true,
    origin: 'http://localhost:4201',
  },
};

const mailerConfig: MailerConfig = {
  providerName: 'postmark',
  host: 'smtp.postmarkapp.com',
  secureConnection: false, // true for port 465, false for port 587
  port: 587,
};

const i18nConfig: I18nConfig = {
  defaultLocale: 'en',
  availableLocales: ['de', 'en', 'es', 'fa', 'fr', 'he', 'zh-hans'],
  enabledLocales: ['de', 'en', 'es', 'fa', 'fr', 'he', 'zh-hans'],
  translationDirectory: 'assets/i18n/',
};

export const environment = {
  siteName: 'Avidtrader',
  siteUrl: 'https://fe-avidtrader.co',
  siteSupportEmail: 'support@fe-avidtrader.co',
  production: false,
  port: 4401,
  prefix: 'avidtrader-api',
  serverConfig,
  appConfig,
  graphqlConfig,
  securityConfig,
  mailerConfig,
  i18nConfig,
} as const;
