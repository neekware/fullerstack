import { SnackbarStatus } from '@fullerstack/ngx-shared';

export interface MessageMap {
  [id: string]: {
    [id: string]: SnackbarStatus;
  };
}
