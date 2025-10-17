import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '../logger/logger.module';
import { CommandsService } from './commands.service';
import { CommandsController } from './commands.controller';
import { CommandsKafkaController } from './commands-kafka.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandEntity } from './entities/command.entity';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [
    HttpModule,
    LoggerModule,
    KafkaModule,
    TypeOrmModule.forFeature([CommandEntity])
  ],
  providers: [CommandsService],
  controllers: [CommandsController, CommandsKafkaController],
  exports: [TypeOrmModule]
})
export class CommandsModule {}