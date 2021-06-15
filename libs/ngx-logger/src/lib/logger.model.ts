import { DeepReadonly } from 'ts-essentials';

/**
 * Log config declaration
 */
export interface LoggerConfig {
  level: number;
}

/**
 * Log level
 * Each level enables itself and all level(s) above
 */
export enum LogLevels {
  ignore = 0,
  critical,
  error,
  warn,
  info,
  debug,
  trace,
  none,
}

/**
 * Log level name - order is important
 */
export const LogNames: DeepReadonly<string[]> = [
  'CRITICAL',
  'ERROR',
  'WARN',
  'INFO',
  'DEBUG',
  'TRACE',
];

/**
 * Log level colors - order is important
 */
export const LogColors: DeepReadonly<string[]> = [
  'red',
  'OrangeRed ',
  'orange',
  'teal',
  'SlateGrey',
  'LightBlue',
];
