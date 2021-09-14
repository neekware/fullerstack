/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/**
 * Layout config declaration
 */
export interface LayoutConfig {
  logState?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [id: string]: any;
}

export enum NavbarMode {
  hideOnScroll = 'hideOnScroll',
  moveWithScroll = 'moveWithScroll',
  showAlways = 'showAlways',
}

export enum SidenavMode {
  over = 'over',
  side = 'side',
  push = 'push',
}

export enum SidenavRole {
  main = 'main',
  region = 'region',
  dialog = 'dialog',
  navigation = 'navigation',
  directory = 'directory',
}

export interface LayoutState {
  appName: string;
  isHandset: boolean;
  isPortrait: boolean;
  isDarkTheme: boolean;
  isFullScreen: boolean;
  isHeadless: boolean;
  menuOpen: boolean;
  notifyOpen: boolean;
  navbarMode: NavbarMode;
  menuRole: SidenavRole;
  menuMode: SidenavMode;
  notifyRole: SidenavRole;
  notifyMode: SidenavMode;
  signature: string;
}
