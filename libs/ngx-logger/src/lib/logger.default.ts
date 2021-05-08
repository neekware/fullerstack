import { DeepReadonly } from 'ts-essentials';

import { LogLevels, LoggerConfig } from './logger.model';

/**
 * Default configuration - logger module
 */
export const DefaultLoggerConfig: DeepReadonly<LoggerConfig> = {
  level: LogLevels.none,
};
