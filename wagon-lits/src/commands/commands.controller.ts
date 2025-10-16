import { Controller, Post, Body, Get } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { CustomLoggerService } from '../logger/custom-logger.service';

@Controller('commands')
export class CommandsController {
  constructor(
    private readonly commandsService: CommandsService,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.setContext('CommandsController');
  }

  @Get('trigger')
  async triggerOrder() {
    this.logger.log('Déclenchement manuel d\'une commande');
    return await this.commandsService.sendMaterialOrder();
  }

  @Post()
  receiveCommand(@Body() commandData: any) {
    this.logger.log(`Commande reçue: ${JSON.stringify(commandData)}`);
    return { 
      received: true,
      timestamp: new Date(),
      message: 'Commande reçue par le service Wagon-Lits'
    };
  }
}