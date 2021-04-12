import { ApplicationConfig } from '@fullerstack/ngx-config';
import { LogLevels } from '@fullerstack/ngx-logger';

export const environment: Readonly<ApplicationConfig> = {
  version: '0.0.1',
  production: true,
  appName: 'FullerStack',
  logger: { level: LogLevels.error },
};
