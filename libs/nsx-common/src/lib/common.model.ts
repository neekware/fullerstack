/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Permission, Role, User } from '@prisma/client';

/**
 * Augment Request with a user attribute
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html
 */
declare module 'express' {
  export interface Request {
    user: User;
  }
}

export interface ApplicationConfig {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [id: string]: any;
}

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
