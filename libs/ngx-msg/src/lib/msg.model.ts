import { SnackbarStatus } from './snackbar/snackbar.model';

export interface MessageMap {
  [id: string]: {
    [id: string]: SnackbarStatus;
  };
}
