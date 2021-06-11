import { CachifyConfig } from '@fullerstack/ngx-cachify';
import { ApplicationConfig } from '@fullerstack/ngx-config';
import { GqlConfig } from '@fullerstack/ngx-gql';
import { GTagConfig } from '@fullerstack/ngx-gtag';
import { LogLevels, LoggerConfig } from '@fullerstack/ngx-logger';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

const logger: LoggerConfig = {
  level: LogLevels.debug,
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
  immutable: true,
  ttl: 30, // 30 seconds
} as const;

export const environment: Readonly<ApplicationConfig> = {
  version: '0.0.1',
  production: false,
  appName: 'FullerStack-Dev',
  logger,
  gql,
  gtag,
  cachify,
};
