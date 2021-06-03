export interface AuthState {
  signature: string;
  isLoggedIn: boolean;
  isRegistering: boolean;
  isAuthenticating: boolean;
  hasError: boolean;
}
