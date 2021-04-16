import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UserDto } from '@fullerstack/nsx-common';
import { UserCreateInput, UserCredentialsInput } from './auth.model';
import { AuthService } from './auth.service';

@Resolver((of) => UserDto)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation((returns) => UserDto)
  async signup(@Args('data') data: UserCreateInput) {
    data.email = data.email.toLowerCase();
    const user = await this.auth.createUser(data);
    return user;
  }

  @Mutation((returns) => UserDto)
  async login(@Args('data') data: UserCredentialsInput) {
    const user = await this.auth.loginUser(data);
    return user;
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
