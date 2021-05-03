import { SidenavRole, SidenavMode, NavbarMode } from './layout-state.model';

export class Initialize {
  static type = '[LAYOUT] Initialize';
}
export class SetMenuStatus {
  static type = '[LAYOUT] SetMenuStatus';
  constructor(readonly payload: boolean) {}
}
export class ToggleMenu {
  static type = '[LAYOUT] ToggleMenu';
}
export class SetMenuRole {
  static type = '[LAYOUT] SetMenuRole';
  constructor(readonly payload: SidenavRole) {}
}
export class SetMenuMode {
  static type = '[LAYOUT] SetMenuMode';
  constructor(readonly payload: SidenavMode) {}
}
export class SetNotifyStatus {
  static type = '[LAYOUT] SetNotifyStatus';
  constructor(readonly payload: boolean) {}
}
export class ToggleNotification {
  static type = '[LAYOUT] ToggleNotification';
}
export class SetNotifyRole {
  static type = '[LAYOUT] SetNotifyRole';
  constructor(readonly payload: SidenavRole) {}
}
export class SetNotifyMode {
  static type = '[LAYOUT] SetNotifyMode';
  constructor(readonly payload: SidenavMode) {}
}
export class SetFullscreenStatus {
  static type = '[LAYOUT] SetFullscreenStatus';
  constructor(readonly payload: boolean) {}
}
export class ToggleFullscreen {
  static type = '[LAYOUT] ToggleFullscreen';
}
export class SetIsHandset {
  static type = '[LAYOUT] SetIsHandset';
  constructor(readonly payload: boolean) {}
}
export class SetIsPortrait {
  static type = '[LAYOUT] SetIsPortrait';
  constructor(readonly payload: boolean) {}
}
export class SetNavbarMode {
  static type = '[LAYOUT] SetNavbarMode';
  constructor(readonly payload: NavbarMode) {}
}
export class SetIsDarkTheme {
  static type = '[LAYOUT] SetIsDarkTheme';
  constructor(readonly payload: boolean) {}
}
