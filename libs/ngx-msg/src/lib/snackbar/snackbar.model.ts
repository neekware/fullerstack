export enum SnackbarType {
  'error' = 'error',
  'warn' = 'warn',
  'success' = 'success',
}

export interface SnackbarData {
  msgText: string;
  msgType: SnackbarType;
  textColor?: string;
  svgIcon?: string;
  iconColor?: string;
}

export const SnackbarDataDefault = {
  msgText: undefined,
  msgType: SnackbarType.success,
  textColor: 'white',
  svgIcon: undefined,
  iconColor: 'white',
};
