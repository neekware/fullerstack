import { Resolver, Query } from '@nestjs/graphql';
import { PrismaService } from '@fullerstack/nsx-prisma';
import { UserDto } from '@fullerstack/nsx-auth';
import { RequestDecorator } from '@fullerstack/nsx-auth';
import { UserService } from './user.service';

@Resolver((of) => UserDto)
// @UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(
    private userService: UserService,
    private prisma: PrismaService
  ) {}

  @Query((returns) => UserDto)
  async me(@RequestDecorator() request): Promise<UserDto> {
    return request.user;
  }

  // @UseGuards(GqlAuthGuard)
  // @Query((returns) => User)
  // async users(@Args('data') where: Prisma.UserWhereInput) {
  //   return this.userService.users({ where });
  // }

  // @UseGuards(GqlAuthGuard)
  // @Mutation((returns) => User)
  // async updateUser(
  //   @UserDecorator() user: User,
  //   @Args('data') newUserData: UpdateUserInput
  // ) {
  //   return this.userService.updateUser(user.id, newUserData);
  // }

  // @UseGuards(GqlAuthGuard)
  // @Mutation((returns) => User)
  // async changePassword(
  //   @UserDecorator() user: User,
  //   @Args('data') changePassword: ChangePasswordInput
  // ) {
  //   return this.userService.changePassword(
  //     user.id,
  //     user.password,
  //     changePassword
  //   );
  // }

  // @ResolveField('posts')
  // posts(@Parent() author: User) {
  //   return this.prisma.user.findUnique({ where: { id: author.id } }).posts();
  // }
}
