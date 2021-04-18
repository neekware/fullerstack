import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Role, User } from '@prisma/client';
import {
  Field,
  ObjectType,
  registerEnumType,
  HideField,
  InputType,
} from '@nestjs/graphql';
import { BaseModelDto } from '@fullerstack/nsx-common';

export interface SecurityConfig {
  accessTokenExpiry: string | number;
  sessionTokenExpiry: string | number;
  bcryptSaltOrRound: string | number;
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
  @MinLength(8)
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
  @MinLength(8)
  password: string;
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});

/**
 * User profile (server -> client)
 */
@ObjectType()
export class UserDto extends BaseModelDto implements User {
  @Field()
  @IsEmail()
  email: string;

  @HideField()
  password: string;

  @Field({ description: 'User is active' })
  isActive: boolean;

  @Field({ description: 'User is verified' })
  isVerified: boolean;

  @HideField()
  token: string;
  @HideField()
  tokenVersion: number;

  @Field()
  username: string;

  @Field()
  firstName: string;
  @Field()
  lastName: string;

  @IsEnum(Role)
  role: Role;
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
