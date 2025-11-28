import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersKafkaController } from './orders-kafka.controller';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '../logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { KafkaModule } from '../kafka/kafka.module';
import { WebhooksModule } from '../webhooks/webhooks.module';


@Module({
  imports: [
    HttpModule,
    WebhooksModule,
    LoggerModule,
    KafkaModule,
    TypeOrmModule.forFeature([OrderEntity])
  ],
  providers: [OrdersService],
  controllers: [OrdersController, OrdersKafkaController],
  exports: [TypeOrmModule]
})
export class OrdersModule {}