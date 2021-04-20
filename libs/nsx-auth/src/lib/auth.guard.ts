import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
  Global,
  CanActivate,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Permission, Role, User } from '@prisma/client';

import { AuthFilterType } from './auth.model';
import { SecurityService } from './auth.security.service';
import {
  getCookiesFromContext,
  getJwtTokenFromAuthorizationHeader,
  getRequestFromContext,
} from './auth.util';
import {
  AUTH_PERMISSION_KEY,
  AUTH_ROLE_KEY,
  AUTH_SESSION_COOKIE_NAME,
} from './auth.constant';

@Global()
@Injectable()
export class AuthGuardGql extends AuthGuard('jwt') {
  constructor(private readonly securityService: SecurityService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = getRequestFromContext(context);

    const cookies = getCookiesFromContext(context);
    if (!this.securityService.verifyToken(cookies[AUTH_SESSION_COOKIE_NAME])) {
      throw new UnauthorizedException('Error - Invalid or expired session');
    }

    const token = getJwtTokenFromAuthorizationHeader(request);
    if (!token) {
      throw new UnauthorizedException('Error - Missing or invalid jwt token');
    }

    const payload = this.securityService.verifyToken(token);
    if (!payload) {
      throw new UnauthorizedException('Error - Invalid jwt token');
    }

    const user = await this.securityService.validateUser(payload.userId);
    if (!user) {
      throw new NotFoundException('Error - Invalid or inactive user');
    }

    if (user?.sessionVersion !== payload.sessionVersion) {
      throw new UnauthorizedException(
        'Error - Invalid session or remotely terminated'
      );
    }

    request.user = user;
    return true;
  }
}

@Injectable()
export class AuthGuardRoles extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let canActivate = false;

    const roles = this.reflector.getAllAndOverride<AuthFilterType<Role>>(
      AUTH_ROLE_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!roles) {
      return false;
    }

    const user = getRequestFromContext(context).user as User;
    canActivate =
      roles?.include?.some((role) => user.role === role) &&
      !roles?.exclude?.some((role) => user.role === role);

    return canActivate;
  }
}

@Injectable()
export class AuthGuardPermissions
  extends AuthGuard('jwt')
  implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let canActivate = false;

    const permissions = this.reflector.getAllAndOverride<
      AuthFilterType<Permission>
    >(AUTH_ROLE_KEY, [context.getHandler(), context.getClass()]);

    if (!permissions) {
      return false;
    }

    const user = getRequestFromContext(context).user as User;
    canActivate =
      permissions?.include?.some((permission) =>
        user.permissions?.includes(permission)
      ) &&
      !permissions?.exclude?.some((permission) =>
        user.permissions?.includes(permission)
      );

    return canActivate;
  }
}
