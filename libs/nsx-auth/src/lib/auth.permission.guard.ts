import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission, User } from '@prisma/client';

import { AUTH_PERMISSION_KEY } from './auth.constant';
import { getRequestFromContext } from './auth.util';

@Injectable()
export class AuthGuardPermissions implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      AUTH_PERMISSION_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredPermissions) {
      return true;
    }
    const user = getRequestFromContext(context).user as User;
    return requiredPermissions.some((permission) =>
      user.permissions?.includes(permission)
    );
  }
}
