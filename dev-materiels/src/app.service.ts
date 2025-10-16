import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from './logger/custom-logger.service';

@Injectable()
export class AppService {
  constructor(private readonly logger: CustomLoggerService) {
    this.logger.setContext('AppService');
  }

  getHello(): string {
    this.logger.log('Service getHello appelé');
    return 'Bienvenue au service Dev-Materiels!';
  }
}