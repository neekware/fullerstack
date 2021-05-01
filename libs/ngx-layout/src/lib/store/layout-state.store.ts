import { State, Action, StateContext } from '@ngxs/store';

import { LayoutState, LAYOUT_STATE_KEY } from './layout-state.model';
import { LayoutDefaultState } from './layout-state.default';
import * as actions from './layout-state.action';
import { Injectable } from '@angular/core';

@State<LayoutState>({
  name: LAYOUT_STATE_KEY,
  defaults: LayoutDefaultState,
})
@Injectable()
export class LayoutStoreState {
  constructor() {}

  @Action([actions.Initialize])
  initializeRequest({ setState }: StateContext<LayoutState>) {
    setState(LayoutDefaultState);
  }

  @Action(actions.SetMenuStatus)
  setMenuStatus(
    { patchState }: StateContext<LayoutState>,
    { payload }: actions.SetMenuStatus
  ) {
    patchState({ menuOpen: payload });
  }

  @Action(actions.ToggleMenu)
  toggleMenu({ getState, patchState }: StateContext<LayoutState>) {
    patchState({ menuOpen: !getState().menuOpen });
  }

  @Action(actions.SetMenuMode)
  setMenuMode(
    { patchState }: StateContext<LayoutState>,
    { payload }: actions.SetMenuMode
  ) {
    patchState({ menuMode: payload });
  }

  @Action(actions.SetMenuRole)
  setMenuRole(
    { patchState }: StateContext<LayoutState>,
    { payload }: actions.SetMenuRole
  ) {
    patchState({ menuRole: payload });
  }

  @Action(actions.SetNotifyStatus)
  setNotifyStatus(
    { patchState }: StateContext<LayoutState>,
    { payload }: actions.SetNotifyStatus
  ) {
    patchState({ notifyOpen: payload });
  }

  @Action(actions.ToggleNotification)
  toggleNotification({ getState, patchState }: StateContext<LayoutState>) {
    patchState({ notifyOpen: !getState().notifyOpen });
  }

  @Action(actions.SetNotifyMode)
  setNotifyMode(
    { patchState }: StateContext<LayoutState>,
    { payload }: actions.SetNotifyMode
  ) {
    patchState({ notifyMode: payload });
  }

  @Action(actions.SetNotifyRole)
  setNotifyRole(
    { patchState }: StateContext<LayoutState>,
    { payload }: actions.SetNotifyRole
  ) {
    patchState({ notifyRole: payload });
  }

  @Action(actions.SetFullscreenStatus)
  setFullscreenStatus(
    { patchState }: StateContext<LayoutState>,
    { payload }: actions.SetFullscreenStatus
  ) {
    patchState({ fullScreenOpen: payload });
  }

  @Action(actions.ToggleFullscreen)
  toggleFullscreen({ getState, patchState }: StateContext<LayoutState>) {
    const state: LayoutState = getState();
    patchState({ fullScreenOpen: !getState().fullScreenOpen });
  }
}
