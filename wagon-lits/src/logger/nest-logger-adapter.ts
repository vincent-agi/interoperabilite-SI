import { Injectable, LoggerService } from '@nestjs/common';
import { CustomLoggerService } from './custom-logger.service';

/**
 * Adaptateur pour utiliser notre CustomLoggerService avec l'interface LoggerService de NestJS
 * Cette classe est nécessaire car notre CustomLoggerService a des méthodes asynchrones,
 * mais l'interface LoggerService de NestJS n'accepte pas de méthodes asynchrones.
 */
@Injectable()
export class NestLoggerAdapter implements LoggerService {
  constructor(private customLogger: CustomLoggerService) {}

  log(message: any, context?: string): void {
    this.customLogger.log(message, context).catch(err => {
      console.error('Error in async log:', err);
    });
  }

  error(message: any, trace?: string, context?: string): void {
    this.customLogger.error(message, trace, context).catch(err => {
      console.error('Error in async error log:', err);
    });
  }

  warn(message: any, context?: string): void {
    this.customLogger.warn(message, context).catch(err => {
      console.error('Error in async warn log:', err);
    });
  }

  debug(message: any, context?: string): void {
    this.customLogger.debug(message, context).catch(err => {
      console.error('Error in async debug log:', err);
    });
  }

  verbose(message: any, context?: string): void {
    this.customLogger.verbose(message, context).catch(err => {
      console.error('Error in async verbose log:', err);
    });
  }

  setContext(context: string): void {
    this.customLogger.setContext(context);
  }
}