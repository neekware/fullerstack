import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { PrismaModule } from '@fullerstack/nsx-prisma';
import { AuthModule } from '@fullerstack/nsx-auth';
import { UserModule } from '@fullerstack/nsx-user';

import { appConfiguration } from './app.config';
import { environment } from '../environments/environment';
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
      context: ({ req, res }) => ({ req, res }),
    }),
  ],
  controllers: [AppController],
  providers: [ConfigService, AppService, UserModule],
  exports: [ConfigService],
})
export class AppModule {}
