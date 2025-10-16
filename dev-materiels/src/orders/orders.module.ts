import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    HttpModule,
    LoggerModule
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}