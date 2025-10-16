import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { CustomLoggerService } from '../logger/custom-logger.service';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class CommandsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.setContext('CommandsService');
  }

  // Générer un numéro de commande aléatoire
  generateOrderNumber(): string {
    return `WL-${Math.floor(Math.random() * 10000)}-${new Date().getTime().toString().slice(-4)}`;
  }

  // Générer une liste de matériels aléatoire
  generateRandomMaterials(): any[] {
    const materials = [
      { name: 'Siège passager', quantity: Math.floor(Math.random() * 10) + 1 },
      { name: 'Éclairage de cabine', quantity: Math.floor(Math.random() * 20) + 1 },
      { name: 'Panneau de contrôle', quantity: Math.floor(Math.random() * 5) + 1 },
      { name: 'Vitres sécurisées', quantity: Math.floor(Math.random() * 15) + 1 },
      { name: 'Portes coulissantes', quantity: Math.floor(Math.random() * 8) + 1 },
    ];

    // Sélectionner 1 à 3 matériels aléatoirement
    const selectedMaterials = [];
    const numMaterials = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numMaterials; i++) {
      const randomIndex = Math.floor(Math.random() * materials.length);
      selectedMaterials.push(materials[randomIndex]);
      materials.splice(randomIndex, 1); // Éviter les doublons
      
      if (materials.length === 0) break;
    }

    return selectedMaterials;
  }

  // Envoyer une commande de matériel toutes les 30 secondes
  @Cron('*/30 * * * * *')
  async sendMaterialOrder() {
    try {
      const orderNumber = this.generateOrderNumber();
      const materials = this.generateRandomMaterials();

      const order = {
        orderNumber,
        date: new Date(),
        department: 'Wagon-Lits',
        priority: Math.random() > 0.7 ? 'HIGH' : 'NORMAL',
        materials,
      };

      this.logger.log(`Envoi de la commande ${orderNumber} vers dev-materiels`);
      
      // URL pour accéder au service dev-materiels via l'API gateway
      const response = await firstValueFrom(
        this.httpService.post<any>('http://api-gateway/dev-materiels/orders', order)
      ) as AxiosResponse<any>;

      this.logger.log(`Réponse reçue pour la commande ${orderNumber}: ${JSON.stringify(response.data)}`);
      
      return response.data;
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de la commande: ${error.message}`, error.stack);
      throw error;
    }
  }
}