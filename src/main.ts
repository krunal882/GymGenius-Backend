import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Creating a Nest application instance

  // Setting up middleware to parse JSON and URL-encoded request bodies
  app.use(json());
  app.use(urlencoded({ extended: true }));
  // Using bodyParser.raw middleware for parsing raw JSON bodies
  app.use(bodyParser.raw({ type: 'application/json' }));

  // Enabling CORS with specific configuration
  app.enableCors({
    origin: 'http://localhost:8081',
    credentials: true,
  });

  // Applying global validation pipe for request validation
  app.useGlobalPipes(new ValidationPipe());

  // Enabling shutdown hooks for graceful shutdown
  app.enableShutdownHooks();

  // Initializing the Nest application
  await app.init();

  // Starting the application, listening on port 3000
  await app.listen(3000);
}
bootstrap();
