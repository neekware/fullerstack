/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission, User } from '@prisma/client';

import { AUTH_PERMISSION_KEY } from './auth.constant';
import { AuthGuardGql } from './auth.guard.gql';
import { AuthFilterType } from './auth.model';
import { SecurityService } from './auth.security.service';
import { getRequestFromContext } from './auth.util';

@Injectable()
export class AuthGuardPermission extends AuthGuardGql {
  constructor(readonly reflector: Reflector, readonly securityService: SecurityService) {
    super(securityService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (canActivate) {
      const permissions = this.reflector.getAllAndOverride<AuthFilterType<Permission>>(
        AUTH_PERMISSION_KEY,
        [context.getHandler(), context.getClass()]
      );

      const user = getRequestFromContext(context).user as User;

      // user permissions should not be in the exclude list
      if (permissions?.exclude?.some((permission) => user.permissions?.includes(permission))) {
        return false;
      }

      // user permissions should be in the include list
      return permissions?.include?.some((permission) => user.permissions?.includes(permission));
    }

    return false;
  }
}
