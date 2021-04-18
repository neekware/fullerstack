import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '@prisma/client';

import { tryGet } from '@fullerstack/agx-utils';
import { isConstraintError, PrismaService } from '@fullerstack/nsx-prisma';
import { SecurityConfig, UserDto } from '@fullerstack/nsx-common';

import { UserCreateInput, UserCredentialsInput } from './auth.model';
import { PasswordService } from './auth.password.service';
import { JwtDto } from '@fullerstack/api-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService
  ) {}

  async createUser(payload: UserCreateInput): Promise<User> {
    let user: User;
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    );

    try {
      user = await this.prisma.user.create({
        data: {
          ...payload,
          email: payload.email.toLowerCase(),
          password: hashedPassword,
          role: 'USER',
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
    const ambiguousErrorMessage = `Login failed - Invalid email or password`;

    const user = await this.prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new NotFoundException(ambiguousErrorMessage);
    }

    const passwordValid = await this.passwordService.validatePassword(
      credentials.password,
      user.password
    );

    if (!passwordValid) {
      throw new NotFoundException(ambiguousErrorMessage);
    }

    return user;
  }

  async validateUser(userId: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }

  async isUserVerified(userId: string): Promise<boolean> {
    const user = await this.validateUser(userId);
    const isValidated = user ? user.isVerified : false;
    return false;
  }

  // getUserFromToken(token: string): Promise<User> {
  //   const id = this.jwtService.decode(token)['userId'];
  //   return this.prisma.user.findUnique({ where: { id } });
  // }

  generateToken(payload: JwtDto): string {
    const accessToken = this.jwtService.sign(payload);

    const securityConfig = this.configService.get<SecurityConfig>('security');
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: securityConfig.refreshIn,
    });

    return refreshToken;
  }

  refreshToken(token: string) {
    try {
      const { userId, tokenVersion } = this.jwtService.verify(token);

      return this.generateToken({
        userId,
        tokenVersion,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
