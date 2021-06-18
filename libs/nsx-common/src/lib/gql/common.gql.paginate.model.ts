/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
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
