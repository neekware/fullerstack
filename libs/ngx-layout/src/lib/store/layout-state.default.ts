/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { LayoutState, NavbarMode, SidenavMode, SidenavRole } from './layout-state.model';

export const DefaultLayoutState: LayoutState = {
  signature: null,
  appName: null,
  isHandset: false,
  isPortrait: false,
  isDarkTheme: false,
  navbarMode: NavbarMode.moveWithScroll,
  menuOpen: false,
  menuMode: SidenavMode.side,
  menuRole: SidenavRole.navigation,
  notifyOpen: false,
  notifyMode: SidenavMode.over,
  notifyRole: SidenavRole.dialog,
  fullscreenOpen: false,
};
