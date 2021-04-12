import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(environment.prefix || globalPrefix);
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || environment.port || 3333;
  await app.listen(port);

  console.log(
    `Application is running on: http://localhost:${port}/${environment.prefix}`
  );
}

bootstrap();
