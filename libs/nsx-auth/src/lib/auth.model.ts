import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UserCreateInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8)
  password: string;

  @Field()
  @MinLength(4)
  username: string;

  @Field({ nullable: false })
  firstName: string;

  @Field({ nullable: false })
  lastName: string;
}

@InputType()
export class UserCredentialsInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
