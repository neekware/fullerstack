import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { environment } from '../environments/environment';
import { PrismaService } from '../database/database.service';
import { UserResolver } from '../user/user.resolver';
import { PostResolver } from '../post/post.resolver';

@Module({
  imports: [GraphQLModule.forRoot(environment.graphqlOptions)],
  controllers: [AppController],
  providers: [AppService, PrismaService, UserResolver, PostResolver],
})
export class AppModule {}
