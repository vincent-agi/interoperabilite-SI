import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from './logger/logger.module';
import { CommandsModule } from './commands/commands.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    LoggerModule,
    CommandsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}