import { getOperationName } from '@fullerstack/ngx-gql';
import { AuthLogoutMutation, AuthRefreshTokenMutation } from '@fullerstack/ngx-gql/operations';

import { AuthConfig } from './auth.model';

/**
 * Default configuration - Auth module
 */
export const DefaultAuthConfig: AuthConfig = {};

export const AuthResponseOperationName = 'operationName';
export const AuthRefreshTokenOperation = getOperationName(AuthRefreshTokenMutation);
export const AuthLogoutOperation = getOperationName(AuthLogoutMutation);
