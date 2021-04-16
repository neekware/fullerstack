import { getMetadataArgsStorage } from 'typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from '@fullerstack/nsx-user';

import { appConfiguration } from './app.config';
import { environment } from '../environments/environment';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...(environment.ormConfig as TypeOrmModuleOptions),
      entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfiguration],
    }),
    UserModule,
    // GraphQLModule.forRoot(environment.graphqlOptions),
  ],
  controllers: [AppController],
  providers: [ConfigService, AppService, UserModule],
})
export class AppModule {}
