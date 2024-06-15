import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { urlencoded } from 'express';
import helmet from 'helmet';
import * as xss from 'xss-clean';
import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  // Creating a Nest application instance
  const app = await NestFactory.create(AppModule);

  // Applying Helmet middleware for setting various HTTP headers to secure the app
  app.use(helmet());

  // Applying XSS-clean middleware to sanitize user input and prevent XSS attacks
  app.use(xss());

  // Setting up middleware to parse URL-encoded request bodies
  app.use(urlencoded({ extended: true }));

  // Enabling CORS with specific configuration to allow requests from certain origins
  app.enableCors({
    origin: 'http://localhost:8081', // Allowing requests from this origin
    credentials: true, // Allowing credentials such as cookies and authorization headers
  });

  // Applying global validation pipe for request validation
  app.useGlobalPipes(new ValidationPipe());
  // Applying global filter to handle HTTP exceptions
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enabling shutdown hooks for graceful shutdown of the application
  app.enableShutdownHooks();

  // Getting the underlying Express instance
  const expressApp = app.getHttpAdapter().getInstance();

  // Disabling the 'X-Powered-By' header to prevent information disclosure
  expressApp.disable('x-powered-by');

  // Initializing the Nest application
  await app.init();

  // Starting the application, listening on port 3000
  await app.listen(3000);
}
bootstrap();
