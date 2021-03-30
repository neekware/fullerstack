import 'reflect-metadata';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  ResolveField,
  Root,
  InputType,
  Field,
} from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { DatabaseService } from '@fullerstack/nsx-database';
import { Post } from '../post/post.model';
import { User } from './user.model';

@InputType()
class SignupUserInput {
  @Field({ nullable: true })
  name: string;

  @Field()
  email: string;
}

@Resolver(User)
export class UserResolver {
  constructor(
    @Inject(DatabaseService) private prismaService: DatabaseService
  ) {}

  @ResolveField()
  async posts(@Root() user: User, @Context() ctx): Promise<Post[]> {
    return this.prismaService.user
      .findUnique({
        where: {
          id: user.id,
        },
      })
      .posts();
  }

  @Mutation((returns) => User)
  async signupUser(
    @Args('data') data: SignupUserInput,
    @Context() ctx
  ): Promise<User> {
    return this.prismaService.user.create({
      data: {
        email: data.email,
        name: data.name,
      },
    });
  }

  @Query((returns) => User, { nullable: true })
  async user(@Args('id') id: number, @Context() ctx) {
    return this.prismaService.user.findUnique({
      where: { id: id },
    });
  }
}
