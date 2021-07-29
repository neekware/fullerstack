/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ApiError } from '@fullerstack/agx-dto';
import { AUTH_ROLE_RESTRICTION_MATRIX } from '@fullerstack/nsx-auth';
import { MailerService } from '@fullerstack/nsx-mailer';
import { PrismaService } from '@fullerstack/nsx-prisma';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { UserSelfUpdateInput, UserWhereUniqueInput } from './user.model';

@Injectable()
export class UserService {
  constructor(readonly prisma: PrismaService, readonly mailer: MailerService) {}

  async updateUser(userId: string, newUserData: UserSelfUpdateInput): Promise<User> {
    return this.prisma.user.update({
      data: newUserData,
      where: {
        id: userId,
      },
    });
  }

  async canUpdateUser(currentUser: User, userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const forbidden = AUTH_ROLE_RESTRICTION_MATRIX[currentUser.role];
    if (forbidden.some((some) => some === user.role)) {
      throw new ForbiddenException(ApiError.Error.Auth.Forbidden);
    }
    return true;
  }

  async user(userWhereUniqueInput: UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({ where: userWhereUniqueInput });
  }

  // async createUser(data: Prisma.AuthUserSignupInput): Promise<User> {
  //   return this.prisma.user.create({
  //     data,
  //   });
  // }

  // async updateUser(params: {
  //   where: Prisma.UserWhereUniqueInput;
  //   data: Prisma.UserUpdateInput;
  // }): Promise<User> {
  //   const { where, data } = params;
  //   return this.prisma.user.update({
  //     data,
  //     where,
  //   });
  // }

  // async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
  //   return this.prisma.user.delete({
  //     where,
  //   });
  // }
}
