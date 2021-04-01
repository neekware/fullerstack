import 'reflect-metadata';
import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { Post } from '../post/post.model';

@ObjectType()
export class Member {
  @Field((type) => ID)
  id: number;

  @Field()
  @IsEmail()
  email: string;

  @Field((type) => String, { nullable: true })
  name?: string | null;

  @Field((type) => Date)
  createdAt?: Date | null;

  @Field((type) => Date)
  updatedAt?: Date | null;

  @Field((type) => [Post], { nullable: true })
  posts?: [Post] | null;
}

@InputType()
export class RegisterUserInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  name: string;

  @Field()
  password: string;
}
