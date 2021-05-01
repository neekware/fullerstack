import { DeepReadonly } from 'ts-essentials';

import { AuthState } from './auth-state.model';
import { signState } from './auth-state.util';

export const AuthDefaultState: DeepReadonly<AuthState> = signState({
  signature: null,
  isLoggedIn: false,
  isRegistering: false,
  isAuthenticating: false,
  isRefreshingToken: false,
  hasError: false,
  token: null,
});
