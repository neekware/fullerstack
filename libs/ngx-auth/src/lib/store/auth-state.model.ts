export interface AuthState {
  signature: string;
  isLoggedIn: boolean;
  isRegistering: boolean;
  isAuthenticating: boolean;
  isRefreshingToken: boolean;
  hasError: boolean;
  token: string;
}

export interface AuthLoginCredentials {
  email: string;
  password: string;
}

export interface AuthRegisterCredentials extends AuthLoginCredentials {
  firstName: string;
  lastName?: string;
  language?: string;
}
