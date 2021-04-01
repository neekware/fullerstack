import { Field, ObjectType, HideField } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { BaseModel, Role } from '@fullerstack/nsx-common';

@ObjectType()
export class User extends BaseModel {
  @Field()
  @IsEmail()
  email: string;
  username: string;
  emailVerified: boolean;
  name?: string;
  groupId?: number;
  role: Role;
  @HideField()
  password: string;
}
