/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GqlStatusDto {
  @Field({ nullable: true })
  message?: string;

  @Field()
  ok: boolean;
}
