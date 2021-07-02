/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ApiError } from '@fullerstack/agx-dto';
import { tryGet } from '@fullerstack/agx-util';
import { PrismaService, isConstraintError } from '@fullerstack/nsx-prisma';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { v4 as uuid_v4 } from 'uuid';

import { UserCreateInput, UserCredentialsInput } from './auth.model';
import { SecurityService } from './auth.security.service';

@Injectable()
export class AuthService {
  constructor(readonly prisma: PrismaService, readonly securityService: SecurityService) {}

  async createUser(payload: UserCreateInput): Promise<User> {
    let user: User;
    const hashedPassword = await this.securityService.hashPassword(payload.password);

    try {
      user = await this.prisma.user.create({
        data: {
          ...payload,
          email: payload.email.toLowerCase(),
          password: hashedPassword,
          username: uuid_v4(),
          role: 'USER',
          isActive: true,
        } as Prisma.UserCreateInput,
      });
    } catch (err) {
      if (isConstraintError(err)) {
        const constraint = tryGet(() => err.meta.target[0], 'Some fields');
        throw new ConflictException(`Error: ${constraint} already in use.`);
      } else {
        throw new Error(err);
      }
    }

    return user;
  }

  async authenticateUser(credentials: UserCredentialsInput): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (user) {
      const passwordValid = await this.securityService.validatePassword(
        credentials.password,
        user.password
      );

      if (passwordValid) {
        return user;
      }
    }

    throw new BadRequestException(ApiError.Error.Auth.InvalidUserOrPassword);
  }

  async isUserVerified(userId: string): Promise<boolean> {
    const user = await this.securityService.validateUser(userId);
    return user ? user.isVerified : false;
  }

  async isEmailInUse(email: string): Promise<boolean> {
    const users = await this.prisma.user.findMany({
      where: { email: { contains: email, mode: 'insensitive' } },
    });
    return users?.length > 0;
  }
}
