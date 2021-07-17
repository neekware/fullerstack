/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ApiError, JwtDto } from '@fullerstack/agx-dto';
import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AUTH_SESSION_COOKIE_NAME } from './auth.constant';
import { SecurityService } from './auth.security.service';
import {
  getCookiesFromContext,
  getJwtTokenFromAuthorizationHeader,
  getRequestFromContext,
} from './auth.util';

@Injectable()
export class AuthGuardGql extends AuthGuard('jwt') {
  constructor(readonly securityService: SecurityService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = getRequestFromContext(context);

    const cookies = getCookiesFromContext(context);
    if (!this.securityService.verifyToken<JwtDto>(cookies[AUTH_SESSION_COOKIE_NAME])) {
      throw new UnauthorizedException(ApiError.Error.Auth.InvalidOrExpiredSession);
    }

    const token = getJwtTokenFromAuthorizationHeader(request);
    if (!token) {
      throw new UnauthorizedException(ApiError.Error.Auth.MissingAccessToken);
    }

    const payload = this.securityService.verifyToken<JwtDto>(token);
    if (!payload) {
      throw new UnauthorizedException(ApiError.Error.Auth.InvalidAccessToken);
    }

    const user = await this.securityService.validateUser(payload.userId);
    if (!user) {
      throw new NotFoundException(ApiError.Error.Auth.InvalidOrInactiveUser);
    }

    if (user?.sessionVersion !== payload.sessionVersion) {
      throw new BadRequestException(ApiError.Error.Auth.InvalidOrRemotelyTerminatedSession);
    }

    request.user = user;
    return true;
  }
}
