import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { CustomLoggerService } from '../logger/custom-logger.service';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class OrdersService {
  private orders = [];

  constructor(
    private readonly httpService: HttpService,
    private readonly logger: CustomLoggerService,
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
  processOrder(orderData: any) {
    const confirmationId = this.generateConfirmationId();
    const now = new Date();
    
    // Ajouter un délai de traitement estimé
    const estimatedProcessingDays = Math.floor(Math.random() * 5) + 1;
    const estimatedDelivery = new Date(now);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + estimatedProcessingDays);
    
    const processedOrder = {
      ...orderData,
      received: now,
      confirmationId,
      status: 'PROCESSING',
      estimatedDelivery,
      processingNotes: `Commande de ${orderData.materials.length} articles en traitement`,
    };
    
    this.orders.push(processedOrder);
    
    this.logger.log(`Commande ${orderData.orderNumber} reçue et traitée avec ID de confirmation ${confirmationId}`);
    
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
    // Ne rien faire si aucune commande n'est enregistrée
    if (this.orders.length === 0) {
      return;
    }

    try {
      // Sélectionner une commande aléatoire pour mise à jour
      const orderIndex = Math.floor(Math.random() * this.orders.length);
      const order = this.orders[orderIndex];
      
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
      
      // Mettre à jour le statut si c'est "Expédié"
      if (updateIndex === updates.length - 1) {
        order.status = 'SHIPPED';
      }
      
      const update = {
        confirmationId: order.confirmationId,
        orderNumber: order.orderNumber,
        timestamp: new Date(),
        status: order.status,
        updateMessage,
      };

      this.logger.log(`Envoi de mise à jour pour la commande ${order.orderNumber}: ${updateMessage}`);
      
      // Envoyer la mise à jour via l'API gateway
      try {
        const response = await firstValueFrom(
          this.httpService.post<any>('http://api-gateway/wagon-list/commands', update)
        ) as AxiosResponse<any>;
        
        this.logger.log(`Réponse de wagon-lits pour la mise à jour: ${JSON.stringify(response.data)}`);
        
        // Si la commande est expédiée, la retirer de la liste active
        if (order.status === 'SHIPPED') {
          this.orders.splice(orderIndex, 1);
          this.logger.log(`Commande ${order.orderNumber} retirée de la liste des commandes actives après expédition`);
        }
      } catch (error) {
        this.logger.error(`Erreur lors de l'envoi de la mise à jour: ${error.message}`, error.stack);
      }
    } catch (error) {
      this.logger.error(`Erreur lors de la génération de la mise à jour: ${error.message}`, error.stack);
    }
  }
}