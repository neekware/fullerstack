import { BaseModelDto, Paginated } from '@fullerstack/nsx-common';
import { Directive, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Permission, Role, User } from '@prisma/client';
import { IsEmail } from 'class-validator';

/**
 * User profile (server -> client)
 */
@ObjectType()
export class UserDto extends BaseModelDto implements Partial<User> {
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

  @Field(() => Role, { nullable: true })
  role: Role;

  @Field(() => [Permission], { nullable: true })
  permissions: Permission[];

  @Field(() => ID, { nullable: true })
  groupId: string;
}

@InputType()
export class UserUpdateInput implements Partial<User> {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;
}
@InputType()
export class UserUpdateAdvancedInput implements Partial<User> {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true, description: 'User is verified' })
  isVerified?: boolean;

  @Field({ nullable: true, description: 'User is active' })
  isActive?: boolean;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field(() => Role, { nullable: true })
  role?: Role;

  @Field(() => [Permission])
  permissions?: Permission[];

  @Field(() => ID, { nullable: true })
  groupId?: string;
}

@InputType()
export class UserChangeEmailInput {
  @Field(() => ID)
  id: string;

  @Directive('@lowercase')
  @Field()
  email: string;
}

@InputType()
export class UserChangeUsernameInput {
  @Field(() => ID)
  id: string;

  @Directive('@lowercase')
  @Field()
  username: string;
}

@InputType()
export class UserWhereInput implements Partial<User> {
  @Field(() => ID)
  id: string;

  @Directive('@lowercase')
  @Field()
  @IsEmail()
  email?: string;

  @Directive('@lowercase')
  @Field()
  username?: string;

  @Field()
  isVerified?: boolean;

  @Field()
  isActive?: boolean;

  @Field()
  firstName?: string;

  @Field()
  lastName?: string;

  @Field(() => Role)
  role?: Role;

  @Field(() => [Permission])
  permissions?: Permission[];

  @Field(() => ID, { nullable: true })
  groupId: string;
}

@InputType()
export class UserWhereUniqueInput implements Partial<User> {
  @Field(() => ID)
  id?: string;

  @Directive('@lowercase')
  @Field()
  @IsEmail()
  email?: string;

  @Directive('@lowercase')
  @Field()
  username?: string;
}

@ObjectType()
export class PaginatedUser extends Paginated(UserDto) {}
