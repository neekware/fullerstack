import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from '@fullerstack/nsx-user';

import { appConfiguration } from './app.config';
import { environment } from '../environments/environment';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  imports: [
    TypeOrmModule.forRoot(/* configuration found in ormconfig.json */),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfiguration],
    }),
    UserModule,
    GraphQLModule.forRoot(environment.graphqlOptions),
  ],
  controllers: [AppController],
  providers: [ConfigService, AppService, UserModule],
})
export class AppModule {}
