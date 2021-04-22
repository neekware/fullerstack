import {
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Role, User } from '@prisma/client';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
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
  PaginatedUser,
  UserUpdateAdvancedInput,
  UserUpdateInput,
} from './user.model';
import { PaginationArgs } from '@fullerstack/nsx-common';
import { UserOrder } from './user.order';

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
          (user) => UserDataAccess.getSecuredUser(user, currentUser) as UserDto
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
