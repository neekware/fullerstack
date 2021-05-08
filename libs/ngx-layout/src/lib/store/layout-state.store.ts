import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';

import * as actions from './layout-state.action';
import { DefaultLayoutState } from './layout-state.default';
import { LAYOUT_STATE_KEY, LayoutState } from './layout-state.model';

@State<LayoutState>({
  name: LAYOUT_STATE_KEY,
  defaults: DefaultLayoutState,
})
@Injectable()
export class LayoutStoreState {
  constructor() {}

  @Action([actions.Initialize])
  initializeRequest({ setState }: StateContext<LayoutState>) {
    setState(DefaultLayoutState);
  }

  @Action(actions.SetMenuStatus)
  setMenuStatus({ patchState }: StateContext<LayoutState>, { payload }: actions.SetMenuStatus) {
    patchState({ menuOpen: payload });
  }

  @Action(actions.ToggleMenu)
  toggleMenu({ getState, patchState }: StateContext<LayoutState>) {
    const prevState = getState();
    const nextState = { menuOpen: !prevState.menuOpen };
    if (nextState.menuOpen && prevState.notifyOpen && prevState.isHandset) {
      nextState['notifyOpen'] = false;
    }
    patchState(nextState);
  }

  @Action(actions.SetMenuMode)
  setMenuMode({ patchState }: StateContext<LayoutState>, { payload }: actions.SetMenuMode) {
    patchState({ menuMode: payload });
  }

  @Action(actions.SetMenuRole)
  setMenuRole({ patchState }: StateContext<LayoutState>, { payload }: actions.SetMenuRole) {
    patchState({ menuRole: payload });
  }

  @Action(actions.SetNotifyStatus)
  setNotifyStatus({ patchState }: StateContext<LayoutState>, { payload }: actions.SetNotifyStatus) {
    patchState({ notifyOpen: payload });
  }

  @Action(actions.ToggleNotification)
  toggleNotification({ getState, patchState }: StateContext<LayoutState>) {
    const prevState = getState();
    const nextState = { notifyOpen: !prevState.notifyOpen };
    if (nextState.notifyOpen && prevState.menuOpen && prevState.isHandset) {
      nextState['menuOpen'] = false;
    }
    patchState(nextState);
  }

  @Action(actions.SetNotifyMode)
  setNotifyMode({ patchState }: StateContext<LayoutState>, { payload }: actions.SetNotifyMode) {
    patchState({ notifyMode: payload });
  }

  @Action(actions.SetNotifyRole)
  setNotifyRole({ patchState }: StateContext<LayoutState>, { payload }: actions.SetNotifyRole) {
    patchState({ notifyRole: payload });
  }

  @Action(actions.SetFullscreenStatus)
  setFullscreenStatus(
    { patchState }: StateContext<LayoutState>,
    { payload }: actions.SetFullscreenStatus
  ) {
    patchState({ fullscreenOpen: payload });
  }

  @Action(actions.ToggleFullscreen)
  toggleFullscreen({ getState, patchState }: StateContext<LayoutState>) {
    patchState({ fullscreenOpen: !getState().fullscreenOpen });
  }

  @Action(actions.SetIsHandset)
  setIsHandset({ patchState }: StateContext<LayoutState>, { payload }: actions.SetIsHandset) {
    patchState({ isHandset: payload });
  }

  @Action(actions.SetIsPortrait)
  setIsPortrait({ patchState }: StateContext<LayoutState>, { payload }: actions.SetIsPortrait) {
    patchState({ isPortrait: payload });
  }

  @Action(actions.SetIsDarkTheme)
  setIsDarkTheme({ patchState }: StateContext<LayoutState>, { payload }: actions.SetIsDarkTheme) {
    patchState({ isDarkTheme: payload });
  }

  @Action(actions.SetNavbarMode)
  setNavbarMode({ patchState }: StateContext<LayoutState>, { payload }: actions.SetNavbarMode) {
    patchState({ navbarMode: payload });
  }
}
