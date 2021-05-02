import crypto from 'crypto-es';

import { AuthState } from './auth-state.model';

export function signState(state: AuthState): AuthState {
  const { signature, ...newState } = state;
  return {
    ...state,
    ...{
      signature: crypto.MD5(JSON.stringify(newState)).toString(),
    },
  };
}

export function sanitizeState(state: AuthState | string): AuthState | boolean {
  let origState = null;

  if (typeof state === 'string') {
    try {
      origState = JSON.parse(state);
    } catch (e) {
      return false;
    }
  } else {
    origState = state;
  }

  const testState = signState(origState);
  return origState.signature === testState.signature ? origState : false;
}
