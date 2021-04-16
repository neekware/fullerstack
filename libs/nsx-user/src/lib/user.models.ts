import { registerEnumType } from '@nestjs/graphql';
import { Role } from './user.types';

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});

// import { Field, ObjectType, HideField } from '@nestjs/graphql';
// import { IsEmail } from 'class-validator';
// import { BaseModel } from '@fullerstack/nsx-common';

// @ObjectType()
// export class User extends BaseModel implements UserType {
//   @Field()
//   @IsEmail()
//   email: string;
//   @HideField()
//   password: string;
//   username: string;
//   verified: boolean | null;
//   name: string | null;
//   firstname: string | null;
//   lastname: string | null;
//   role: Role;
// }
