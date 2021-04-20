import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Permission, User } from '@prisma/client';

import { AuthFilterType } from './auth.model';
import { getRequestFromContext } from './auth.util';
import { AUTH_PERMISSION_KEY } from './auth.constant';

@Injectable()
export class AuthGuardPermission
  extends AuthGuard('jwt')
  implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.getAllAndOverride<
      AuthFilterType<Permission>
    >(AUTH_PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    const user = getRequestFromContext(context).user as User;

    // user permissions should not be in the exclude list
    if (
      permissions?.exclude?.some((permission) =>
        user.permissions?.includes(permission)
      )
    ) {
      return false;
    }

    // user permissions should be in the include list
    return permissions?.include?.some((permission) =>
      user.permissions?.includes(permission)
    );
  }
}
