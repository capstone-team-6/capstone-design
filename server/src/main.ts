import { NestFactory } from '@nestjs/core';
import { assertEnv, loadDotEnv } from './configuration';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  loadDotEnv();
  assertEnv();

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
