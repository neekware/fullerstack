import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { JwtDto } from '@fullerstack/api-dto';

import { AuthToken, UserCreateInput, UserCredentialsInput } from './auth.model';
import { AuthService } from './auth.service';
import {
  CookiesDecorator,
  RequestDecorator,
  ResponseDecorator,
} from './auth.decorator';
import { SecurityService } from './auth.security.service';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { HttpRequest, HttpResponse } from '@fullerstack/nsx-common';
import { GqlAuthGuard } from './auth.guard';

@Resolver((of) => AuthToken)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly securityService: SecurityService
  ) {}

  @Mutation((returns) => AuthToken)
  async userSignup(
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('data') data: UserCreateInput
  ) {
    const user = await this.authService.createUser(data);
    return this.issueToken(user, request, response);
  }

  @Mutation((returns) => AuthToken)
  async userLogin(
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
  ): AuthToken {
    const payload: JwtDto = {
      userId: user.id,
      tokenVersion: user.tokenVersion,
    };

    request.user = user;
    this.securityService.setHttpCookie(payload, response);
    const token = this.securityService.generateAccessToken(payload);

    return { ok: true, token };
  }

  @Mutation((returns) => AuthToken)
  async refreshToken(
    @CookiesDecorator() cookies: string[],
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse
  ) {
    const payload: JwtDto = this.securityService.verifyToken(cookies['jit']);
    if (!payload) {
      throw new UnauthorizedException('Error - Invalid session');
    }

    const user = await this.securityService.validateUser(payload.userId);
    if (user?.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException(
        'Error - Invalid user or session terminated remotely'
      );
    }

    return this.issueToken(user, request, response);
  }
}
