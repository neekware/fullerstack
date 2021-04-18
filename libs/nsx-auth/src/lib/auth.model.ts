import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

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
