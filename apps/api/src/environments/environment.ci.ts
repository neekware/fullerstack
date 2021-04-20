import { SecurityConfig } from '@fullerstack/nsx-auth';
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

export const environment = {
  production: false,
  port: 4401,
  prefix: 'api',
  serverConfig,
  appConfig,
  graphqlConfig,
  securityConfig,
} as const;
