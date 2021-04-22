import {
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ResolveField } from '@nestjs/graphql';
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
import {
  UserDto,
  UserUpdateAdvancedInput,
  UserUpdateInput,
} from './user.model';

@Resolver(() => UserDto)
export class UserResolver {
  constructor(
    private userService: UserService,
    private prisma: PrismaService
  ) {}

  @UseGuards(AuthGuardGql)
  @Query(() => UserDto, { description: "Get user's own info" })
  async userSelf(@UserDecorator() currentUser: User) {
    return UserDataAccess.getSecuredUser(currentUser);
  }

  @UseGuards(AuthGuardGql)
  @Mutation(() => UserDto, { description: "Update user's own info" })
  async userUpdateSelf(
    @UserDecorator() currentUser: User,
    @Args('input') payload: UserUpdateInput
  ) {
    if (currentUser.id !== payload.id) {
      throw new UnauthorizedException('Error - Insufficient access');
    }
    const user = await this.userService.updateUser(currentUser.id, payload);
    return UserDataAccess.getSecuredUser(user, currentUser);
  }

  @UseRoles({ exclude: [Role.USER] })
  @UseGuards(AuthGuardGql, AuthGuardRole)
  @Query(() => UserDto, { description: 'Get other user info' })
  async user(
    @UserDecorator() currentUser: User,
    @Args('input') userData: UserUpdateAdvancedInput
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userData.id },
    });

    if (!user) {
      throw new NotFoundException('Error - User not found');
    }

    return UserDataAccess.getSecuredUser(user, currentUser);
  }

  @UseRoles({ exclude: [Role.USER] })
  @UseGuards(AuthGuardGql, AuthGuardRole)
  @Mutation(() => UserDto, { description: 'Privileged user update' })
  async userUpdate(
    @UserDecorator() currentUser: User,
    @Args('input') userData: UserUpdateAdvancedInput
  ) {
    await this.userService.canUpdateUser(currentUser, userData.id);
    const user = await this.userService.updateUser(userData.id, userData);
    return UserDataAccess.getSecuredUser(user, currentUser);
  }

  // @Query(() => UserDto, { description: 'Get other users info' })
  // async users(@Args('input') searchData: UsersSearchInput) {
  //   return ([] as unknown) as UserDto;
  //   // const users = await this.userService.users(searchData);
  //   // return users.map((user) => UserDataAccess.getSecuredUser(user) as UserDto);
  // }
}
