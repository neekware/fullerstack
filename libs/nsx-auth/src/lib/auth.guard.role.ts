import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, User } from '@prisma/client';

import { AUTH_ROLE_KEY } from './auth.constant';
import { AuthGuardGql } from './auth.guard.gql';
import { AuthFilterType } from './auth.model';
import { SecurityService } from './auth.security.service';
import { getRequestFromContext } from './auth.util';

@Injectable()
export class AuthGuardRole extends AuthGuardGql {
  constructor(
    readonly reflector: Reflector,
    readonly securityService: SecurityService
  ) {
    super(securityService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (canActivate) {
      const roles = this.reflector.getAllAndOverride<AuthFilterType<Role>>(
        AUTH_ROLE_KEY,
        [context.getHandler(), context.getClass()]
      );

      const user = getRequestFromContext(context).user as User;

      // user role should not be in the exclude list
      if (roles?.exclude?.some((role) => user.role === role)) {
        return false;
      }

      // user role should be in the include list
      return roles?.include?.some((role) => user.role === role);
    }

    return false;
  }
}
