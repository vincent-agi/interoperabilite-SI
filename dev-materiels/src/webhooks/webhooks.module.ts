import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    HttpModule,
    LoggerModule,
  ],
  controllers: [WebhooksController],
  providers: [WebhooksService],
  exports: [WebhooksService], // pour que OrdersService puisse l'injecter
})
export class WebhooksModule {}
