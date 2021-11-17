/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ApiError, JwtDto } from '@fullerstack/agx-dto';
import { HttpRequest, HttpResponse } from '@fullerstack/nsx-common';
import { PrismaService } from '@fullerstack/nsx-prisma';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Permission, Role, User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { cloneDeep as ldDeepClone, mergeWith as ldMergeWith } from 'lodash';
import { DeepReadonly } from 'ts-essentials';
import { v4 as uuid_v4 } from 'uuid';

import { AUTH_MODULE_NAME, AUTH_SESSION_COOKIE_NAME } from './auth.constant';
import { DefaultSecurityConfig } from './auth.default';
import { SecurityConfig } from './auth.model';
import { decodeURITokenComponent } from './auth.util';

@Injectable()
export class SecurityService {
  readonly logger = new Logger(AUTH_MODULE_NAME);
  readonly options: DeepReadonly<SecurityConfig> = DefaultSecurityConfig;
  readonly siteSecret: string;

  constructor(readonly prisma: PrismaService, readonly config: ConfigService) {
    this.options = ldMergeWith(
      ldDeepClone(this.options),
      this.config.get<SecurityConfig>('appConfig.securityConfig'),
      (dest, src) => (Array.isArray(dest) ? src : undefined)
    );
    this.siteSecret = this.config.get<string>('SITE_SEEKRET_KEY');
    this.rehydrateSuperuser();
  }

  /**
   * Creates or updates the primary superuser account based on .env data
   * @returns void
   */
  private async rehydrateSuperuser() {
    let sessionVersion = 1;
    const email = this.config.get<string>('AUTH_SUPERUSER_EMAIL');
    const password = this.config.get<string>('AUTH_SUPERUSER_PASSWORD');

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      if (await this.validatePassword(password, user.password)) {
        // no password rescue requested for primary superuser
        // no further action is required, so all is safe!
        return;
      }
      sessionVersion = user.sessionVersion + 1;
    }

    const hashedPassword = await this.hashPassword(password);
    await this.prisma.user.upsert({
      where: { email },
      update: { password: hashedPassword, sessionVersion },
      create: {
        email,
        username: 'superuser',
        firstName: 'Super',
        lastName: 'User',
        password: hashedPassword,
        sessionVersion,
        isActive: true,
        isVerified: true,
        lastLoginAt: new Date(),
        role: Role.SUPERUSER,
        permissions: [Permission.appALL],
      },
    });

