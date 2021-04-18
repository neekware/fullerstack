import { Role } from '@prisma/client';
import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';

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
