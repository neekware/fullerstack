/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { GqlStatusDto } from '@fullerstack/nsx-common';
import { Directive, Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

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

@ObjectType()
export class AuthStatusDto extends GqlStatusDto {}

/**
 * Auth token (server -> client)
 */
@ObjectType()
export class AuthTokenDto extends AuthStatusDto {
  @Field()
  token: string;
}

/**
 * User creation type (client -> server)
 */
@InputType()
export class AuthUserSignupInput {
  @Directive('@lowercase')
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(AUTH_PASSWORD_MIN_LENGTH)
  password: string;

  @Field({ nullable: false })
  firstName: string;

  @Field({ nullable: false })
  lastName: string;

  @Field({ nullable: false })
  language: string;
}

/**
 * Authentication type (client -> server)
 */
@InputType()
export class AuthUserCredentialsInput {
  @Directive('@lowercase')
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;
}

/**
 * Authentication type (client -> server)
 */
@InputType()
export class AuthUserVerifyInput {
  @Field()
  @IsNotEmpty()
  token: string;
}

/**
 * Authentication type (client -> server)
 */
@InputType()
export class AuthPasswordPerformResetInput {
  @Field()
  @IsNotEmpty()
  token: string;

  @Field()
  @IsNotEmpty()
  password: string;

  @Field({ defaultValue: false })
  resetOtherSessions: boolean;
}

/**
 * Authentication type (client -> server)
 */
@InputType()
export class AuthPasswordVerifyResetRequestInput {
  @Field()
  @IsNotEmpty()
  token: string;
}

/**
 * Password change input type (client -> server)
 */
@InputType()
export class AuthPasswordChangeInput {
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

@InputType()
export class AuthPasswordChangeRequestInput {
  @Directive('@lowercase')
  @Field()
  @IsEmail()
  email: string;
}

@InputType()
export class AuthPasswordVerifyInput {
  @Field()
  @IsNotEmpty()
  @MinLength(AUTH_PASSWORD_MIN_LENGTH)
  password: string;
}

@InputType()
export class AuthEmailVerifyAvailabilityInput {
  @Directive('@lowercase')
  @Field()
  @IsEmail()
  email: string;
}

@InputType()
export class AuthEmailChangeRequestInput {
  @Directive('@lowercase')
  @Field()
  @IsEmail()
  email: string;
}

/**
 * Authentication type (client -> server)
 */
@InputType()
export class AuthEmailChangePerformInput {
  @Field()
  @IsNotEmpty()
  token: string;
}
