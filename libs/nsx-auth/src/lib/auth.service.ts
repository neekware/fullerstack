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

import { AuthUserCredentialsInput, AuthUserSignupInput } from './auth.model';
import { SecurityService } from './auth.security.service';
import { decodeURITokenComponent } from './auth.util';

@Injectable()
export class AuthService {
  constructor(readonly prisma: PrismaService, readonly security: SecurityService) {}

  async createUser(payload: AuthUserSignupInput): Promise<User> {
    let user: User;
    const hashedPassword = await this.security.hashPassword(payload.password);

    try {
      user = await this.prisma.user.create({
        data: {
          ...payload,
          email: payload.email.toLowerCase(),
          password: hashedPassword,
          username: uuid_v4(),
          role: 'USER',
          isActive: true,
          lastLoginAt: new Date(),
        } as Prisma.UserCreateInput,
      });
    } catch (err) {
      if (isConstraintError(err)) {
        const constraint = tryGet(() => err.meta.target[0], 'Some fields');
        switch (constraint) {
          case 'email':
            throw new ConflictException('ERROR.AUTH.EMAIL_IN_USE');
          case 'username':
            throw new ConflictException('ERROR.AUTH.USERNAME_IN_USE');
          default:
            throw new ConflictException(`Error: ${constraint} already in use.`);
        }
      } else {
        throw new Error(err);
      }
    }

    return user;
  }

  async authenticateUser(credentials: AuthUserCredentialsInput): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (user) {
      const passwordValid = await this.security.validatePassword(
        credentials.password,
        user.password
      );

      if (passwordValid) {
        return await this.prisma.user.update({
          where: { email: credentials.email },
          data: {
            lastLoginAt: new Date(),
          },
        });
      }
    }

    throw new BadRequestException(ApiError.Error.Auth.InvalidUserOrPassword);
  }

  async performPasswordReset(
    token: string,
    password: string,
    resetOtherSessions = false
  ): Promise<User> {
    const payload = decodeURITokenComponent<{ userId: string }>(token, this.security.siteSecret);
    if (!payload) {
      throw new BadRequestException(ApiError.Error.Auth.InvalidPasswordResetLink);
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload?.userId } });
    if (!user) {
      throw new BadRequestException(ApiError.Error.Auth.InvalidOrInactiveUser);
    }

    return this.security.resetPassword(user, password, resetOtherSessions);
  }

  /**
   * Change password
   * @param user Current user
   * @param oldPassword old password
   * @param newPassword new password
   * @returns promise of a User
   */
  async changePassword(
    user: User,
    oldPassword: string,
    newPassword: string,
    resetOtherSessions: boolean
  ): Promise<User> {
    const validPassword = await this.security.validatePassword(oldPassword, user.password);

    if (!validPassword) {
      throw new BadRequestException(ApiError.Error.Auth.InvalidPassword);
    }

    const hashedPassword = await this.security.hashPassword(newPassword);

    return this.prisma.user.update({
      data: {
        password: hashedPassword,
        sessionVersion: resetOtherSessions ? user.sessionVersion + 1 : user.sessionVersion,
      },
      where: { id: user.id },
    });
  }

  async performEmailChange(token: string): Promise<User> {
    const payload = decodeURITokenComponent<{ currentEmail: string; newEmail: string }>(
      token,
      this.security.siteSecret
    );

    if (payload) {
      const user = await this.security.validateUserByEmail(payload.currentEmail);
      if (user) {
        if (!(await this.security.isEmailInUse(payload.newEmail))) {
          return await this.prisma.user.update({
            data: {
              email: payload.newEmail,
            },
            where: { email: payload.currentEmail },
          });
        } else {
          throw new BadRequestException(ApiError.Error.Auth.EmailInUse);
        }
      }
    }

    throw new BadRequestException(ApiError.Error.Auth.InvalidEmailChangeLink);
  }
}
