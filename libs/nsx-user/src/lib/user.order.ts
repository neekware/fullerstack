import { Order, OrderDirection } from '@fullerstack/nsx-common';
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
  @Field((type) => UserOrderField)
  field: UserOrderField;
}
