/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { JwtDto } from '@fullerstack/agx-dto';
import { ExecutionContext, Injectable } from '@nestjs/common';

import { AUTH_SESSION_COOKIE_NAME } from './auth.constant';
import { AuthGuardGql } from './auth.guard.gql';
import { SecurityService } from './auth.security.service';
import { getCookieFromContext, getRequestFromContext, getResponseFromContext } from './auth.util';

@Injectable()
export class AuthGuardAnonymousGql extends AuthGuardGql {
  constructor(readonly securityService: SecurityService) {
    super(securityService);
  }

  /**
   * Examines the request state to allow anonymous users to public endpoints
   * @param context context of graphql request
   * @returns true for endpoint activation, false to disallow endpoint
   * Note: If valid cookie is found without a valid user, clear the cookie and drop to anonymous only level
   *       If valid cookie is found with valid user, continue with anonymous (+ above) level
   *       If no valid cookie, user is anonymous
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = getRequestFromContext(context);
    const response = getResponseFromContext(context);
    const cookie = getCookieFromContext(context, AUTH_SESSION_COOKIE_NAME);
    if (cookie) {
      const payload = this.securityService.verifyToken<JwtDto>(cookie);
      if (payload) {
        const user = await this.securityService.validateUser(payload.userId);
        if (!user) {
          this.securityService.clearHttpCookie(response);
        }
        request.user = user;
      } else {
        this.securityService.clearHttpCookie(response);
      }
    }

    return true;
  }
}
