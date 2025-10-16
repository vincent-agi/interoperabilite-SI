import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { CustomLoggerService } from '../logger/custom-logger.service';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { CommandRepository } from './command.repository';
import { CommandEntity } from './entities/command.entity';

@Injectable()
export class CommandsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: CustomLoggerService,
    private readonly commandRepository: CommandRepository,
  ) {
    this.logger.setContext('CommandsService');
  }

  // Générer un numéro de commande aléatoire
  generateOrderNumber(): string {
    return `WL-${Math.floor(Math.random() * 10000)}-${new Date().getTime().toString().slice(-4)}`;
  }

  // Générer une liste de matériels aléatoire
  generateRandomMaterials(): any[] {
    const materials = [
      { name: 'Siège passager', quantity: Math.floor(Math.random() * 10) + 1 },
      { name: 'Éclairage de cabine', quantity: Math.floor(Math.random() * 20) + 1 },
      { name: 'Panneau de contrôle', quantity: Math.floor(Math.random() * 5) + 1 },
      { name: 'Vitres sécurisées', quantity: Math.floor(Math.random() * 15) + 1 },
      { name: 'Portes coulissantes', quantity: Math.floor(Math.random() * 8) + 1 },
    ];

    // Sélectionner 1 à 3 matériels aléatoirement
    const selectedMaterials = [];
    const numMaterials = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numMaterials; i++) {
      const randomIndex = Math.floor(Math.random() * materials.length);
      selectedMaterials.push(materials[randomIndex]);
      materials.splice(randomIndex, 1); // Éviter les doublons
      
      if (materials.length === 0) break;
    }

    return selectedMaterials;
  }

  // Traiter les mises à jour des commandes
  async processUpdate(updateData: any) {
    try {
      // Vérifier si la commande existe
      const existingCommand = await this.commandRepository.findByOrderNumber(updateData.orderNumber);
      
      if (!existingCommand) {
        await this.logger.warn(`Tentative de mise à jour d'une commande inexistante: ${updateData.orderNumber}`);
        return null;
      }

      // Mettre à jour le statut
      const updatedCommand = await this.commandRepository.updateStatus(
        updateData.orderNumber,
        updateData.status || existingCommand.status,
        updateData.updateMessage || `Mise à jour reçue: ${updateData.status || 'Statut inchangé'}`
      );
      
      await this.logger.log(`Commande ${updateData.orderNumber} mise à jour avec le statut: ${updateData.status || existingCommand.status}`);
      
      return updatedCommand;
    } catch (error) {
      await this.logger.error(`Erreur lors de la mise à jour de la commande: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Envoyer une commande de matériel toutes les 30 secondes
  @Cron('*/30 * * * * *')
  async sendMaterialOrder() {
    try {
      const orderNumber = this.generateOrderNumber();
      const materials = this.generateRandomMaterials();
      const now = new Date();

      // Créer l'objet de commande
      const order = {
        orderNumber,
        date: now,
        department: 'Wagon-Lits',
        priority: Math.random() > 0.7 ? 'HIGH' : 'NORMAL',
        materials,
      };

      // Créer l'entité de commande pour la persistance
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

      // Persister la commande en base de données
      await this.commandRepository.save(commandEntity);

      await this.logger.log(`Envoi de la commande ${orderNumber} vers dev-materiels`);
      
      // URL pour accéder au service dev-materiels via l'API gateway
      const response = await firstValueFrom(
        this.httpService.post<any>('http://api-gateway/dev-materiels/orders', order)
      ) as AxiosResponse<any>;

      await this.logger.log(`Réponse reçue pour la commande ${orderNumber}: ${JSON.stringify(response.data)}`);
      
      // Mettre à jour la commande avec les informations de la réponse
      if (response.data && response.data.estimatedDelivery) {
        await this.commandRepository.updateStatus(
          orderNumber, 
          'PROCESSING', 
          `Commande envoyée. Livraison estimée: ${new Date(response.data.estimatedDelivery).toLocaleDateString()}`
        );
        
        // Mettre à jour la date estimée de livraison
        const commandToUpdate = await this.commandRepository.findByOrderNumber(orderNumber);
        if (commandToUpdate) {
          commandToUpdate.estimatedDelivery = new Date(response.data.estimatedDelivery);
          await this.commandRepository.save(commandToUpdate);
        }
      }
      
      return response.data;
    } catch (error) {
      await this.logger.error(`Erreur lors de l'envoi de la commande: ${error.message}`, error.stack);
      throw error;
    }
  }
}