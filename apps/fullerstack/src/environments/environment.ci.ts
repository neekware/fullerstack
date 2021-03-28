import { ApplicationCfg } from '@fullerstack/ngx-cfg';
import { LogLevels } from '@fullerstack/ngx-logger';

export const environment: Readonly<ApplicationCfg> = {
  version: '0.0.1',
  production: true,
  appName: 'FullerStack',
  logger: { level: LogLevels.error },
};
