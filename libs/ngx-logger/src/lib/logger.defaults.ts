import { DeepReadonly } from 'ts-essentials';
import { LoggerConfig, LogLevels } from './logger.models';

/**
 * Default configuration - logger module
 */
export const DefaultLoggerConfig: DeepReadonly<LoggerConfig> = {
  logger: {
    level: LogLevels.none,
  },
};
