import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '../logger/logger.module';
import { CommandsService } from './commands.service';
import { CommandsController } from './commands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandEntity } from './entities/command.entity';
import { CommandRepository } from './command.repository';

@Module({
  imports: [
    HttpModule,
    LoggerModule,
    TypeOrmModule.forFeature([CommandEntity])
  ],
  providers: [CommandsService, CommandRepository],
  controllers: [CommandsController],
})
export class CommandsModule {}