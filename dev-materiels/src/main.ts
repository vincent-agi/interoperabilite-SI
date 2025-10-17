import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from './app.module';
import { CustomLoggerService } from './logger/custom-logger.service';
import { NestLoggerAdapter } from './logger/nest-logger-adapter';
import { Partitioners } from 'kafkajs';

async function bootstrap() {
  const logDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const app = await NestFactory.create(AppModule);
  const customLogger = app.get(CustomLoggerService);
  const nestLogger = app.get(NestLoggerAdapter);
  app.useLogger(nestLogger);
  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'dev-materiels-server',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'dev-materiels-consumer-server',
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner
      },
    },
  });
  
  await app.startAllMicroservices();
  await customLogger.log('Microservice Kafka démarré', 'Bootstrap');
  
  app.setGlobalPrefix('dev-materiels');
  await app.listen(3001);
  await customLogger.log(`Application HTTP est en cours d'exécution: ${await app.getUrl()}`, 'Bootstrap');
}
bootstrap();