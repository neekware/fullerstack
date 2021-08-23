/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Ipware } from '@fullerstack/nax-ipware';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

async function bootstrap() {
  const ipware = new Ipware();
  const app = await NestFactory.create(AppModule, environment.serverConfig);

  const globalPrefix = 'api';
  app.setGlobalPrefix(environment.prefix || globalPrefix);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(function (req, res, next) {
    req.ipInfo = ipware.getClientIP(req);
    next();
  });
  const port = process.env.PORT || environment.port || 3333;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}/${environment.prefix}`);
}

bootstrap();
