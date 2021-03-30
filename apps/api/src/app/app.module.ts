import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { environment } from '../environments/environment';
import { UserService } from '../user/user.service';
import { PostService } from '../post/post.service';
import { PrismaService } from '../database/database.service';

@Module({
  // imports: [GraphQLModule.forRoot(environment.graphqlOptions)],
  controllers: [AppController],
  providers: [AppService, PrismaService, UserService, PostService],
})
export class AppModule {}
