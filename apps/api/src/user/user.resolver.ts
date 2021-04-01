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
import { RegisterUserInput, Member } from './member.model';
@Resolver(Member)
export class MemberResolver {
  constructor(
    @Inject(DatabaseService) private databaseService: DatabaseService
  ) {}

  @ResolveField()
  async posts(@Root() member: Member, @Context() ctx): Promise<Post[]> {
    return this.databaseService.member
      .findUnique({
        where: {
          id: member.id,
        },
      })
      .posts();
  }

  @Mutation((returns) => Member)
  async registerUser(
    @Args('data') data: RegisterUserInput,
    @Context() ctx
  ): Promise<Member> {
    const member = await this.databaseService.member.findUnique({
      where: {
        membername: data.membername,
        email: data.email,
      },
    });

    if (member) {
      throw new HttpException('Member exists', HttpStatus.BAD_REQUEST);
    }

    return this.databaseService.member.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        membername: data.membername,
      },
    });
  }

  @Query((returns) => Member, { nullable: true })
  async member(@Args('id') id: number, @Context() ctx) {
    return this.databaseService.member.findUnique({
      where: { id: id },
    });
  }
}
