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
