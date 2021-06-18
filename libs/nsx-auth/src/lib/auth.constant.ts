/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Role } from '@prisma/client';

/**
 * Name of this module
 */
export const AUTH_MODULE_NAME = 'AuthModule';

/**
 * Auth session expiry in days
 */
export const AUTH_SESSION_EXPIRY_DEFAULT = 7;

/**
 * Auth Jwt expiry in minutes
 */
export const AUTH_JWT_EXPIRY_DEFAULT = 5;

/**
 * Salt hash creation cost factor
 * The cost factor controls how much time is needed to calculate a single bCrypt hash
 */
export const AUTH_PASSWORD_SALT_ROUND_DEFAULT = 10;

/**
 * Minimum password length
 */
export const AUTH_PASSWORD_MIN_LENGTH = 6;

/**
 * Jwt session HttpOnly cookie name
 */
export const AUTH_SESSION_COOKIE_NAME = 'jwt';

/**
 * Decorator key for roles
 */
export const AUTH_ROLE_KEY = 'roles';

/**
 * Decorator key for permissions
 */
export const AUTH_PERMISSION_KEY = 'permissions';

/**
 * Role Restriction matrix
 * Staff has no visibility to admin/superuser
 * Admin has no visibility to superuser
 * Superuser has no visibility to superuser (update must happen manual)
 */
export const AUTH_ROLE_RESTRICTION_MATRIX = {
  [Role.USER]: [Role.STAFF, Role.ADMIN, Role.SUPERUSER],
  [Role.STAFF]: [Role.ADMIN, Role.SUPERUSER],
  [Role.ADMIN]: [Role.SUPERUSER],
  [Role.SUPERUSER]: [Role.SUPERUSER],
};
