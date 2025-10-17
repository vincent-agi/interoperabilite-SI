import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from './entities/log.entity';
import { LogQueryService } from './log-query.service';
import { LogsController } from './logs.controller';
import { DatabaseLoggerService } from './database-logger.service';
import { CommandEntity } from '../commands/entities/command.entity';
import { LoggerModule } from '../logger/logger.module';

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
      synchronize: true,
      migrationsRun: false,
      migrations: [__dirname + '/migrations/**/*.js'],
      logging: ['error', 'query', 'warn'],
    }),
    TypeOrmModule.forFeature([LogEntity, CommandEntity]),
    forwardRef(() => LoggerModule),
  ],
  controllers: [LogsController],
  providers: [LogQueryService, DatabaseLoggerService],
  exports: [TypeOrmModule, DatabaseLoggerService, LogQueryService],
})
export class DatabaseModule {}