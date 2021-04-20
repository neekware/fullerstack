import { IsEmail, IsOptional } from 'class-validator';
import { Role, User } from '@prisma/client';
import { Field, ObjectType, InputType, ID, Directive } from '@nestjs/graphql';
import { BaseModelDto, PartialPick } from '@fullerstack/nsx-common';

/**
 * User type (restricted for self, admin, staff, superuser)
 * Change permission type to list of string (pending prism's support of union in enums)
 */
type UserEnforcedSecurity = Omit<User, 'password' | 'permissions'>;

/**
 * User profile (server -> client)
 */
@ObjectType()
export class UserDto extends BaseModelDto implements UserEnforcedSecurity {
  @Directive('@lowercase')
  @Field({ nullable: true })
  @IsEmail()
  email: string;

  @Field({ nullable: true, description: 'User is verified' })
  isVerified: boolean;

  @Field({ nullable: true, description: 'User is active' })
  isActive: boolean;

  @Field({ nullable: true, description: 'Session version' })
  sessionVersion: number;

  @Directive('@lowercase')
  @Field({ nullable: true })
  username: string;

  @Field({ nullable: true })
  firstName: string;
  @Field({ nullable: true })
  lastName: string;

  @Field((type) => Role, { nullable: true })
  role: Role;

  @Field((type) => ID)
  groupId: string;

  @Field((type) => [String])
  permissions: string[];
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
}

@InputType()
export class UserChangeEmailInput {
  @Field((type) => ID)
  id: string;

  @Directive('@lowercase')
  @Field()
  email?: string;
}
