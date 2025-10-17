import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';
import { LoggerModule } from '../logger/logger.module';
import { Partitioners } from 'kafkajs';

@Module({
  imports: [
    LoggerModule,
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'wagon-lits',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'wagon-lits-consumer',
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner
          }
        },
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}