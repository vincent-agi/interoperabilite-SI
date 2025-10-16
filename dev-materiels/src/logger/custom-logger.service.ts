import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as path from 'path';
import { DatabaseLoggerService } from '../database/database-logger.service';

@Injectable()
export class CustomLoggerService {
  private logger: winston.Logger;
  private context: string = 'Application';

  constructor(private databaseLoggerService: DatabaseLoggerService) {
    const logDir = path.join(process.cwd(), 'logs');
    
    const dailyRotateFile = new DailyRotateFile({
      filename: path.join(logDir, 'dev-materiels-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    });

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info) => {
          return `${info.timestamp} [${info.level.toUpperCase()}] [${this.context}] - ${info.message}`;
        }),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf((info) => {
              return `${info.timestamp} [${info.level}] [${this.context}] - ${info.message}`;
            }),
          ),
        }),
        dailyRotateFile,
      ],
    });
  }

  setContext(context: string) {
    this.context = context;
  }

  async log(message: any, context?: string, metadata?: Record<string, any>): Promise<void> {
    const currentContext = context || this.context;
    this.logger.info(message, { context: currentContext });
    
    try {
      await this.databaseLoggerService.log(
        'info', 
        typeof message === 'object' ? JSON.stringify(message) : String(message), 
        currentContext, 
        metadata
      );
    } catch (error) {
      console.error('Error saving log to database', error);
    }
  }

  async error(message: any, trace?: string, context?: string): Promise<void> {
    const currentContext = context || this.context;
    this.logger.error(`${message} - ${trace || 'No trace'}`, {
      context: currentContext,
    });
    
    try {
      await this.databaseLoggerService.log(
        'error', 
        typeof message === 'object' ? JSON.stringify(message) : String(message), 
        currentContext, 
        null, 
        trace
      );
    } catch (error) {
      console.error('Error saving error log to database', error);
    }
  }

  async warn(message: any, context?: string, metadata?: Record<string, any>): Promise<void> {
    const currentContext = context || this.context;
    this.logger.warn(message, { context: currentContext });
    
    try {
      await this.databaseLoggerService.log(
        'warn', 
        typeof message === 'object' ? JSON.stringify(message) : String(message), 
        currentContext, 
        metadata
      );
    } catch (error) {
      console.error('Error saving warn log to database', error);
    }
  }

  async debug(message: any, context?: string, metadata?: Record<string, any>): Promise<void> {
    const currentContext = context || this.context;
    this.logger.debug(message, { context: currentContext });
    
    try {
      await this.databaseLoggerService.log(
        'debug', 
        typeof message === 'object' ? JSON.stringify(message) : String(message), 
        currentContext, 
        metadata
      );
    } catch (error) {
      console.error('Error saving debug log to database', error);
    }
  }

  async verbose(message: any, context?: string, metadata?: Record<string, any>): Promise<void> {
    const currentContext = context || this.context;
    this.logger.verbose(message, { context: currentContext });
    
    try {
      await this.databaseLoggerService.log(
        'verbose', 
        typeof message === 'object' ? JSON.stringify(message) : String(message), 
        currentContext, 
        metadata
      );
    } catch (error) {
      console.error('Error saving verbose log to database', error);
    }
  }
}