import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DatabaseModule } from '@fullerstack/nsx-database';

import { environment } from '../environments/environment';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserResolver } from '../user/user.resolver';
import { PostResolver } from '../post/post.resolver';

@Module({
  imports: [GraphQLModule.forRoot(environment.graphqlOptions), DatabaseModule],
  controllers: [AppController],
  providers: [AppService, UserResolver, PostResolver],
})
export class AppModule {}
