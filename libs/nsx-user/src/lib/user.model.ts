import { IsEmail } from 'class-validator';
import { Role, User } from '@prisma/client';
import { Field, ObjectType, InputType, ID } from '@nestjs/graphql';
import { BaseModelDto, PartialPick } from '@fullerstack/nsx-common';

/**
 * User type (restricted for self, admin, staff)
 */
type UserEnforcedSecurity = Omit<User, 'password'>;

/**
 * User profile (server -> client)
 */
@ObjectType()
export class UserDto extends BaseModelDto implements UserEnforcedSecurity {
  @Field({ nullable: true })
  @IsEmail()
  email: string;

  @Field({ nullable: true, description: 'User is verified' })
  isVerified: boolean;

  @Field({ nullable: true, description: 'User is active' })
  isActive: boolean;

  @Field({ nullable: true, description: 'Session Version' })
  sessionVersion: number;

  @Field({ nullable: true })
  username: string;

  @Field({ nullable: true })
  firstName: string;
  @Field({ nullable: true })
  lastName: string;

  @Field((type) => Role, { nullable: true })
  role: Role;
}

type UserUpdatableFields = PartialPick<
  User,
  'id' | 'firstName' | 'lastName' | 'role'
>;

@InputType()
export class UserUpdateInput implements UserUpdatableFields {
  @Field((type) => ID)
  id: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field((type) => Role)
  role?: Role;
}
