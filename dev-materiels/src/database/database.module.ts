import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from './entities/log.entity';
import { LogQueryService } from './log-query.service';
import { LogsController } from './logs.controller';
import { DatabaseLoggerService } from './database-logger.service';
import { OrderEntity } from '../orders/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'siinteroperable',
      entities: [LogEntity, OrderEntity],
      synchronize: true,
      migrationsRun: false,
      migrations: [__dirname + '/migrations/**/*.js'],
      logging: ['error', 'query', 'warn'],
    }),
    TypeOrmModule.forFeature([LogEntity, OrderEntity]),
  ],
  controllers: [LogsController],
  providers: [LogQueryService, DatabaseLoggerService],
  exports: [TypeOrmModule, DatabaseLoggerService, LogQueryService],
})
export class DatabaseModule {}