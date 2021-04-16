import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, compare } from 'bcrypt';
import { v4 as uuid_v4 } from 'uuid';
import { AUTH_PASSWORD_SALT_ROUND_DEFAULT } from './auth.constants';

@Injectable()
export class PasswordService {
  constructor(private configService: ConfigService) {}

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
   * Returns an a one-way hashed password
   * @param password string
   * @note to prevent null-password attacks, no user shall be created with a null-password
   */
  async hashPassword(password: string): Promise<string> {
    const bcryptSaltOrRound =
      this.configService.get<string>('bcryptSaltOrRound') ||
      AUTH_PASSWORD_SALT_ROUND_DEFAULT;
    password = password || uuid_v4();
    return await hash(password, bcryptSaltOrRound);
  }
}
