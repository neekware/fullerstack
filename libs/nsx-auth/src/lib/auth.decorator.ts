/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { ExecutionContext, SetMetadata, createParamDecorator } from '@nestjs/common';
import { Permission, Role, User } from '@prisma/client';

import { AUTH_ROLE_KEY } from './auth.constant';
import { AuthFilterType } from './auth.model';
import {
  getCookiesFromContext,
  getLocalesFromContext,
  getRequestFromContext,
  getResponseFromContext,
} from './auth.util';

export const CookiesDecorator = createParamDecorator((data: unknown, context: ExecutionContext) => {
  return getCookiesFromContext(context);
});

export const RequestDecorator = createParamDecorator((data: unknown, context: ExecutionContext) => {
  return getRequestFromContext(context);
});

export const ResponseDecorator = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    return getResponseFromContext(context);
  }
);

export const UserDecorator = createParamDecorator((data: unknown, context: ExecutionContext) => {
  return getRequestFromContext(context).user as User;
});

export const LocaleDecorator = createParamDecorator((data: unknown, context: ExecutionContext) => {
  return getLocalesFromContext(context);
});

export const IpInfoDecorator = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const request = getRequestFromContext(context);
  return (request as any)?.ipInfo;
});

/**
 * Decorator for enforcing role-based access
 * @param roles list of roles
 */
export const UseRoles = (roles: AuthFilterType<Role>) => {
  const roleDecorator = SetMetadata(AUTH_ROLE_KEY, roles);
  return roleDecorator;
};

/**
 * Decorator for enforcing permission-based access
 * @param permissions list of permissions
 */
export const UsePermissions = (permissions: AuthFilterType<Permission>) => {
  const permissionDecorator = SetMetadata(AUTH_ROLE_KEY, permissions);
  return permissionDecorator;
};
