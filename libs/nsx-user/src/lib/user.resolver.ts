import {
  AuthGuardAnonymousGql,
  AuthGuardGql,
  AuthGuardRole,
  UseRoles,
  UserDecorator,
} from '@fullerstack/nsx-auth';
import { PaginationArgs } from '@fullerstack/nsx-common';
import { PrismaService } from '@fullerstack/nsx-prisma';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role, User } from '@prisma/client';

import { UserDto, UserSelfUpdateInput, UserUpdateInput, UserWhereByIdInput } from './user.model';
import { UserOrder } from './user.order';
import { UserDataAccessScope } from './user.scope';
import { UserService } from './user.service';

@Resolver(() => UserDto)
export class UserResolver {
  constructor(private userService: UserService, private prisma: PrismaService) {}

  @UseGuards(AuthGuardGql)
  @Query(() => UserDto, { description: "Get user's own info" })
  async userSelf(@UserDecorator() currentUser: User) {
    return UserDataAccessScope.getSecuredUser(currentUser, currentUser);
  }

  @UseGuards(AuthGuardGql)
  @Mutation(() => UserDto, { description: "Update user's own info" })
  async userSelfUpdate(
    @UserDecorator() currentUser: User,
    @Args('input') payload: UserSelfUpdateInput
  ) {
    const user = await this.userService.updateUser(currentUser.id, payload);
    return UserDataAccessScope.getSecuredUser(user, currentUser);
  }

  @UseRoles({ exclude: [Role.USER] })
  @UseGuards(AuthGuardGql, AuthGuardRole)
  @Query(() => UserDto, { description: 'Get other user info' })
  async user(@UserDecorator() currentUser: User, @Args('input') input: UserWhereByIdInput) {
    const user = await this.prisma.user.findUnique({ where: { id: input.id } });
    if (user) {
      return UserDataAccessScope.getSecuredUser(user, currentUser);
    }
    throw new NotFoundException('Error - User not found');
  }

  @UseRoles({ exclude: [Role.USER] })
  @UseGuards(AuthGuardGql, AuthGuardRole)
  @Mutation(() => UserDto, { description: 'Privileged user update' })
  async userUpdate(@UserDecorator() currentUser: User, @Args('input') userData: UserUpdateInput) {
    await this.userService.canUpdateUser(currentUser, userData.id);
    const user = await this.userService.updateUser(userData.id, userData);
    return UserDataAccessScope.getSecuredUser(user, currentUser);
  }

  @UseGuards(AuthGuardAnonymousGql)
  @Query(() => [UserDto])
  async users(
    @UserDecorator() currentUser: User,
    @Args() { cursor, take, skip }: PaginationArgs,
    @Args({ name: 'query', type: () => String, defaultValue: '' }) query: string,
    @Args({ name: 'orderBy', type: () => UserOrder, nullable: true }) orderBy: UserOrder
  ) {
    const filterBy = Object.assign(
      {},
      {
        where: {
          AND: [{ isActive: true }],
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
          ],
        },
      },
      cursor && { cursor: { id: cursor } },
      take && { take },
      (skip && { skip }) || (cursor && { skip: 1 }),
      orderBy && { [orderBy.field]: orderBy.direction }
    );

    const users = await this.prisma.user.findMany(filterBy);
    const prunedUsers = users.map(
      (user) => UserDataAccessScope.getSecuredUser(user, currentUser) as UserDto
    );
    return prunedUsers;
  }
}
