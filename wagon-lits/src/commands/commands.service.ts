import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { CustomLoggerService } from '../logger/custom-logger.service';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommandEntity } from './entities/command.entity';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class CommandsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: CustomLoggerService,
    @InjectRepository(CommandEntity)
    private commandRepository: Repository<CommandEntity>,
    private readonly kafkaService: KafkaService,
  ) {
    this.logger.setContext('CommandsService');
  }

  generateOrderNumber(): string {
    return `WL-${Math.floor(Math.random() * 10000)}-${new Date().getTime().toString().slice(-4)}`;
  }

  generateRandomMaterials(): any[] {
    const materials = [
      { name: 'Siège passager', quantity: Math.floor(Math.random() * 10) + 1 },
      { name: 'Éclairage de cabine', quantity: Math.floor(Math.random() * 20) + 1 },
      { name: 'Panneau de contrôle', quantity: Math.floor(Math.random() * 5) + 1 },
      { name: 'Vitres sécurisées', quantity: Math.floor(Math.random() * 15) + 1 },
      { name: 'Portes coulissantes', quantity: Math.floor(Math.random() * 8) + 1 },
    ];

    const selectedMaterials = [];
    const numMaterials = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numMaterials; i++) {
      const randomIndex = Math.floor(Math.random() * materials.length);
      selectedMaterials.push(materials[randomIndex]);
      materials.splice(randomIndex, 1);
      
      if (materials.length === 0) break;
    }

    return selectedMaterials;
  }

  async processUpdate(updateData: any) {
    try {
      const existingCommand = await this.commandRepository.findOne({ where: { orderNumber: updateData.orderNumber } });
      
      if (!existingCommand) {
        await this.logger.warn(`Tentative de mise à jour d'une commande inexistante: ${updateData.orderNumber}`);
        return null;
      }

      const now = new Date();
      const status = updateData.status || existingCommand.status;
      const updateMessage = updateData.updateMessage || `Mise à jour reçue: ${updateData.status || 'Statut inchangé'}`;
      
      if (!existingCommand.updates) {
        existingCommand.updates = [];
      }
      
      existingCommand.updates.push({
        timestamp: now,
        status,
        message: updateMessage
      });
      
      existingCommand.status = status;
      existingCommand.lastUpdateAt = now;
      
      const updatedCommand = await this.commandRepository.save(existingCommand);
      
      await this.logger.log(`Commande ${updateData.orderNumber} mise à jour avec le statut: ${status}`);
      
      return updatedCommand;
    } catch (error) {
      await this.logger.error(`Erreur lors de la mise à jour de la commande: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Cron('*/30 * * * * *')
  async sendMaterialOrder() {
    try {
      const orderNumber = this.generateOrderNumber();
      const materials = this.generateRandomMaterials();
      const now = new Date();

      const order = {
        orderNumber,
        date: now,
        department: 'Wagon-Lits',
        priority: Math.random() > 0.7 ? 'HIGH' : 'NORMAL',
        materials,
      };

      const commandEntity = new CommandEntity();
      commandEntity.orderNumber = orderNumber;
      commandEntity.date = now;
      commandEntity.department = 'Wagon-Lits';
      commandEntity.priority = order.priority;
      commandEntity.materials = materials;
      commandEntity.status = 'NEW';
      commandEntity.updates = [{
        timestamp: now,
        status: 'NEW',
        message: 'Commande créée'
      }];

      try {
        await this.logger.log(`Tentative de sauvegarde de la commande: ${JSON.stringify(commandEntity)}`);
        await this.commandRepository.save(commandEntity);
        await this.logger.log(`Commande sauvegardée avec succès: ${orderNumber}`);
      } catch (error) {
        await this.logger.error(`Erreur lors de la sauvegarde de la commande: ${error.message}`, error.stack);
      }

      await this.logger.log(`Envoi de la commande ${orderNumber} vers dev-materiels via Kafka`);

      await this.kafkaService.sendMessage('orders', order);
      await this.logger.log(`Commande ${orderNumber} envoyée via Kafka`);
      
      const response = await firstValueFrom(
        this.httpService.post<any>('http://api-gateway/dev-materiels/orders', order)
      ) as AxiosResponse<any>;

      await this.logger.log(`Réponse HTTP reçue pour la commande ${orderNumber}: ${JSON.stringify(response.data)}`);
      
      if (response.data && response.data.estimatedDelivery) {
        try {
          const commandToUpdate = await this.commandRepository.findOne({ where: { orderNumber } });
          
          if (commandToUpdate) {
            const now = new Date();
            const updateMessage = `Commande envoyée. Livraison estimée: ${new Date(response.data.estimatedDelivery).toLocaleDateString()}`;

            if (!commandToUpdate.updates) {
              commandToUpdate.updates = [];
            }
            
            commandToUpdate.updates.push({
              timestamp: now,
              status: 'PROCESSING',
              message: updateMessage
            });
            
            commandToUpdate.status = 'PROCESSING';
            commandToUpdate.lastUpdateAt = now;
            commandToUpdate.estimatedDelivery = new Date(response.data.estimatedDelivery);

            await this.commandRepository.save(commandToUpdate);
            await this.logger.log(`Commande ${orderNumber} mise à jour avec la date de livraison estimée`);
          }
        } catch (error) {
          await this.logger.error(`Erreur lors de la mise à jour avec la date de livraison: ${error.message}`, error.stack);
        }
      }
      
      return response.data;
    } catch (error) {
      await this.logger.error(`Erreur lors de l'envoi de la commande: ${error.message}`, error.stack);
      throw error;
    }
  }
}