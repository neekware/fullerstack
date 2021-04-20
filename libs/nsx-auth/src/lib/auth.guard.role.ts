import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Role, User } from '@prisma/client';

import { AuthFilterType } from './auth.model';
import { getRequestFromContext } from './auth.util';
import { AUTH_ROLE_KEY } from './auth.constant';

@Injectable()
export class AuthGuardRole extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
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
}
