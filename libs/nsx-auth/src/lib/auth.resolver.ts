/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ApiError, JwtDto } from '@fullerstack/agx-dto';
import { HttpRequest, HttpResponse } from '@fullerstack/nsx-common';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';

import { AUTH_SESSION_COOKIE_NAME } from './auth.constant';
import { CookiesDecorator, RequestDecorator, ResponseDecorator } from './auth.decorator';
import { AuthGuardAnonymousGql } from './auth.guard.anonymous';
import { AuthGuardGql } from './auth.guard.gql';
import {
  AuthStatusDto,
  AuthTokenDto,
  ChangePasswordInput,
  ChangePasswordRequestInput,
  UserCreateInput,
  UserCredentialsInput,
} from './auth.model';
import { SecurityService } from './auth.security.service';
import { AuthService } from './auth.service';

@Resolver(() => AuthTokenDto)
export class AuthResolver {
  constructor(readonly authService: AuthService, readonly securityService: SecurityService) {}

  @Mutation(() => AuthTokenDto)
  async authRegister(
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('input') data: UserCreateInput
  ) {
    const user = await this.authService.createUser(data);
    const token = this.securityService.issueToken(user, request, response);
    return { ok: true, token };
  }

  @Mutation(() => AuthTokenDto)
  async authLogin(
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('input') data: UserCredentialsInput
  ) {
    const user = await this.authService.authenticateUser(data);
    const token = this.securityService.issueToken(user, request, response);
    return { ok: true, token };
  }

  @Mutation(() => AuthTokenDto)
  async authRefreshToken(
    @CookiesDecorator() cookies: string[],
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse
  ) {
    const payload: JwtDto = this.securityService.verifyToken(cookies[AUTH_SESSION_COOKIE_NAME]);
    if (!payload) {
      throw new UnauthorizedException(ApiError.Error.Auth.Unauthorized);
    }

    const user = await this.securityService.validateUser(payload.userId);
    if (!user) {
      throw new UnauthorizedException(ApiError.Error.Auth.InvalidOrInactiveUser);
    }

    if (user?.sessionVersion !== payload.sessionVersion) {
      throw new UnauthorizedException(ApiError.Error.Auth.InvalidOrRemotelyTerminatedSession);
    }

    const token = this.securityService.issueToken(user, request, response);
    return { ok: true, token };
  }

  @UseGuards(AuthGuardAnonymousGql)
  @Mutation(() => AuthStatusDto)
  async authLogout(@ResponseDecorator() response: HttpResponse) {
    this.securityService.clearHttpCookie(response);
    return { ok: true };
  }

  @Mutation(() => AuthStatusDto)
  async isEmailAvailable(@Args('email', { type: () => String }) email: string) {
    const isAvailable = !(await this.authService.isEmailInUse(email));
    return { ok: isAvailable };
  }

  @UseGuards(AuthGuardGql)
  @Mutation(() => AuthTokenDto)
  async authChangePassword(
    @CookiesDecorator() cookies: string[],
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('input') payload: ChangePasswordInput
  ) {
    const user = await this.securityService.changePassword(
      request.user as User,
      payload.oldPassword,
      payload.newPassword,
      payload.resetOtherSessions
    );

    const token = this.securityService.issueToken(user, request, response);
    return { ok: true, token };
  }

  @Mutation(() => AuthStatusDto)
  async authResetPasswordRequest(
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('input') payload?: ChangePasswordRequestInput
  ) {
    await this.securityService.validateUserByEmail(payload.email);

    // send email out

    return { ok: true };
  }

  @UseGuards(AuthGuardGql)
  @Mutation(() => AuthTokenDto)
  async authResetPassword(
    @RequestDecorator() request: HttpRequest
    // @ResponseDecorator() response: HttpResponse,
    // @Args('id') payload?: string
  ) {
    // verify one-time hash key

    await this.securityService.resetPassword(request.user as User);

    return { ok: true };
  }
}
