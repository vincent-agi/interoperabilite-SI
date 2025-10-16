import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '../logger/logger.module';
import { CommandsService } from './commands.service';
import { CommandsController } from './commands.controller';

@Module({
  imports: [
    HttpModule,
    LoggerModule
  ],
  providers: [CommandsService],
  controllers: [CommandsController],
})
export class CommandsModule {}