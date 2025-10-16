import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomLoggerService } from './logger/custom-logger.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: CustomLoggerService
  ) {
    this.logger.setContext('AppController');
  }

  @Get()
  getHello(): string {
    this.logger.log('Requête GET reçue sur la route racine');
    return this.appService.getHello();
  }
}