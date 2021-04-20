import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, User } from '@prisma/client';

import { AUTH_ROLE_KEY } from './auth.constant';
import { getRequestFromContext } from './auth.util';

@Injectable()
export class AuthGuardRoles implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      AUTH_ROLE_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredRoles) {
      return true;
    }
    const user = getRequestFromContext(context).user as User;
    return requiredRoles.some((role) => user.role === role);
  }
}
