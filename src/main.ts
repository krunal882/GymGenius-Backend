import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
