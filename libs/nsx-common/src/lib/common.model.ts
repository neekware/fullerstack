import { Role, User } from '@prisma/client';
import {
  Field,
  ObjectType,
  ID,
  registerEnumType,
  HideField,
} from '@nestjs/graphql';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});

@ObjectType({ isAbstract: true })
export abstract class BaseModelDto {
  @Field((type) => ID)
  id: string;

  @Field({ description: "Object's creation time" })
  createdAt: Date;

  @Field({ description: "Object's update time" })
  updatedAt: Date;
}

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

export interface SecurityConfig {
  expiresIn: string | number;
  refreshIn: string | number;
  bcryptSaltOrRound: string | number;
}
