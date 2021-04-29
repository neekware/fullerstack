import { LogLevels } from '@fullerstack/ngx-logger';

export class SnackbarStatus {
  // simple public message for end user. (what happened, what next)
  text: string;
  // detailed private message to help with debugging
  detail?: string;
  // unique message code pinpoint to line of code
  code?: string;
  // log level
  level?: LogLevels;
  // color of message
  color?: string;
  // log it to console
  console?: boolean;
  // log it to remote server(s)
  remote?: boolean;
}
