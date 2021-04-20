import { Role, Permission } from '@prisma/client';
import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';

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
  @Field((type) => ID)
  id: string;

  @Field({ description: "Object's creation time" })
  createdAt: Date;

  @Field({ description: "Object's update time" })
  updatedAt: Date;
}
