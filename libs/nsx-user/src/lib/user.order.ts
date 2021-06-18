/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Order } from '@fullerstack/nsx-common';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum UserOrderField {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  firstName = 'firstName',
  lastName = 'lastName',
  username = 'username',
}

registerEnumType(UserOrderField, {
  name: 'UserOrderField',
  description: 'User connection order list.',
});

@InputType()
export class UserOrder extends Order {
  @Field(() => UserOrderField)
  field: UserOrderField;
}
