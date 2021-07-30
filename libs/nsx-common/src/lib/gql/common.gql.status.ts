/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GqlStatusDto {
  @Field({ nullable: true })
  message?: string;

  @Field()
  ok: boolean;
}
