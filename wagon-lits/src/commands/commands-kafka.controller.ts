import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CustomLoggerService } from '../logger/custom-logger.service';
import { CommandsService } from './commands.service';

@Controller()
export class CommandsKafkaController {
  constructor(
    private readonly commandsService: CommandsService,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.setContext('CommandsKafkaController');
  }

  @EventPattern('order-updates')
  async handleOrderUpdateEvent(@Payload() message: any) {
    try {
      await this.logger.log(`Message Kafka brut reçu: ${JSON.stringify(message)}`);
      
      const updateData = message.value || message;
      await this.logger.log(`Message Kafka reçu sur le topic 'order-updates': ${JSON.stringify(updateData)}`);
      
      const result = await this.commandsService.processUpdate(updateData);
      if (result) {
        await this.logger.log(`Mise à jour de la commande traitée avec succès via Kafka: ${updateData.orderNumber}`);
      } else {
        await this.logger.warn(`Commande non trouvée pour la mise à jour via Kafka: ${updateData.orderNumber}`);
      }
    } catch (error) {
      await this.logger.error(`Erreur lors du traitement de la mise à jour via Kafka: ${error.message}`, error.stack);
    }
  }
}