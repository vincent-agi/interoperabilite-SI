import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { CustomLoggerService } from '../logger/custom-logger.service';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: CustomLoggerService,
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    private readonly kafkaService: KafkaService,
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
    this.logger.log(`processOrder() called with data: ${JSON.stringify(orderData)}`);
    const confirmationId = this.generateConfirmationId();
    const now = new Date();
    const estimatedProcessingDays = Math.floor(Math.random() * 5) + 1;
    const estimatedDelivery = new Date(now);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + estimatedProcessingDays);

    const orderEntity = new OrderEntity();
    orderEntity.orderNumber = orderData.orderNumber;
    orderEntity.date = new Date(orderData.date)
    orderEntity.department = orderData.department;
    orderEntity.priority = orderData.priority;
    orderEntity.materials = orderData.materials;
    orderEntity.status = 'PROCESSING';

    try {
      await this.logger.log(`Tentative de sauvegarde de la commande: ${JSON.stringify(orderEntity)}`);
      const dbName = await this.orderRepository.query(`SELECT current_database();`);
      const tables = await this.orderRepository.query(`
  SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
`);

      await this.logger.log(`Connected DB: ${dbName[0].current_database}`);
      await this.logger.log(`Tables connues: ${tables.map(t => t.table_name).join(', ')}`);
      this.logger.log('Tentative de sauvegarde...');
      const savedOrder = await this.orderRepository.save(orderEntity);
      this.logger.log('Sauvegarde effectuée: ' + JSON.stringify(savedOrder));
      await this.logger.log(`Commande sauvegardée avec ID: ${savedOrder.id}`);
    } catch (error) {
      await this.logger.error(`Erreur lors de la sauvegarde de la commande: ${error.message}`, error.stack);
    }

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

  @Cron('*/30 * * * * *')
  async sendOrderUpdates() {
    try {
      const orders = await this.orderRepository.find({
        where: { status: 'PROCESSING' },
        order: { receivedAt: 'DESC' },
        take: 10
      });

      if (orders.length === 0) {
        return;
      }

      const orderIndex = Math.floor(Math.random() * orders.length);
      const order = orders[orderIndex];

      const updates = [
        'Matériaux en préparation',
        'Contrôle qualité en cours',
        'Emballage des matériaux',
        'Expédition planifiée',
        'Expédié'
      ];

      const updateIndex = Math.floor(Math.random() * updates.length);
      const updateMessage = updates[updateIndex];

      const newStatus = updateIndex === updates.length - 1 ? 'SHIPPED' : 'PROCESSING';

      try {
        await this.orderRepository.update(
          { orderNumber: order.orderNumber },
          {
            status: newStatus,
            processedAt: newStatus === 'SHIPPED' ? new Date() : order.processedAt
          }
        );
        await this.logger.log(`Statut de la commande ${order.orderNumber} mis à jour vers: ${newStatus}`);
      } catch (error) {
        await this.logger.error(`Erreur lors de la mise à jour du statut: ${error.message}`, error.stack);
      }

      const update = {
        orderNumber: order.orderNumber,
        timestamp: new Date(),
        status: newStatus,
        updateMessage,
      };

      await this.logger.log(`Envoi de mise à jour pour la commande ${order.orderNumber}: ${updateMessage}`);

      try {
        await this.kafkaService.sendMessage('order-updates', update);
        
        await this.logger.log(`Mise à jour de la commande ${order.orderNumber} envoyée via Kafka`);

        if (newStatus === 'SHIPPED') {
          await this.logger.log(`Commande ${order.orderNumber} marquée comme expédiée`);
        }
      } catch (error) {
        await this.logger.error(`Erreur lors de l'envoi de la mise à jour via Kafka: ${error.message}`, error.stack);
      }
      
      try {
        const response = await firstValueFrom(
          this.httpService.post<any>('http://api-gateway/wagon-list/commands', update)
        ) as AxiosResponse<any>;

        await this.logger.log(`Réponse HTTP de wagon-lits pour la mise à jour: ${JSON.stringify(response.data)}`);
      } catch (error) {
        await this.logger.error(`Erreur lors de l'envoi HTTP de la mise à jour: ${error.message}`, error.stack);
      }
    } catch (error) {
      await this.logger.error(`Erreur lors de la génération de la mise à jour: ${error.message}`, error.stack);
    }
  }
}