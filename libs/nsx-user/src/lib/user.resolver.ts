import { Resolver, Query } from '@nestjs/graphql';
import { PrismaService } from '@fullerstack/nsx-prisma';
import { GqlAuthGuard } from '@fullerstack/nsx-auth';
import { RequestDecorator } from '@fullerstack/nsx-auth';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { HttpRequest } from '@fullerstack/nsx-common';
import { UserDto } from './user.model';

@Resolver((of) => UserDto)
// @UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(
    private userService: UserService,
    private prisma: PrismaService
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query((returns) => UserDto)
  async user(@RequestDecorator() request: HttpRequest) {
    const user = request.user;
    return user;
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

  // @ResolveField('posts')
  // posts(@Parent() author: User) {
  //   return this.prisma.user.findUnique({ where: { id: author.id } }).posts();
  // }
}
