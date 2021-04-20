import {
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Role, User } from '@prisma/client';
import { PrismaService } from '@fullerstack/nsx-prisma';
import {
  AuthGuardGql,
  AuthGuardPermissions,
  AuthGuardRoles,
  UsePermissions,
  UserDecorator,
  UseRoles,
} from '@fullerstack/nsx-auth';

import { UserDataAccess } from './user.permission';
import { UserService } from './user.service';
import { UserDto, UserUpdateInput } from './user.model';

@Resolver((of) => UserDto)
export class UserResolver {
  constructor(
    private userService: UserService,
    private prisma: PrismaService
  ) {}

  @UseGuards(AuthGuardGql)
  @Query((returns) => UserDto)
  async userGetSelf(@UserDecorator() currentUser: User) {
    return UserDataAccess.self(currentUser);
  }

  @UseGuards(AuthGuardGql)
  @Mutation((returns) => UserDto)
  async userUpdateSelf(
    @UserDecorator() user: User,
    @Args('input') payload: UserUpdateInput
  ) {
    if (user.id !== payload.id) {
      throw new UnauthorizedException('Error - Insufficient access');
    }
    return this.userService.updateUser(user.id, payload);
  }

  @UseRoles({ exclude: [Role.USER] })
  @UseGuards(AuthGuardGql, AuthGuardRoles)
  @Query((returns) => UserDto)
  async user(@UserDecorator() currentUser: User, @Args('id') userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Error - User not found');
    }

    return UserDataAccess.staff(user);
  }

  @UseGuards(AuthGuardGql)
  @Mutation((returns) => UserDto)
  async updateUser(
    @UserDecorator() user: User,
    @Args('input') userData: UserUpdateInput
  ) {
    return this.userService.updateUser(user.id, userData);
  }

  // @UseGuards(AuthGuardGql)
  // @Query((returns) => User)
  // async users(@Args('data') where: Prisma.UserWhereInput) {
  //   return this.userService.users({ where });
  // }

  // @UseGuards(AuthGuardGql)
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
