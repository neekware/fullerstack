import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, compare } from 'bcrypt';
import { USER_PASSWORD_SALT_ROUNT } from './user.constants';

@Injectable()
export class PasswordService {
  constructor(private configService: ConfigService) {}

  /**
   * Returns true if text password is the same as the saved password
   * @param password text password
   */
  async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  /**
   * Returns an a one-way hassed password
   * @param password string
   * @note to prevent null-password attacks, no user shall be created with a null-password
   */
  async hashPassword(password: string): Promise<string> {
    const bcryptSaltOrRound =
      this.configService.get<string>('bcryptSaltOrRound') ||
      USER_PASSWORD_SALT_ROUNT;
    password = password || Math.random().toString();
    return await hash(password, bcryptSaltOrRound);
  }
}
