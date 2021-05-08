import { AuthModule } from '@fullerstack/nsx-auth';
import { HttpRequest, HttpResponse } from '@fullerstack/nsx-common';
import { PrismaModule } from '@fullerstack/nsx-prisma';
import { UserModule } from '@fullerstack/nsx-user';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { environment } from '../environments/environment';
import { appConfiguration } from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      ...environment.appConfig,
      load: [appConfiguration],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    GraphQLModule.forRoot({
      ...environment.graphqlConfig,
      context: ({ req, res }) => ({
        request: req as HttpRequest,
        response: res as HttpResponse,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [ConfigService, AppService, UserModule],
  exports: [ConfigService],
})
export class AppModule {}
