import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Permission, Role } from '@prisma/client';

export { Request as HttpRequest, Response as HttpResponse } from 'express';

export type PartialPick<T, K extends keyof T> = {
  [P in K]?: T[P];
};

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});

registerEnumType(Permission, {
  name: 'Permission',
  description: 'User permission',
});

@ObjectType({ isAbstract: true })
export abstract class BaseModelDto {
  @Field(() => ID)
  id: string;

  @Field({ description: "Object's creation time" })
  createdAt: Date;

  @Field({ description: "Object's update time" })
  updatedAt: Date;
}
