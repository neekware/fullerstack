/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, User } from '@prisma/client';

import { AUTH_ROLE_KEY } from './auth.constant';
import { AuthGuardGql } from './auth.guard.gql';
import { AuthFilterType } from './auth.model';
import { SecurityService } from './auth.security.service';
import { getRequestFromContext } from './auth.util';

@Injectable()
export class AuthGuardRole extends AuthGuardGql {
  constructor(readonly reflector: Reflector, readonly securityService: SecurityService) {
    super(securityService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (canActivate) {
      const roles = this.reflector.getAllAndOverride<AuthFilterType<Role>>(AUTH_ROLE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      const user = getRequestFromContext(context).user as User;

      if (!roles || (!roles.include && !roles.exclude)) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Improperly configured - `AuthGuardRole` must be used with `UseRoles`',
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      // user role should not be in the exclude list
      if (roles?.exclude?.length) {
        return !roles.exclude.some((role) => user.role === role);
      }

      // user role should be in the include list
      if (roles?.include?.length) {
        return roles.include.some((role) => user.role === role);
      }
    }

    return false;
  }
}
