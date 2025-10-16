import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '../logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';

@Module({
  imports: [
    HttpModule,
    LoggerModule,
    TypeOrmModule.forFeature([OrderEntity])
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [TypeOrmModule]
})
export class OrdersModule {}