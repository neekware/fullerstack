import {
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Role, User } from '@prisma/client';
import { PrismaService } from '@fullerstack/nsx-prisma';
import {
  UserDecorator,
  UseRoles,
  AuthGuardGql,
  AuthGuardRole,
} from '@fullerstack/nsx-auth';

import { UserDataAccess } from './user.permission';
import { UserService } from './user.service';
import { UserDto, UserUpdateInput } from './user.model';

@Resolver(() => UserDto)
export class UserResolver {
  constructor(
    private userService: UserService,
    private prisma: PrismaService
  ) {}

  @UseGuards(AuthGuardGql)
  @Query(() => UserDto)
  async userGetSelf(@UserDecorator() currentUser: User) {
    return UserDataAccess.self(currentUser);
  }

  @UseGuards(AuthGuardGql)
  @Mutation(() => UserDto)
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
  @UseGuards(AuthGuardGql, AuthGuardRole)
  @Query(() => UserDto)
  async user(@UserDecorator() currentUser: User, @Args('id') userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Error - User not found');
    }

    return UserDataAccess.staff(user);
  }

  @UseGuards(AuthGuardGql)
  @Mutation(() => UserDto)
  async updateUser(
    @UserDecorator() user: User,
    @Args('input') userData: UserUpdateInput
  ) {
    return this.userService.updateUser(user.id, userData);
  }

  // @UseGuards(AuthGuardGql)
  // @Query(() => User)
  // async users(@Args('data') where: Prisma.UserWhereInput) {
  //   return this.userService.users({ where });
  // }

  // @UseGuards(AuthGuardGql)
  // @Mutation(() => User)
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
