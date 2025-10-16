import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { CustomLoggerService } from '../logger/custom-logger.service';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { OrderRepository } from './order.repository';
import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: CustomLoggerService,
    private readonly orderRepository: OrderRepository,
  ) {
    this.logger.setContext('OrdersService');
  }

  /**
   * Genere un ID de confirmation cd commande
   * @returns {string} ID
   */
  generateConfirmationId(): string {
    return `DM-${Math.floor(Math.random() * 10000)}-${new Date().getTime().toString().slice(-4)}`;
  }
  
  /**
   * Traitement d'une demande entrante
   * @param orderData 
   * @returns Order processing
   */
  async processOrder(orderData: any) {
    const confirmationId = this.generateConfirmationId();
    const now = new Date();
    
    // Ajouter un délai de traitement estimé
    const estimatedProcessingDays = Math.floor(Math.random() * 5) + 1;
    const estimatedDelivery = new Date(now);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + estimatedProcessingDays);
    
    // Créer l'entité d'ordre pour la persistance
    const orderEntity = new OrderEntity();
    orderEntity.orderNumber = orderData.orderNumber;
    orderEntity.date = orderData.date;
    orderEntity.department = orderData.department;
    orderEntity.priority = orderData.priority;
    orderEntity.materials = orderData.materials;
    orderEntity.status = 'PROCESSING';
    
    // Persister l'ordre dans la base de données
    const savedOrder = await this.orderRepository.save(orderEntity);
    
    await this.logger.log(`Commande ${orderData.orderNumber} reçue et traitée avec ID de confirmation ${confirmationId}`);
    
    return {
      confirmationId,
      orderNumber: orderData.orderNumber,
      received: now,
      status: 'PROCESSING',
      estimatedDelivery,
      message: `Commande reçue et en cours de traitement. Livraison estimée: ${estimatedDelivery.toLocaleDateString()}`,
    };
  }

  // Envoyer des mises à jour sur les commandes toutes les 30 secondes (simulation)
  @Cron('*/30 * * * * *')
  async sendOrderUpdates() {
    try {
      // Récupérer les commandes en traitement
      const orders = await this.orderRepository.findAll({ status: 'PROCESSING', limit: 10 });
      
      // Ne rien faire si aucune commande n'est enregistrée
      if (orders.length === 0) {
        return;
      }

      // Sélectionner une commande aléatoire pour mise à jour
      const orderIndex = Math.floor(Math.random() * orders.length);
      const order = orders[orderIndex];
      
      // Générer une mise à jour aléatoire
      const updates = [
        'Matériaux en préparation',
        'Contrôle qualité en cours',
        'Emballage des matériaux',
        'Expédition planifiée',
        'Expédié'
      ];
      
      const updateIndex = Math.floor(Math.random() * updates.length);
      const updateMessage = updates[updateIndex];
      
      // Créer un nouveau statut si c'est "Expédié"
      const newStatus = updateIndex === updates.length - 1 ? 'SHIPPED' : 'PROCESSING';
      
      // Mettre à jour le statut dans la base de données
      const updatedOrder = await this.orderRepository.updateStatus(order.orderNumber, newStatus);
      
      const update = {
        orderNumber: order.orderNumber,
        timestamp: new Date(),
        status: newStatus,
        updateMessage,
      };

      await this.logger.log(`Envoi de mise à jour pour la commande ${order.orderNumber}: ${updateMessage}`);
      
      // Envoyer la mise à jour via l'API gateway
      try {
        const response = await firstValueFrom(
          this.httpService.post<any>('http://api-gateway/wagon-list/commands', update)
        ) as AxiosResponse<any>;
        
        await this.logger.log(`Réponse de wagon-lits pour la mise à jour: ${JSON.stringify(response.data)}`);
        
        if (newStatus === 'SHIPPED') {
          await this.logger.log(`Commande ${order.orderNumber} marquée comme expédiée`);
        }
      } catch (error) {
        await this.logger.error(`Erreur lors de l'envoi de la mise à jour: ${error.message}`, error.stack);
      }
    } catch (error) {
      await this.logger.error(`Erreur lors de la génération de la mise à jour: ${error.message}`, error.stack);
    }
  }
}