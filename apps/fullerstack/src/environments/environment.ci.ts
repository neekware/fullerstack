/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { CachifyConfig } from '@fullerstack/ngx-cachify';
import { ApplicationConfig } from '@fullerstack/ngx-config';
import { GqlConfig } from '@fullerstack/ngx-gql';
import { GTagConfig } from '@fullerstack/ngx-gtag';
import { LogLevels, LoggerConfig } from '@fullerstack/ngx-logger';

const logger: LoggerConfig = {
  level: LogLevels.error,
} as const;

const gql: GqlConfig = {
  endpoint: 'http://localhost:4201/graphql',
} as const;

const gtag: GTagConfig = {
  trackingId: 'U-something',
  isEnabled: false,
} as const;

const cachify: CachifyConfig = {
  disabled: false,
  immutable: false,
  ttl: 60, // 1 minute
} as const;

export const environment: Readonly<ApplicationConfig> = {
  version: '0.0.1',
  production: false,
  appName: 'FullerStack-CI',
  logger,
  gql,
  gtag,
  cachify,
};
