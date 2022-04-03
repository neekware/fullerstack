/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  // @Field((type) => String, { nullable: true })
  startCursor?: string;

  // @Field((type) => String, { nullable: true })
  endCursor?: string;

  // @Field((type) => Boolean)
  hasNextPage: boolean;

  // @Field((type) => Boolean)
  hasPreviousPage: boolean;
}
