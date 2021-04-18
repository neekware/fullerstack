import {
  Resolver,
  Mutation,
  Args,
  Context,
  GraphQLExecutionContext,
  Query,
} from '@nestjs/graphql';
import { User } from '@prisma/client';
import { JwtDto } from '@fullerstack/api-dto';

import {
  AuthToken,
  UserCreateInput,
  UserCredentialsInput,
  UserDto,
} from './auth.model';
import { AuthService } from './auth.service';
import {
  CookiesDecorator,
  RequestDecorator,
  ResponseDecorator,
} from './auth.decorator';
import { SecurityService } from './auth.security.service';
import { UnauthorizedException } from '@nestjs/common';

@Resolver((of) => UserDto)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly securityService: SecurityService
  ) {}

  @Mutation((returns) => UserDto)
  async userSignup(@Args('data') data: UserCreateInput) {
    const user = await this.authService.createUser(data);
    return user;
  }

  @Mutation((returns) => AuthToken)
  async userLogin(
    @RequestDecorator() request,
    @ResponseDecorator() response,
    @Args('data') data: UserCredentialsInput
  ) {
    const user = await this.authService.authenticateUser(data);
    const payload: JwtDto = {
      userId: user.id,
      tokenVersion: user.tokenVersion,
    };

    request.user = user;
    this.securityService.setHttpCookie(payload, response);
    request.token = this.securityService.generateAccessToken(payload);

    return { ok: true, token: request.token };
  }

  @Query((returns) => UserDto)
  async me(@RequestDecorator() request) {
    return request.user;
  }

  @Mutation((returns) => AuthToken)
  async refreshToken(
    @CookiesDecorator() cookies,
    @RequestDecorator() request,
    @ResponseDecorator() response
  ) {
    const payload: JwtDto = this.securityService.verifyToken(cookies.jit);
    if (!payload) {
      throw new UnauthorizedException('Error - Invalid session');
    }

    const user = await this.securityService.validateUser(payload.userId);
    if (user?.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException(
        'Error - Invalid user or session terminated remotely'
      );
    }

    request.user = user;
    this.securityService.setHttpCookie(payload, response);
    request.token = this.securityService.generateAccessToken(payload);

    return { ok: true, token: request.token };
  }

  // @ResolveField('user')
  // async user(@Parent() auth: Auth) {
  //   return await this.auth.getUserFromToken(auth.accessToken);
  // }
}
