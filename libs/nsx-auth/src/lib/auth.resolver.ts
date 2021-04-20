import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { HttpRequest, HttpResponse } from '@fullerstack/nsx-common';
import { JwtDto } from '@fullerstack/api-dto';

import {
  AuthTokenDto,
  ChangePasswordInput,
  UserCreateInput,
  UserCredentialsInput,
} from './auth.model';
import { AuthService } from './auth.service';
import {
  CookiesDecorator,
  UsePermissions,
  RequestDecorator,
  ResponseDecorator,
} from './auth.decorator';
import { SecurityService } from './auth.security.service';

import { AuthGuardGql } from './auth.guard';
import { AUTH_SESSION_COOKIE_NAME } from './auth.constant';

@Resolver((of) => AuthTokenDto)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly securityService: SecurityService
  ) {}

  @Mutation((returns) => AuthTokenDto)
  async authUserSignup(
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('data') data: UserCreateInput
  ) {
    const user = await this.authService.createUser(data);
    return this.issueToken(user, request, response);
  }

  @Mutation((returns) => AuthTokenDto)
  async authUserLogin(
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('data') data: UserCredentialsInput
  ) {
    const user = await this.authService.authenticateUser(data);
    return this.issueToken(user, request, response);
  }

  private issueToken(
    user: User,
    request: HttpRequest,
    response: HttpResponse
  ): AuthTokenDto {
    const payload: JwtDto = {
      userId: user.id,
      sessionVersion: user.sessionVersion,
    };

    request.user = user;
    this.securityService.setHttpCookie(payload, response);
    const token = this.securityService.generateAccessToken(payload);

    return { ok: true, token };
  }

  @Mutation((returns) => AuthTokenDto)
  async authTokenRefresh(
    @CookiesDecorator() cookies: string[],
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse
  ) {
    const payload: JwtDto = this.securityService.verifyToken(
      cookies[AUTH_SESSION_COOKIE_NAME]
    );
    if (!payload) {
      throw new UnauthorizedException('Error - Invalid or expired session');
    }

    const user = await this.securityService.validateUser(payload.userId);
    if (!user) {
      throw new UnauthorizedException('Error - Invalid or inactive user');
    }

    if (user?.sessionVersion !== payload.sessionVersion) {
      throw new UnauthorizedException(
        'Error - Invalid session or remotely terminated'
      );
    }

    return this.issueToken(user, request, response);
  }

  @UseGuards(AuthGuardGql)
  @Mutation((returns) => AuthTokenDto)
  async authPasswordChange(
    @CookiesDecorator() cookies: string[],
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('data') payload: ChangePasswordInput
  ) {
    const user = await this.securityService.changePassword(
      request.user as User,
      payload.oldPassword,
      payload.newPassword,
      payload.resetOtherSessions
    );

    return this.issueToken(user, request, response);
  }
}
