import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { merge as ldNestMerge } from 'lodash';
import { DeepReadonly } from 'ts-essentials';
import { hash, compare } from 'bcrypt';
import { v4 as uuid_v4 } from 'uuid';
import * as jwt from 'jsonwebtoken';
import { Permission, Role, User } from '@prisma/client';

import { JwtDto } from '@fullerstack/api-dto';
import { PrismaService } from '@fullerstack/nsx-prisma';
import { HttpRequest, HttpResponse } from '@fullerstack/nsx-common';

import { DefaultSecurityConfig } from './auth.default';
import { SecurityConfig } from './auth.model';
import { AUTH_SESSION_COOKIE_NAME, AUTH_MODULE_NAME } from './auth.constant';

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(AUTH_MODULE_NAME);
  readonly config: DeepReadonly<SecurityConfig> = DefaultSecurityConfig;
  readonly jwtSecret: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {
    this.config = ldNestMerge(
      { ...this.config },
      this.configService.get<SecurityConfig>('appConfig.securityConfig')
    );
    this.jwtSecret = this.configService.get<string>('AUTH_SEEKRET_KEY');
    this.rehydrateSuperuser();
  }

  /**
   * Creates or updates the primary superuser account based on .env data
   * @returns void
   */
  private async rehydrateSuperuser() {
    let sessionVersion = 1;
    const email = this.configService.get<string>('AUTH_SUPERUSER_EMAIL');
    const password = this.configService.get<string>('AUTH_SUPERUSER_PASSWORD');

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
  async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    const validPassword = await compare(password, hashedPassword);
    return validPassword;
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
    const validPassword = await this.validatePassword(
      oldPassword,
      user.password
    );

    if (!validPassword) {
      throw new BadRequestException('Error - Invalid password');
    }

    const hashedPassword = await this.hashPassword(newPassword);

    return this.prisma.user.update({
      data: {
        password: hashedPassword,
        sessionVersion: resetOtherSessions
          ? user.sessionVersion + 1
          : user.sessionVersion,
      },
      where: { id: user.id },
    });
  }

  /**
   * Reset password
   * @param user Current user
   * @returns promise of a User
   */
  async resetPassword(user: User, resetOtherSessions?: boolean): Promise<User> {
    const hashedPassword = await this.hashPassword();

    return this.prisma.user.update({
      data: {
        password: hashedPassword,
        sessionVersion: resetOtherSessions
          ? user.sessionVersion + 1
          : user.sessionVersion,
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
    return await hash(password, this.config.bcryptSaltOrRound);
  }

  /**
   * Generates a session token to be used directly or embed in a httpCookie
   * @param payload data to be encoded into a jwt token
   * @returns string value of a jwt token
   */
  generateSessionToken(payload: JwtDto): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.config.sessionTokenExpiry,
    });
  }

  /**
   * Generates an access token to be sent to the end user (client)
   * @param payload data to be encoded into a jwt token
   * @returns string value of a jwt token
   */
  generateAccessToken(payload: JwtDto): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.config.accessTokenExpiry,
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
  verifyToken(token: string): JwtDto {
    try {
      const { userId, sessionVersion } = jwt.verify(
        token,
        this.jwtSecret
      ) as JwtDto;
      return { userId, sessionVersion };
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

  /**
   * Validates a user from an email and returns the user object on success
   * @param email string representation of an email address
   * @returns promise of a User or `undefined`
   */
  async validateUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user?.isActive ? user : undefined;
  }
}
