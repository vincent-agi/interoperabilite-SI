import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from './app.module';
import { CustomLoggerService } from './logger/custom-logger.service';
import { NestLoggerAdapter } from './logger/nest-logger-adapter';

async function bootstrap() {
  const logDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const app = await NestFactory.create(AppModule);
  const customLogger = app.get(CustomLoggerService);
  const nestLogger = app.get(NestLoggerAdapter);
  app.useLogger(nestLogger);
  app.setGlobalPrefix('dev-materiels');
  await app.listen(3001);
  await customLogger.log(`Application is running on: ${await app.getUrl()}`, 'Bootstrap');
}
bootstrap();