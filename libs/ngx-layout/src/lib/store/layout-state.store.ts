import { Injectable } from '@angular/core';
import { signObject } from '@fullerstack/ngx-util';
import { Action, State, StateContext } from '@ngxs/store';

import * as actions from './layout-state.action';
import { DefaultLayoutState } from './layout-state.default';
import { LAYOUT_STATE_KEY, LayoutState } from './layout-state.model';

@State<LayoutState>({
  name: LAYOUT_STATE_KEY,
  defaults: DefaultLayoutState,
})
@Injectable({ providedIn: 'root' })
export class LayoutStoreState {
  @Action(actions.Initialize, { cancelUncompleted: true })
  initializeLayout({ setState }: StateContext<LayoutState>, { payload }: actions.Initialize) {
    setState(
      signObject<LayoutState>({ ...DefaultLayoutState, appName: payload })
    );
  }

  @Action(actions.SetMenuStatus, { cancelUncompleted: true })
  setMenuStatus(
    { getState, patchState }: StateContext<LayoutState>,
    { payload }: actions.SetMenuStatus
  ) {
    patchState(
      signObject<LayoutState>({ ...getState(), menuOpen: payload })
    );
  }

  @Action(actions.ToggleMenu, { cancelUncompleted: true })
  toggleMenu({ getState, patchState }: StateContext<LayoutState>) {
    const prevState = getState();
    const nextState = { menuOpen: !prevState.menuOpen };
    if (nextState.menuOpen && prevState.notifyOpen && prevState.isHandset) {
      nextState['notifyOpen'] = false;
    }
    patchState(
      signObject<LayoutState>({ ...prevState, ...nextState })
    );
  }

  @Action(actions.SetMenuMode, { cancelUncompleted: true })
  setMenuMode(
    { getState, patchState }: StateContext<LayoutState>,
    { payload }: actions.SetMenuMode
  ) {
    patchState(
      signObject<LayoutState>({ ...getState(), menuMode: payload })
    );
  }

  @Action(actions.SetMenuRole, { cancelUncompleted: true })
  setMenuRole(
    { getState, patchState }: StateContext<LayoutState>,
    { payload }: actions.SetMenuRole
  ) {
    patchState(
      signObject<LayoutState>({ ...getState(), menuRole: payload })
    );
  }

  @Action(actions.SetNotifyStatus, { cancelUncompleted: true })
  setNotifyStatus(
    { getState, patchState }: StateContext<LayoutState>,
    { payload }: actions.SetNotifyStatus
  ) {
    patchState(
      signObject<LayoutState>({ ...getState(), notifyOpen: payload })
    );
  }

  @Action(actions.ToggleNotification, { cancelUncompleted: true })
  toggleNotification({ getState, patchState }: StateContext<LayoutState>) {
    const prevState = getState();
    const nextState = { notifyOpen: !prevState.notifyOpen };
    if (nextState.notifyOpen && prevState.menuOpen && prevState.isHandset) {
      nextState['menuOpen'] = false;
    }
    patchState(
      signObject<LayoutState>({ ...getState(), ...nextState })
    );
  }

  @Action(actions.SetNotifyMode, { cancelUncompleted: true })
  setNotifyMode(
    { getState, patchState }: StateContext<LayoutState>,
    { payload }: actions.SetNotifyMode
  ) {
    patchState(
      signObject<LayoutState>({ ...getState(), notifyMode: payload })
    );
  }

  @Action(actions.SetNotifyRole, { cancelUncompleted: true })
  setNotifyRole(
    { getState, patchState }: StateContext<LayoutState>,
    { payload }: actions.SetNotifyRole
  ) {
    patchState(
      signObject<LayoutState>({ ...getState(), notifyRole: payload })
    );
  }

  @Action(actions.SetFullscreenStatus, { cancelUncompleted: true })
  setFullscreenStatus(
    { getState, patchState }: StateContext<LayoutState>,
    { payload }: actions.SetFullscreenStatus
  ) {
    patchState(
      signObject<LayoutState>({ ...getState(), fullscreenOpen: payload })
    );
  }

  @Action(actions.ToggleFullscreen, { cancelUncompleted: true })
  toggleFullscreen({ getState, patchState }: StateContext<LayoutState>) {
    patchState(
      signObject<LayoutState>({ ...getState(), fullscreenOpen: !getState().fullscreenOpen })
    );
  }

  @Action(actions.SetIsHandset, { cancelUncompleted: true })
  setIsHandset(
    { getState, patchState }: StateContext<LayoutState>,
    { payload }: actions.SetIsHandset
  ) {
    patchState(
      signObject<LayoutState>({ ...getState(), isHandset: payload })
    );
  }

  @Action(actions.SetIsPortrait, { cancelUncompleted: true })
  setIsPortrait(
    { getState, patchState }: StateContext<LayoutState>,
    { payload }: actions.SetIsPortrait
  ) {
    patchState(
      signObject<LayoutState>({ ...getState(), isPortrait: payload })
    );
  }

  @Action(actions.SetIsDarkTheme, { cancelUncompleted: true })
  setIsDarkTheme(
    { getState, patchState }: StateContext<LayoutState>,
    { payload }: actions.SetIsDarkTheme
  ) {
    patchState(
      signObject<LayoutState>({ ...getState(), isDarkTheme: payload })
    );
  }

  @Action(actions.SetNavbarMode, { cancelUncompleted: true })
  setNavbarMode(
    { getState, patchState }: StateContext<LayoutState>,
    { payload }: actions.SetNavbarMode
  ) {
    patchState(
      signObject<LayoutState>({ ...getState(), navbarMode: payload })
    );
  }
}
