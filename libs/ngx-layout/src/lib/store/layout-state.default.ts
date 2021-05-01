import { LayoutState, NavMode, NavRole } from './layout-state.model';

export const LayoutDefaultState: LayoutState = {
  menuMode: NavMode.side,
  menuRole: NavRole.dialog,
  menuOpen: true,
  notifyMode: NavMode.over,
  notifyRole: NavRole.dialog,
  notifyOpen: false,
  fullScreenOpen: false,
};
