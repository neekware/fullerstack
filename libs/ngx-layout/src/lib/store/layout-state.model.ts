export const LAYOUT_STATE_KEY = 'layout';

export enum NavbarMode {
  'hideOnScroll' = 'hideOnScroll',
  'moveWithScroll' = 'moveWithScroll',
  'showAlways' = 'showAlways',
}

export enum SidenavMode {
  'over' = 'over',
  'side' = 'side',
  'push' = 'push',
}

export enum SidenavRole {
  'main' = 'main',
  'region' = 'region',
  'dialog' = 'dialog',
  'navigation' = 'navigation',
  'directory' = 'directory',
}
export interface LayoutState {
  signature: string;
  isHandset: boolean;
  isPortrait: boolean;
  isDarkTheme: boolean;
  navbarMode: NavbarMode;
  menuRole: SidenavRole;
  menuMode: SidenavMode;
  menuOpen: boolean;
  notifyRole: SidenavRole;
  notifyMode: SidenavMode;
  notifyOpen: boolean;
  fullscreenOpen: boolean;
}
