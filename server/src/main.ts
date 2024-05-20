import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { ResultExceptionFilter } from './common/filters/result';
import { ResultInterceptor } from './common/interceptors/result';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.enableCors();
  app.useGlobalInterceptors(new ResultInterceptor());
  app.useGlobalFilters(new ResultExceptionFilter());
  app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(3000);
}
bootstrap();
