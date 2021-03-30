import 'reflect-metadata';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  Int,
  InputType,
  Field,
} from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { Post } from './post.model';
import { DatabaseService } from '@fullerstack/nsx-database';

@InputType()
class PostIDInput {
  @Field((type) => Int)
  id: number;
}

@Resolver(Post)
export class PostResolver {
  constructor(
    @Inject(DatabaseService)
    private dataService: DatabaseService
  ) {}

  @Query((returns) => Post, { nullable: true })
  post(@Args('where') where: PostIDInput) {
    return this.dataService.post.findUnique({
      where: { id: where.id },
    });
  }

  @Query((returns) => [Post])
  filterPosts(@Args('searchString') searchString: string) {
    return this.dataService.post.findMany({
      where: {
        OR: [
          { title: { contains: searchString } },
          { content: { contains: searchString } },
        ],
      },
    });
  }

  @Query((returns) => [Post])
  feed(@Context() ctx) {
    return this.dataService.post.findMany({
      where: {
        published: true,
      },
    });
  }

  @Mutation((returns) => Post)
  createDraft(
    @Args('title') title: string,
    @Args('content', { nullable: true }) content: string,
    @Args('authorEmail') authorEmail: string,

    @Context() ctx
  ): Promise<Post> {
    return this.dataService.post.create({
      data: {
        title: title,
        content: content,
        author: {
          connect: { email: authorEmail },
        },
      },
    });
  }

  @Mutation((returns) => Post, { nullable: true })
  publish(@Args('id') id: number): Promise<Post | null> {
    return this.dataService.post.update({
      where: {
        id: id,
      },
      data: {
        published: true,
      },
    });
  }

  @Mutation((returns) => Post, { nullable: true })
  deleteOnePost(
    @Args('where') where: PostIDInput,
    @Context() ctx
  ): Promise<Post | null> {
    return this.dataService.post.delete({
      where: {
        id: where.id,
      },
    });
  }
}