    this.logger.log(`Superuser rehydrated - ${email}`);
  }

  /**
   * Issue a token for a given user
   * @param user user object for which a token is issued
   * @param request original http request object
   * @param response original http response object
   * @returns string
   */
  issueToken(user: User, request: HttpRequest, response: HttpResponse): string {
    const payload: JwtDto = {
      userId: user.id,
      sessionVersion: user.sessionVersion,
    };

    request.user = user;
    this.setHttpCookie(payload, response);
    const token = this.generateAccessToken(payload);

    return token;
  }

  /**
   * Returns true if text password is the same as the saved password
   * @param password text password
   * @returns promise of a boolean
   */
  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    const validPassword = await compare(password, hashedPassword);
    return validPassword;
  }

  /**
   * Reset password
   * @param user Current user
   * @returns promise of a User
   */
  async resetPassword(user: User, password?: string, resetOtherSessions?: boolean): Promise<User> {
    const hashedPassword = await this.hashPassword(password);

    return this.prisma.user.update({
      data: {
        password: hashedPassword,
        sessionVersion: resetOtherSessions ? user.sessionVersion + 1 : user.sessionVersion,
      },
      where: { id: user.id },
    });
  }

  /**
   * Returns an a one-way hashed password
   * @param password string
   * @note to prevent null-password attacks, no user shall be created with a null-password
   * @returns promise of a string
   */
  async hashPassword(password?: string): Promise<string> {
    password = password || uuid_v4();
    return await hash(password, this.options.bcryptSaltOrRound);
  }

  /**
   * Generates a session token to be used directly or embed in a httpCookie
   * @param payload data to be encoded into a jwt token
   * @returns string value of a jwt token
   */
  generateSessionToken(payload: JwtDto): string {
    return jwt.sign(payload, this.siteSecret, {
      expiresIn: this.options.sessionTokenExpiry,
    });
  }

  /**
   * Generates an access token to be sent to the end user (client)
   * @param payload data to be encoded into a jwt token
   * @returns string value of a jwt token
   */
  generateAccessToken(payload: JwtDto): string {
    return jwt.sign(payload, this.siteSecret, {
      expiresIn: this.options.accessTokenExpiry,
    });
  }

  /**
   * Sets a httpCookie on the response object containing the session token
   * @param payload data to be encoded into a token
   * @param response original http response object
   */
  setHttpCookie(payload: JwtDto, response: HttpResponse) {
    const sessionToken = this.generateSessionToken(payload);
    response.cookie(AUTH_SESSION_COOKIE_NAME, sessionToken, { httpOnly: true });
  }

  /**
   * Clears a httpCookie on the response object containing the session token
   * @param response original http response object
   */
  clearHttpCookie(response: HttpResponse) {
    response.clearCookie(AUTH_SESSION_COOKIE_NAME);
  }

  /**
   * Sets a httpCookie on the response object containing an expiry of `now`
   * @param response original http response object
   */
  invalidateHttpCookie(response: HttpResponse) {
    response.cookie(AUTH_SESSION_COOKIE_NAME, 'expired', {
      maxAge: 0,
      httpOnly: true,
    });
  }

  /**
   * Verifies the validity of a jwt token
   * @param token jwt token
   * @returns data returned from decoded token
   */
  verifyToken<T>(token: string): T {
    try {
      return jwt.verify(token, this.siteSecret) as T;
    } catch (err) {
      return undefined;
    }
  }

  /**
   * Validates a user from an id and returns the user object on success
   * @param userId string representation of an id
   * @returns promise of a User or `undefined`
   */
  async validateUser(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return user?.isActive ? user : undefined;
  }

  async isEmailInUse(email: string): Promise<boolean> {
    const users = await this.prisma.user.findMany({
      where: { email: { contains: email, mode: 'insensitive' } },
    });
    return users?.length > 0;
  }

  async isUserVerified(userId: string): Promise<boolean> {
    const user = await this.validateUser(userId);
    return user ? user.isVerified : false;
  }

  /**
   * Validates a user from an email and returns the user object on success
   * @param email string representation of an email address
   * @returns promise of a User or `undefined`
   */
  async validateUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user?.isActive ? user : undefined;
  }

  async verifyUser(token: string): Promise<User> {
    const payload = decodeURITokenComponent<{ userId: string }>(token, this.siteSecret);
    if (!payload) {
      throw new BadRequestException(ApiError.Error.Auth.InvalidVerificationLink);
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload?.userId } });
    if (!user) {
      throw new BadRequestException(ApiError.Error.Auth.InvalidOrInactiveUser);
    }

    return this.prisma.user.update({
      data: {
        isVerified: true,
      },
      where: { id: user.id },
    });
  }

  verifyURIToken(token: string): boolean {
    const payload = decodeURITokenComponent(token, this.siteSecret);
    return !!payload;
  }

  async verifyPasswordResetLink(token: string): Promise<boolean> {
    const payload = decodeURITokenComponent<{ userId: string; lastLoginAt: Date }>(
      token,
      this.siteSecret
    );

    if (payload) {
      const user = await this.validateUser(payload.userId);
      if (user) {
        const passwordResetLinkIssuedAt = new Date(payload.lastLoginAt).getTime();
        const userLastLoggedInAt = new Date(user.lastLoginAt).getTime();
        return passwordResetLinkIssuedAt >= userLastLoggedInAt;
      }
    }
    throw new BadRequestException(ApiError.Error.Auth.InvalidVerificationLink);
  }
}
