// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { ApplicationConfig } from '@fullerstack/ngx-config';
import { LogLevels } from '@fullerstack/ngx-logger';

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

export const environment: Readonly<ApplicationConfig> = {
  version: '0.0.1',
  production: false,
  appName: 'FullerStack',
  logger: { level: LogLevels.debug },
  gql: {
    endpoint: 'http://localhost:4201/graphql',
  },
  gtag: {
    isEnabled: false,
  },
};
