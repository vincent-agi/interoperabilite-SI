import { Controller, Post, Body, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CustomLoggerService } from '../logger/custom-logger.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.setContext('OrdersController');
  }

  @Post()
  receiveOrder(@Body() orderData: any) {
    this.logger.log(`Commande reçue de wagon-lits: ${JSON.stringify(orderData)}`);
    return this.ordersService.processOrder(orderData);
  }

  @Get('status')
  getStatus() {
    this.logger.log('Requête sur le statut du service');
    return { 
      status: 'active',
      timestamp: new Date(),
      service: 'Dev-Materiels',
      version: '1.0.0'
    };
  }
}