import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { merge as ldNestMerge, omit as ldOmit } from 'lodash';
import { DeepReadonly } from 'ts-essentials';
import { hash, compare } from 'bcrypt';
import { v4 as uuid_v4 } from 'uuid';
import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

import { JwtDto } from '@fullerstack/api-dto';
import { tryGet } from '@fullerstack/agx-util';
import { PrismaService } from '@fullerstack/nsx-prisma';

import { DefaultSecurityConfig } from './auth.default';
import { SecurityConfig } from './auth.model';
import { AUTH_SESSION_COOKIE_NAME } from './auth.constant';

@Injectable()
export class SecurityService {
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
    this.jwtSecret = this.configService.get<string>('JWT_SECRET');
  }

  /**
   * Returns true if text password is the same as the saved password
   * @param password text password
   */
  async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  /**
   * Change password
   * @param user Current user
   * @param oldPassword old password
   * @param newPassword new password
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
   * Returns an a one-way hashed password
   * @param password string
   * @note to prevent null-password attacks, no user shall be created with a null-password
   */
  async hashPassword(password: string): Promise<string> {
    password = password || uuid_v4();
    return await hash(password, this.config.bcryptSaltOrRound);
  }

  generateSessionToken(payload: JwtDto): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.config.sessionTokenExpiry,
    });
  }

  generateAccessToken(payload: JwtDto): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.config.accessTokenExpiry,
    });
  }

  setHttpCookie(payload: JwtDto, response: any) {
    const sessionToken = this.generateSessionToken(payload);
    response.cookie(AUTH_SESSION_COOKIE_NAME, sessionToken, { httpOnly: true });
  }

  verifyToken(token: string): JwtDto {
    try {
      const { userId, sessionVersion } = jwt.verify(
        token,
        this.jwtSecret
      ) as JwtDto;
      return { userId, sessionVersion };
    } catch (err) {
      const message = `Token error: ${
        tryGet(() => err.message) || tryGet(() => err.name, '')
      }`;
      throw new UnauthorizedException(message);
    }
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return user?.isActive ? user : undefined;
  }
}
