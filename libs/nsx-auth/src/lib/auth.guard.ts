import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SecurityService } from './auth.security.service';
import {
  getCookiesFromContext,
  getJwtTokenFromAuthorizationHeader,
  getRequestFromContext,
} from './auth.util';
import { AUTH_SESSION_COOKIE_NAME } from './auth.constant';

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
