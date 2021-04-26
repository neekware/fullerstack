import { DeepReadonly } from 'ts-essentials';
import { LoggerConfig, LogLevels } from './logger.model';

/**
 * Default configuration - logger module
 */
export const DefaultLoggerConfig: DeepReadonly<LoggerConfig> = {
  level: LogLevels.none,
};
