/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import {
  AUTH_JWT_EXPIRY_DEFAULT,
  AUTH_PASSWORD_SALT_ROUND_DEFAULT,
  AUTH_SESSION_EXPIRY_DEFAULT,
} from './auth.constant';
import { SecurityConfig } from './auth.model';

export const DefaultSecurityConfig: SecurityConfig = {
  accessTokenExpiry: `${AUTH_JWT_EXPIRY_DEFAULT}m`,
  sessionTokenExpiry: `${AUTH_SESSION_EXPIRY_DEFAULT}d`,
  bcryptSaltOrRound: AUTH_PASSWORD_SALT_ROUND_DEFAULT,
};
