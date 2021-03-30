import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(environment.serverOptions)
  );
  app.setGlobalPrefix(environment.prefix);
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || environment.port || 3333;
  await app.listen(port);
  console.log(
    `Application is running on: ${await app.getUrl()}/${environment.prefix}`
  );
}
bootstrap();
