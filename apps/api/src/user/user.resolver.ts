import 'reflect-metadata';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  ResolveField,
  Root,
} from '@nestjs/graphql';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { DatabaseService } from '@fullerstack/nsx-database';
import { Post } from '../post/post.model';
import { RegisterUserInput, User } from './user.model';
@Resolver(User)
export class UserResolver {
  constructor(
    @Inject(DatabaseService) private databaseService: DatabaseService
  ) {}

  @ResolveField()
  async posts(@Root() user: User, @Context() ctx): Promise<Post[]> {
    return this.databaseService.user
      .findUnique({
        where: {
          id: user.id,
        },
      })
      .posts();
  }

  @Mutation((returns) => User)
  async registerUser(
    @Args('data') data: RegisterUserInput,
    @Context() ctx
  ): Promise<User> {
    const user = await this.databaseService.user.findUnique({
      where: {
        username: data.username,
        email: data.email,
      },
    });

    if (user) {
      throw new HttpException('User exists', HttpStatus.BAD_REQUEST);
    }

    return this.databaseService.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        username: data.username,
      },
    });
  }

  @Query((returns) => User, { nullable: true })
  async user(@Args('id') id: number, @Context() ctx) {
    return this.databaseService.user.findUnique({
      where: { id: id },
    });
  }
}
