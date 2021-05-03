import {
  LayoutState,
  SidenavMode,
  SidenavRole,
  NavbarMode,
} from './layout-state.model';

export const DefaultLayoutState: LayoutState = {
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
