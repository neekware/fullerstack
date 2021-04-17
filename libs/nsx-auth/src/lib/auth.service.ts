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

// import { PasswordService } from './password.service';
// import { PrismaService } from './prisma.service';
// import { Token } from '../models/token.model';
// import { SecurityConfig } from 'src/configs/config.interface';
import { tryGet } from '@fullerstack/agx-utils';
import { isConstraintError, PrismaService } from '@fullerstack/nsx-prisma';
import { UserDto } from '@fullerstack/nsx-common';

import { UserCreateInput, UserCredentialsInput } from './auth.model';
import { PasswordService } from './auth.password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService
  ) {}

  async createUser(payload: UserCreateInput): Promise<User> {
    let user: UserDto;
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

  async loginUser(credentials: UserCredentialsInput): Promise<User> {
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

  validateUser(userId: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  // getUserFromToken(token: string): Promise<User> {
  //   const id = this.jwtService.decode(token)['userId'];
  //   return this.prisma.user.findUnique({ where: { id } });
  // }

  // generateToken(payload: { userId: string }): Token {
  //   const accessToken = this.jwtService.sign(payload);

  //   const securityConfig = this.configService.get<SecurityConfig>('security');
  //   const refreshToken = this.jwtService.sign(payload, {
  //     expiresIn: securityConfig.refreshIn,
  //   });

  //   return {
  //     accessToken,
  //     refreshToken,
  //   };
  // }

  // refreshToken(token: string) {
  //   try {
  //     const { userId } = this.jwtService.verify(token);

  //     return this.generateToken({
  //       userId,
  //     });
  //   } catch (e) {
  //     throw new UnauthorizedException();
  //   }
  // }
}
