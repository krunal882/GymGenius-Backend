import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(bodyParser.raw({ type: 'application/json' }));

  app.enableCors({
    origin: 'http://localhost:8081',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  app.enableShutdownHooks();
  await app.init();

  await app.listen(3000);
}
bootstrap();
