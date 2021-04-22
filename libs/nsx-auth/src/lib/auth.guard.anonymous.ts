import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AUTH_SESSION_COOKIE_NAME } from './auth.constant';
import { AuthGuardGql } from './auth.guard.gql';
import { SecurityService } from './auth.security.service';
import {
  getCookiesFromContext,
  getJwtTokenFromAuthorizationHeader,
  getRequestFromContext,
} from './auth.util';

@Injectable()
export class AuthGuardAnonymousGql extends AuthGuardGql {
  constructor(readonly securityService: SecurityService) {
    super(securityService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = getRequestFromContext(context);
    const cookies = getCookiesFromContext(context);
    if (this.securityService.verifyToken(cookies[AUTH_SESSION_COOKIE_NAME])) {
      const token = getJwtTokenFromAuthorizationHeader(request);
      if (token) {
        const payload = this.securityService.verifyToken(token);
        if (payload) {
          const user = await this.securityService.validateUser(payload.userId);
          if (!user) {
            throw new NotFoundException('Error - Invalid or inactive user');
          }
          if (user?.sessionVersion !== payload.sessionVersion) {
            throw new BadRequestException(
              'Error - Invalid session or remotely terminated'
            );
          }
          request.user = user;
        }
      }
    }
    return true;
  }

  async canActisvate(context: ExecutionContext): Promise<boolean> {
    try {
      return super.canActivate(context);
    } catch (err) {
      if (!(err instanceof UnauthorizedException)) {
        throw err;
      }
      return true;
    }
  }
}
