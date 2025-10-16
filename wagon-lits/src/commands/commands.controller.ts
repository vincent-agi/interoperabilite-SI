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
    await this.logger.log('Déclenchement manuel d\'une commande');
    return await this.commandsService.sendMaterialOrder();
  }

  @Post()
  async receiveCommand(@Body() updateData: any) {
    await this.logger.log(`Mise à jour reçue: ${JSON.stringify(updateData)}`);
    
    try {
      // Si c'est une mise à jour d'une commande existante
      if (updateData.orderNumber) {
        const command = await this.commandsService.processUpdate(updateData);
        
        if (command) {
          return { 
            received: true,
            timestamp: new Date(),
            message: `Mise à jour de la commande ${updateData.orderNumber} traitée avec succès`,
            status: command.status
          };
        } else {
          return { 
            received: false,
            timestamp: new Date(),
            message: `Commande ${updateData.orderNumber} non trouvée`
          };
        }
      } else {
        return { 
          received: true,
          timestamp: new Date(),
          message: 'Données reçues par le service Wagon-Lits mais aucune action effectuée (orderNumber manquant)'
        };
      }
    } catch (error) {
      await this.logger.error(`Erreur lors du traitement de la mise à jour: ${error.message}`, error.stack);
      return {
        received: true,
        timestamp: new Date(),
        error: error.message,
        message: 'Erreur lors du traitement de la mise à jour'
      };
    }
  }
}