import { IsEmail, IsEnum } from 'class-validator';
import { Role, User } from '@prisma/client';
import {
  Field,
  ObjectType,
  registerEnumType,
  HideField,
} from '@nestjs/graphql';
import { BaseModelDto } from '@fullerstack/nsx-common';

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

  @Field({ description: 'User is verified' })
  isVerified: boolean;

  @HideField()
  isActive: boolean;
  @HideField()
  sessionVersion: number;

  @Field()
  username: string;

  @Field()
  firstName: string;
  @Field()
  lastName: string;

  @IsEnum(Role)
  role: Role;
}
