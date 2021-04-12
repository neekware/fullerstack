/**
 * Log config declaration
 */
export interface LoggerConfig {
  logger: {
    level?: number;
  };
}

/**
 * Log level
 * Each level enables itself and all level(s) above
 */
export enum LogLevels {
  critical = 0,
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
export const LogNames = ['CRITICAL', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'];

/**
 * Log level colors - order is important
 */
export const LogColors = [
  'red',
  'OrangeRed ',
  'orange',
  'teal',
  'SlateGrey',
  'LightBlue',
];
