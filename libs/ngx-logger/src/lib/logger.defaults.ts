import { LoggerConfig, LogLevels } from './logger.models';

/**
 * Default configuration - logger module
 */
export const DefaultLoggerConfig: LoggerConfig = {
  logger: {
    level: LogLevels.none,
  },
};
