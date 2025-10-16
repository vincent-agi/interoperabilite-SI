import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from './entities/log.entity';
import { LogQueryService } from './log-query.service';
import { LogsController } from './logs.controller';
import { DatabaseLoggerService } from './database-logger.service';
import { CommandEntity } from '../commands/entities/command.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'siinteroperable',
      entities: [LogEntity, CommandEntity],
      synchronize: false,
      migrationsRun: true,
      migrations: [__dirname + '/migrations/**/*.js'],
      logging: true,
    }),
    TypeOrmModule.forFeature([LogEntity, CommandEntity]),
  ],
  controllers: [LogsController],
  providers: [LogQueryService, DatabaseLoggerService],
  exports: [TypeOrmModule, DatabaseLoggerService, LogQueryService],
})
export class DatabaseModule {}