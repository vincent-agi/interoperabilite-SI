# Service Dev-Materiels

## Présentation

Le service Dev-Materiels représente le fournisseur de pièces et matériels dans notre architecture d'interopérabilité. Il simule un service qui reçoit des commandes de matériel, les traite, et envoie périodiquement des mises à jour sur leur état d'avancement.

## Rôle et Responsabilités

Le service Dev-Materiels a pour principales responsabilités :

1. **Réception des commandes** : Recevoir les commandes de matériel envoyées par le service Wagon-Lits
2. **Traitement des commandes** : Enregistrer, analyser et traiter les commandes reçues
3. **Génération de mises à jour** : Créer et envoyer automatiquement des mises à jour sur l'état des commandes
4. **Journalisation** : Enregistrer toutes les requêtes entrantes et sortantes dans des fichiers de logs

## Architecture Interne

Le service est développé avec NestJS et organisé selon une structure modulaire :

- **AppModule** : Module principal qui coordonne les autres modules
- **OrdersModule** : Gère la réception et le traitement des commandes
- **LoggerModule** : S'occupe de la journalisation des activités

### Composants Clés

1. **OrdersService** : Contient la logique de traitement des commandes
   - Génère des identifiants de confirmation uniques
   - Estime des délais de livraison
   - Maintient une liste de commandes en cours
   - Génère et envoie des mises à jour sur l'état des commandes
   
2. **OrdersController** : Expose des points d'accès API pour :
   - Recevoir les commandes de Wagon-Lits
   - Fournir des informations sur l'état du service
   
3. **CustomLoggerService** : Service personnalisé pour la journalisation qui :
   - Enregistre les logs dans des fichiers avec rotation quotidienne
   - Formate les logs avec horodatage et niveau de sévérité
   - Segmente les logs par contexte d'application

## Modèle de Données

### Structure d'une Commande Traitée

```
{
  ...orderData,            // Données de la commande originale
  received: Date,          // Date de réception de la commande
  confirmationId: string,  // Identifiant unique de confirmation (ex: DM-1234-5678)
  status: string,          // État de la commande ('PROCESSING', 'SHIPPED', etc.)
  estimatedDelivery: Date, // Date estimée de livraison
  processingNotes: string  // Notes sur le traitement de la commande
}
```

### Structure d'une Mise à Jour

```
{
  confirmationId: string,  // Identifiant de confirmation
  orderNumber: string,     // Numéro de la commande originale
  timestamp: Date,         // Date de la mise à jour
  status: string,          // État actuel de la commande
  updateMessage: string    // Message détaillant la mise à jour
}
```

## Communication

### Points d'Accès API

- **GET /dev-materiels** : Page d'accueil du service
- **POST /dev-materiels/orders** : Endpoint pour recevoir les commandes de Wagon-Lits
- **GET /dev-materiels/orders/status** : Endpoint pour vérifier l'état du service

### Tâches Programmées

- Envoi automatique d'une mise à jour sur une commande aléatoire toutes les 30 secondes via une tâche CRON (`@Cron('*/30 * * * * *')`)

## Simulation du Processus de Traitement

Le service simule un processus de traitement des commandes en plusieurs étapes :
1. **Réception et enregistrement** de la commande
2. **Génération d'un ID de confirmation** renvoyé au client
3. **Estimation d'un délai de livraison** basé sur un algorithme aléatoire
4. **Suivi de l'évolution** avec des mises à jour périodiques
5. **Finalisation** quand la commande est marquée comme expédiée

## Journalisation

Les logs du service sont enregistrés dans :
- Console (pendant le développement)
- Fichiers avec rotation quotidienne : `/logs/dev-materiels-YYYY-MM-DD.log`

## Déploiement

Le service est déployé dans un conteneur Docker basé sur Node.js. Il est configuré pour :
- Exposer le port 3000 en interne
- Se connecter aux réseaux Docker `dev-materiels-network` et `api-gateway-public`
- Redémarrer automatiquement en cas de défaillance (sauf arrêt explicite)

## Pour aller plus loin

- [Architecture Globale](architecture.md)
- [Communication Entre Services](communication-services.md)
- [Service Wagon-Lits](service-wagon-lits.md)
- [API Gateway avec Traefik](api-gateway.md)