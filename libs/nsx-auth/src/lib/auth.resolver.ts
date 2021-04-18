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

import { UserCreateInput, UserCredentialsInput, UserDto } from './auth.model';
import { AuthService } from './auth.service';
import { RequestDecorator, ResponseDecorator } from './auth.decorator';
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

  @Mutation((returns) => UserDto)
  async userLogin(@Args('payload') data: UserCredentialsInput) {
    const user = await this.authService.authenticateUser(data);
    return user;
  }

  @Query((returns) => UserDto)
  async me(@RequestDecorator() request) {
    return request.user;
  }

  @Mutation((returns) => String)
  async refreshToken(
    @RequestDecorator() request,
    @ResponseDecorator() response,
    @Args('token') token: string
  ) {
    const payload: JwtDto = this.securityService.verifyToken(token);
    if (!payload) {
      throw new UnauthorizedException('Error - Invalid token');
    }

    const user = await this.securityService.validateUser(payload.userId);
    if (!user && payload.tokenVersion !== user.tokenVersion) {
      throw new UnauthorizedException('Error - Invalid user or token flushed');
    }

    request.user = user;
    this.securityService.setHttpCookie(payload, request.cookie);
    request.token = this.securityService.generateAccessToken(payload);

    return request.token;
  }

  // @ResolveField('user')
  // async user(@Parent() auth: Auth) {
  //   return await this.auth.getUserFromToken(auth.accessToken);
  // }
}
