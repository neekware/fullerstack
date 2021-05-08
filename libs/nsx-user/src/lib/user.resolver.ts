import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import {
  AuthGuardAnonymousGql,
  AuthGuardGql,
  AuthGuardRole,
  UseRoles,
  UserDecorator,
} from '@fullerstack/nsx-auth';
import { PaginationArgs } from '@fullerstack/nsx-common';
import { PrismaService } from '@fullerstack/nsx-prisma';
import { NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role, User } from '@prisma/client';

import { PaginatedUser, UserDto, UserUpdateAdvancedInput, UserUpdateInput } from './user.model';
import { UserOrder } from './user.order';
import { UserDataAccessScope } from './user.scope';
import { UserService } from './user.service';

@Resolver(() => UserDto)
export class UserResolver {
  constructor(private userService: UserService, private prisma: PrismaService) {}

  @UseGuards(AuthGuardGql)
  @Query(() => UserDto, { description: "Get user's own info" })
  async userSelf(@UserDecorator() currentUser: User) {
    return UserDataAccessScope.getSecuredUser(currentUser);
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
    return UserDataAccessScope.getSecuredUser(user, currentUser);
  }

  @UseRoles({ exclude: [Role.USER] })
  @UseGuards(AuthGuardGql, AuthGuardRole)
  @Query(() => UserDto, { description: 'Get other user info' })
  async user(@UserDecorator() currentUser: User, @Args('input') userData: UserUpdateAdvancedInput) {
    const user = await this.prisma.user.findUnique({
      where: { id: userData.id },
    });

    if (!user) {
      throw new NotFoundException('Error - User not found');
    }

    return UserDataAccessScope.getSecuredUser(user, currentUser);
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
    return UserDataAccessScope.getSecuredUser(user, currentUser);
  }

  @UseGuards(AuthGuardAnonymousGql)
  @Query(() => PaginatedUser)
  async users(
    @UserDecorator() currentUser: User,
    @Args() { after, before, first, last }: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true })
    query: string,
    @Args({
      name: 'orderBy',
      type: () => UserOrder,
      nullable: true,
    })
    orderBy: UserOrder
  ) {
    query = query || '';
    const users = await findManyCursorConnection(
      async (args) => {
        const users = await this.prisma.user.findMany({
          // include: { group: true },
          where: {
            AND: [{ isActive: true }],
            OR: [
              { username: { contains: query } },
              { email: { contains: query } },
              { firstName: { contains: query } },
              { lastName: { contains: query } },
            ],
          },
          orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
          ...args,
        });
        return users.map(
          (user) => UserDataAccessScope.getSecuredUser(user, currentUser) as UserDto
        );
      },
      () =>
        this.prisma.user.count({
          where: {
            AND: [{ isActive: true }],
            OR: [
              { username: { contains: query } },
              { email: { contains: query } },
              { firstName: { contains: query } },
              { lastName: { contains: query } },
            ],
          },
        }),
      { first, last, before, after }
    );
    return users;
  }
}
