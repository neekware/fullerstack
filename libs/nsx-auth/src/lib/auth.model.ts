import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Directive, Field, InputType, ObjectType } from '@nestjs/graphql';
import { AUTH_PASSWORD_MIN_LENGTH } from './auth.constant';

export interface SecurityConfig {
  accessTokenExpiry: string | number;
  sessionTokenExpiry: string | number;
  bcryptSaltOrRound: string | number;
}

export interface AuthFilterType<T> {
  include?: T[];
  exclude?: T[];
}

/**
 * Auth token (server -> client)
 */
@ObjectType()
export class AuthTokenDto {
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
  @Directive('@lowercase')
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
  @Directive('@lowercase')
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
