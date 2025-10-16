import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as path from 'path';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: winston.Logger;
  private context: string = 'Application';

  constructor() {
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

  log(message: any, context?: string) {
    const currentContext = context || this.context;
    this.logger.info(message, { context: currentContext });
  }

  error(message: any, trace?: string, context?: string) {
    const currentContext = context || this.context;
    this.logger.error(`${message} - ${trace || 'No trace'}`, {
      context: currentContext,
    });
  }

  warn(message: any, context?: string) {
    const currentContext = context || this.context;
    this.logger.warn(message, { context: currentContext });
  }

  debug(message: any, context?: string) {
    const currentContext = context || this.context;
    this.logger.debug(message, { context: currentContext });
  }

  verbose(message: any, context?: string) {
    const currentContext = context || this.context;
    this.logger.verbose(message, { context: currentContext });
  }
}