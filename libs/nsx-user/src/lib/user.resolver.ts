import {
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Role, User } from '@prisma/client';
import { PrismaService } from '@fullerstack/nsx-prisma';
import { GqlAuthGuard, UserDecorator } from '@fullerstack/nsx-auth';

import { UserDataAccess } from './user.permission';
import { UserService } from './user.service';
import { UserDto, UserUpdateInput } from './user.model';

@Resolver((of) => UserDto)
export class UserResolver {
  constructor(
    private userService: UserService,
    private prisma: PrismaService
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query((returns) => UserDto)
  async self(@UserDecorator() currentUser: User) {
    return UserDataAccess.self(currentUser);
  }

  @UseGuards(GqlAuthGuard)
  @Query((returns) => UserDto)
  async user(@UserDecorator() currentUser: User, @Args('id') userId: string) {
    if (currentUser.role === Role.USER) {
      throw new UnauthorizedException('Error - Unauthorized Request');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Error - User not found');
    }

    return UserDataAccess.staff(user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation((returns) => UserDto)
  async updateUser(
    @UserDecorator() user: User,
    @Args('data') userData: UserUpdateInput
  ) {
    return this.userService.updateUser(user.id, userData);
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
