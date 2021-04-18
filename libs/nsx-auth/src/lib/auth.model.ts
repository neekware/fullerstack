import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { AUTH_PASSWORD_MIN_LENGTH } from './auth.constants';

export interface SecurityConfig {
  accessTokenExpiry: string | number;
  sessionTokenExpiry: string | number;
  bcryptSaltOrRound: string | number;
}

/**
 * Auth token (server -> client)
 */
@ObjectType()
export class AuthToken {
  @Field()
  token: string;

  @Field()
  message?: string;

  @Field()
  ok?: boolean;
}

/**
 * User creation type (client -> server)
 */
@InputType()
export class UserCreateInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(AUTH_PASSWORD_MIN_LENGTH)
  password: string;

  @Field()
  @MinLength(4)
  username: string;

  @Field({ nullable: false })
  firstName: string;

  @Field({ nullable: false })
  lastName: string;
}

/**
 * Authentication type (client -> server)
 */
@InputType()
export class UserCredentialsInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(AUTH_PASSWORD_MIN_LENGTH)
  password: string;
}

/**
 * Password change input type (client -> server)
 */
@InputType()
export class ChangePasswordInput {
  @Field()
  @IsNotEmpty()
  @MinLength(AUTH_PASSWORD_MIN_LENGTH)
  oldPassword: string;

  @Field()
  @IsNotEmpty()
  @MinLength(AUTH_PASSWORD_MIN_LENGTH)
  newPassword: string;

  @Field({
    defaultValue: false,
    description: 'Force authentication on all other active sessions',
  })
  resetOtherSessions: boolean;
}
