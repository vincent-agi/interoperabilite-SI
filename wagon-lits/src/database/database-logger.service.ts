import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogEntity } from './entities/log.entity';

@Injectable()
export class DatabaseLoggerService {
  private readonly logger = new Logger(DatabaseLoggerService.name);

  constructor(
    @InjectRepository(LogEntity)
    private logRepository: Repository<LogEntity>,
  ) {}

  async log(level: string, message: any, context: string, metadata?: Record<string, any>, trace?: string): Promise<void> {
    if (!message) {
      this.logger.warn('Attempted to log empty message');
      return;
    }

    // Ensure message is a string
    const messageStr = typeof message === 'object' ? JSON.stringify(message) : String(message);
    
    // Ensure context is valid
    const contextStr = context || 'unknown';
    
    try {
      const log = new LogEntity();
      log.level = level.substring(0, 10); // Ensure it fits in the column
      log.message = messageStr;
      log.context = contextStr.substring(0, 100); // Ensure it fits in the column
      log.metadata = metadata;
      log.trace = trace;

      const savedLog = await this.logRepository.save(log);
      this.logger.debug(`Log saved to database with ID: ${savedLog.id}`);
    } catch (error) {
      this.logger.error(`Error saving log to database: ${error.message}`, error.stack);
      // Don't rethrow to prevent application crashes
    }
  }
}