import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTH_SESSION_COOKIE_NAME } from './auth.constant';
import { AuthGuardGql } from './auth.guard.gql';
import { SecurityService } from './auth.security.service';
import {
  getCookieFromContext,
  getCookiesFromContext,
  getResponseFromContext,
} from './auth.util';

@Injectable()
export class AuthGuardAnonymousGql extends AuthGuardGql {
  constructor(readonly securityService: SecurityService) {
    super(securityService);
  }

  /**
   * Examines the request state to allow anonymous users to public endpoints
   * @param context context of graphql request
   * @returns true for endpoint activation, false to disallow endpoint
   * Note: If valid cookie is found without a valid user, expire the cookie immediately and reject
   *       If valid cookie is found with valid user, reject to force the client request access token
   *       If no valid cookie, user is anonymous
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const response = getResponseFromContext(context);
    const cookie = getCookieFromContext(context, AUTH_SESSION_COOKIE_NAME);
    if (cookie) {
      const payload = this.securityService.verifyToken(cookie);
      if (payload) {
        const user = await this.securityService.validateUser(payload.userId);
        if (!user) {
          this.securityService.invalidateHttpCookie(response);
          throw new UnauthorizedException('Error - Invalid or inactive user');
        }
        throw new UnauthorizedException('Error - Invalid or expired token');
      }
    }

    return true;
  }
}
