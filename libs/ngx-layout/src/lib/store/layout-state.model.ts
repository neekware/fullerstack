export const LAYOUT_STATE_KEY = 'layout';

export enum NavMode {
  'over' = 'over',
  'side' = 'side',
}

export enum NavRole {
  'dialog' = 'dialog',
  'navigation' = 'navigation',
}

export interface LayoutState {
  menuRole: NavRole;
  menuMode: NavMode;
  menuOpen: boolean;
  notifyRole: NavRole;
  notifyMode: NavMode;
  notifyOpen: boolean;
  fullScreenOpen: boolean;
}
