import { Injectable, OnModuleInit } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CustomLoggerService } from '../logger/custom-logger.service';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.setContext('KafkaService');
  }

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('orders');
    this.kafkaClient.subscribeToResponseOf('order-updates');
    
    await this.kafkaClient.connect();
    this.logger.log('Kafka client connecté avec succès');
  }

  async sendMessage(topic: string, message: any): Promise<void> {
    try {
      await this.logger.log(`Envoi d'un message dans le topic ${topic}: ${JSON.stringify(message)}`);
      this.kafkaClient.emit(topic, message);
      
      await this.logger.log(`Message envoyé avec succès dans le topic ${topic}`);
    } catch (error) {
      await this.logger.error(`Erreur lors de l'envoi d'un message Kafka: ${error.message}`, error.stack);
    }
  }

  async getKafkaClient(): Promise<ClientKafka> {
    return this.kafkaClient;
  }
}