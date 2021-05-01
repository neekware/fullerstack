import { NavRole, NavMode } from './layout-state.model';

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
  constructor(readonly payload: NavRole) {}
}
export class SetMenuMode {
  static type = '[LAYOUT] SetMenuMode';
  constructor(readonly payload: NavMode) {}
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
  constructor(readonly payload: NavRole) {}
}
export class SetNotifyMode {
  static type = '[LAYOUT] SetNotifyMode';
  constructor(readonly payload: NavMode) {}
}
export class SetFullscreenStatus {
  static type = '[LAYOUT] SetFullscreenStatus';
  constructor(readonly payload: boolean) {}
}
export class ToggleFullscreen {
  static type = '[LAYOUT] ToggleFullscreen';
}
