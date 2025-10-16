# Architecture Globale du Projet

## Vue d'Ensemble

L'architecture du projet d'interopérabilité s'articule autour de trois composants principaux qui communiquent entre eux via des API REST :

1. **API Gateway (Traefik)** - Le point d'entrée central qui route les requêtes entre les différents services
2. **Service Wagon-Lits** - Service qui génère et envoie des commandes de matériels
3. **Service Dev-Materiels** - Service qui reçoit, traite les commandes et envoie des mises à jour

Cette architecture en microservices permet une grande flexibilité, une maintenance simplifiée et une évolutivité accrue.

## Diagramme d'Architecture

```
┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │
│  Wagon-Lits     │◄────►│  API Gateway    │
│  (NestJS)       │      │  (Traefik)      │
│                 │      │                 │
└─────────────────┘      └────────┬────────┘
                                  │
                                  │
                                  ▼
                         ┌─────────────────┐
                         │                 │
                         │  Dev-Materiels  │
                         │  (NestJS)       │
                         │                 │
                         └─────────────────┘
```

## Conteneurisation

L'ensemble du projet est conteneurisé avec Docker. Chaque service est déployé dans son propre conteneur, ce qui assure :
- L'isolation des environnements
- La portabilité entre différentes plateformes
- Une gestion simplifiée des dépendances
- Un déploiement reproductible

## Réseaux Docker

Le projet utilise trois réseaux Docker différents :
1. **api-gateway-public** - Réseau partagé entre tous les services et l'API Gateway
2. **wagon-lits-network** - Réseau dédié au service Wagon-Lits
3. **dev-materiels-network** - Réseau dédié au service Dev-Materiels

Cette séparation en réseaux distincts permet d'isoler les services tout en autorisant les communications nécessaires via l'API Gateway.

## Flux de Communication

1. **Commandes** : Le service Wagon-Lits envoie des commandes de matériel à Dev-Materiels via l'API Gateway toutes les 30 secondes.
2. **Mises à jour** : Le service Dev-Materiels traite les commandes et envoie périodiquement des mises à jour sur leur état à Wagon-Lits, également via l'API Gateway.

## Stockage des Données

Dans cette version du projet, les données sont stockées temporairement en mémoire dans les services respectifs. Il n'y a pas de base de données persistante, ce qui est suffisant pour ce projet pédagogique.

## Logging

Chaque service dispose de son propre système de journalisation qui enregistre :
- Les requêtes entrantes
- Les requêtes sortantes
- Les erreurs
- Les informations de traitement

Les logs sont stockés dans des fichiers distincts pour chaque service, facilitant ainsi le débogage et la surveillance.

## Pour en savoir plus

- [Technologies Utilisées](technologies.md)
- [API Gateway avec Traefik](api-gateway.md)
- [Service Wagon-Lits](service-wagon-lits.md)
- [Service Dev-Materiels](service-dev-materiels.md)
- [Communication Entre Services](communication-services.md)