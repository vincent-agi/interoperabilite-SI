# Service Wagon-Lits

## Présentation

Le service Wagon-Lits représente l'un des clients de DevMateriels dans notre architecture d'interopérabilité. Il simule un service qui génère des commandes de matériels pour la maintenance et la construction de wagons.

## Rôle et Responsabilités

Le service Wagon-Lits a pour principales responsabilités :

1. **Génération de commandes** : Créer automatiquement des commandes de matériels à intervalles réguliers (toutes les 30 secondes)
2. **Envoi des commandes** : Transmettre ces commandes au service Dev-Materiels via l'API Gateway
3. **Réception des mises à jour** : Traiter les mises à jour sur l'état des commandes envoyées par Dev-Materiels
4. **Journalisation** : Enregistrer toutes les requêtes entrantes et sortantes dans des fichiers de logs

## Architecture Interne

Le service est développé avec NestJS et organisé selon une structure modulaire :

- **AppModule** : Module principal qui coordonne les autres modules
- **CommandsModule** : Gère la création et l'envoi de commandes
- **LoggerModule** : S'occupe de la journalisation des activités

### Composants Clés

1. **CommandsService** : Contient la logique de génération et d'envoi des commandes
   - Génère des numéros de commande uniques
   - Crée des listes de matériaux aléatoires
   - Envoie les commandes via HTTP vers l'API Gateway
   
2. **CommandsController** : Expose des points d'accès API pour :
   - Déclencher manuellement l'envoi d'une commande
   - Recevoir les mises à jour de Dev-Materiels
   
3. **CustomLoggerService** : Service personnalisé pour la journalisation qui :
   - Enregistre les logs dans des fichiers avec rotation quotidienne
   - Formate les logs avec horodatage et niveau de sévérité
   - Segmente les logs par contexte d'application

## Modèle de Données

### Structure d'une Commande

```
{
  orderNumber: string,      // Identifiant unique de la commande (ex: WL-1234-5678)
  date: Date,               // Date de création de la commande
  department: string,       // Département émetteur (ex: 'Wagon-Lits')
  priority: string,         // Priorité de la commande ('HIGH' ou 'NORMAL')
  materials: Array<{        // Liste des matériels demandés
    name: string,           // Nom du matériel
    quantity: number        // Quantité demandée
  }>
}
```

## Communication

### Points d'Accès API

- **GET /wagon-list** : Page d'accueil du service
- **GET /wagon-list/commands/trigger** : Endpoint pour déclencher manuellement l'envoi d'une commande
- **POST /wagon-list/commands** : Endpoint pour recevoir les mises à jour de Dev-Materiels

### Tâches Programmées

- Envoi automatique d'une commande toutes les 30 secondes via une tâche CRON (`@Cron('*/30 * * * * *')`)

## Journalisation

Les logs du service sont enregistrés dans :
- Console (pendant le développement)
- Fichiers avec rotation quotidienne : `/logs/wagon-lits-YYYY-MM-DD.log`

## Déploiement

Le service est déployé dans un conteneur Docker basé sur Node.js. Il est configuré pour :
- Exposer le port 3000 en interne
- Se connecter aux réseaux Docker `wagon-lits-network` et `api-gateway-public`
- Redémarrer automatiquement en cas de défaillance (sauf arrêt explicite)

## Pour aller plus loin

- [Architecture Globale](architecture.md)
- [Communication Entre Services](communication-services.md)
- [Service Dev-Materiels](service-dev-materiels.md)
- [API Gateway avec Traefik](api-gateway.md)