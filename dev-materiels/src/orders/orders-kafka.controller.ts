import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CustomLoggerService } from '../logger/custom-logger.service';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersKafkaController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.setContext('OrdersKafkaController');
  }

  @EventPattern('orders')
  async handleOrderEvent(@Payload() message: any) {
    try {
      await this.logger.log(`Message Kafka brut reçu: ${JSON.stringify(message)}`);
      
      const orderData = message.value || message;
      await this.logger.log(`Message Kafka reçu sur le topic 'orders': ${JSON.stringify(orderData)}`);
      
      await this.logger.log(`processOrder() called with data: ${JSON.stringify(orderData)}`);
      const result = await this.ordersService.processOrder(orderData);
      await this.logger.log(`Commande traitée avec succès via Kafka: ${result.confirmationId}`);
    } catch (error) {
      await this.logger.error(`Erreur lors du traitement de la commande via Kafka: ${error.message}`, error.stack);
    }
  }
}