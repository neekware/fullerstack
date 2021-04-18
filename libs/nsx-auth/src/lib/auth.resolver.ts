import {
  Resolver,
  Mutation,
  Args,
  Context,
  GraphQLExecutionContext,
  Query,
} from '@nestjs/graphql';
import { UserDto } from '@fullerstack/nsx-common';
import { UserCreateInput, UserCredentialsInput } from './auth.model';
import { AuthService } from './auth.service';
import { RequestDecorator, ResponseDecorator } from './auth.decorator';
import { User } from '@prisma/client';

@Resolver((of) => UserDto)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation((returns) => UserDto)
  async userSignup(@Args('data') data: UserCreateInput) {
    const user = await this.auth.createUser(data);
    return user;
  }

  @Mutation((returns) => UserDto)
  async userLogin(
    @ResponseDecorator() response,
    @Args('data') data: UserCredentialsInput
  ) {
    response.cookie('jit', 'asfasfd', { httpOnly: true });
    const user = await this.auth.authenticateUser(data);
    return user;
  }

  @Query((returns) => UserDto)
  async me(@RequestDecorator() request) {
    return request.user;
  }

  // @Mutation((returns) => Token)
  // async refreshToken(@Args('token') token: string) {
  //   return this.auth.refreshToken(token);
  // }

  // @ResolveField('user')
  // async user(@Parent() auth: Auth) {
  //   return await this.auth.getUserFromToken(auth.accessToken);
  // }
}
