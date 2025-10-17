# Communication par File d'Attente Kafka

Ce document décrit l'architecture et la mise en œuvre d'une communication asynchrone entre les microservices `dev-materiels` et `wagon-lits` via Apache Kafka.

## Architecture

Le système d'interopérabilité SI a été enrichi avec une communication par messagerie asynchrone en utilisant Apache Kafka. Cette approche présente plusieurs avantages par rapport à la communication HTTP directe précédemment utilisée :

1. **Découplage** : Les services n'ont plus besoin de connaître l'existence ou l'emplacement des autres services
2. **Tolérance aux pannes** : Les messages sont conservés même si un service est temporairement indisponible
3. **Scalabilité** : Kafka permet de faire face à un volume croissant de messages
4. **Traçabilité** : Tous les échanges sont enregistrés dans Kafka et peuvent être rejoués

## Schéma de Communication

```
┌─────────────────┐                 ┌─────────────────┐
│                 │  1. Commandes   │                 │
│   Wagon-Lits    │────────────────▶│  Topic: orders  │
│                 │                 │                 │
└────────▲────────┘                 └────────┬────────┘
         │                                   │
         │                                   ▼
         │                          ┌─────────────────┐
         │                          │                 │
         │                          │  Dev-Materiels  │
         │                          │                 │
         │                          └────────┬────────┘
         │                                   │
┌────────┴────────┐                          │
│                 │                          │
│Topic: order-    │◀─────────────────────────┘
│     updates     │  2. Mises à jour
└─────────────────┘
```

## Topics Kafka

Le système utilise deux topics Kafka principaux :

1. **orders** : Utilisé par le service `wagon-lits` pour envoyer des commandes de matériels à `dev-materiels`
2. **order-updates** : Utilisé par le service `dev-materiels` pour envoyer des mises à jour sur les commandes au service `wagon-lits`

## Implémentation

### Configuration Docker

Le système utilise les services Docker suivants pour la mise en place de Kafka :

- **Zookeeper** : Requis par Kafka pour la gestion des clusters et la coordination
- **Kafka** : Le broker de messagerie principal
- **Kafka-UI** : Interface d'administration permettant de visualiser les topics et les messages

### Configuration des Services

Chaque service NestJS a été configuré pour communiquer via Kafka :

1. **Module Kafka** : Un module dédié à la connexion et à la gestion de Kafka
2. **Controllers Kafka** : Des contrôleurs spécifiques pour traiter les messages entrants
3. **Service Kafka** : Service permettant d'envoyer des messages dans les topics Kafka

### Déploiement

La configuration de l'environnement Kafka est définie dans le fichier `docker-compose.yml`. Les services sont accessibles :

- **Kafka** : `kafka:9092` (interne), `localhost:29092` (externe)
- **Kafka UI** : http://localhost:8080 (interface d'administration)

## Migration et Compatibilité

Pour assurer une transition en douceur, le système maintient temporairement une double communication :

1. **Communication par Kafka** (principale)
2. **Communication HTTP** (fallback)

Cette approche permet de s'assurer que le système continue de fonctionner même si des problèmes surviennent avec Kafka pendant la période de transition.

## Surveillance et Maintenance

L'interface Kafka UI permet de :

- Visualiser les topics et leur configuration
- Inspecter les messages
- Surveiller la performance du système
- Créer de nouveaux topics si nécessaire

## Évolutions Futures

Le système pourrait évoluer avec :

1. **Schémas Avro** : Pour garantir la compatibilité des messages
2. **Kafka Streams** : Pour le traitement en temps réel des messages
3. **Kafka Connect** : Pour intégrer d'autres sources et destinations de données
4. **Multi-clusters** : Pour une meilleure résilience en production