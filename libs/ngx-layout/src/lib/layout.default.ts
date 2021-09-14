/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';

import { LayoutConfig, LayoutState, NavbarMode, SidenavMode, SidenavRole } from './layout.model';

/**
 * Default configuration - Layout module
 */
export const DefaultLayoutConfig: LayoutConfig = {
  logState: false,
};

export const DefaultLayoutState: LayoutState = {
  appName: null,
  isHandset: false,
  isPortrait: false,
  isDarkTheme: false,
  isFullScreen: false,
  isHeadless: false,
  menuOpen: false,
  notifyOpen: false,
  navbarMode: NavbarMode.moveWithScroll,
  menuRole: SidenavRole.navigation,
  menuMode: SidenavMode.side,
  notifyRole: SidenavRole.dialog,
  notifyMode: SidenavMode.over,
  signature: null,
};

export const LayoutNavbarModes = [
  {
    label: _('COMMON.NAVBAR.MOVE_WITH_SCROLL'),
    value: NavbarMode.moveWithScroll,
  },
  {
    label: _('COMMON.NAVBAR.HIDE_ON_SCROLL'),
    value: NavbarMode.hideOnScroll,
  },
  {
    label: _('COMMON.NAVBAR.SHOW_ALWAYS'),
    value: NavbarMode.showAlways,
  },
];
