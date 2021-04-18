import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { tryGet } from '@fullerstack/agx-utils';
import { isConstraintError, PrismaService } from '@fullerstack/nsx-prisma';

import { UserCreateInput, UserCredentialsInput } from './auth.model';
import { SecurityService } from './auth.security.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly securityService: SecurityService
  ) {}

  async createUser(payload: UserCreateInput): Promise<User> {
    let user: User;
    const hashedPassword = await this.securityService.hashPassword(
      payload.password
    );

    try {
      user = await this.prisma.user.create({
        data: {
          ...payload,
          email: payload.email.toLowerCase(),
          password: hashedPassword,
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
    const ambiguousErrorMessage = `Login failed - Invalid email or password`;

    const user = await this.prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new NotFoundException(ambiguousErrorMessage);
    }

    const passwordValid = await this.securityService.validatePassword(
      credentials.password,
      user.password
    );

    if (!passwordValid) {
      throw new NotFoundException(ambiguousErrorMessage);
    }

    return user;
  }

  async isUserVerified(userId: string): Promise<boolean> {
    const user = await this.securityService.validateUser(userId);
    const isValidated = user ? user.isVerified : false;
    return false;
  }
}
