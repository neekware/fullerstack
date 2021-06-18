/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, environment.serverConfig);

  const globalPrefix = 'api';
  app.setGlobalPrefix(environment.prefix || globalPrefix);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  const port = process.env.PORT || environment.port || 3333;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}/${environment.prefix}`);
}

bootstrap();
