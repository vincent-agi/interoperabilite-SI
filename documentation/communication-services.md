# Communication Entre Services

Ce document détaille les flux de communication entre les différents services de l'architecture d'interopérabilité, en mettant l'accent sur les formats d'échange et les protocoles utilisés.

## Vue d'Ensemble des Flux

Notre architecture comporte deux principaux flux de communication :

1. **Flux de commande** : Wagon-Lits → API Gateway → Dev-Materiels
2. **Flux de mise à jour** : Dev-Materiels → API Gateway → Wagon-Lits

Tous les échanges se font via des requêtes HTTP REST en utilisant le format JSON.

## Cycle de Vie d'une Commande

Le cycle complet d'une commande suit les étapes suivantes :

1. Wagon-Lits génère une commande de matériel
2. La commande est envoyée à Dev-Materiels via l'API Gateway
3. Dev-Materiels traite la commande et renvoie une confirmation
4. Dev-Materiels envoie périodiquement des mises à jour sur l'état de la commande
5. La commande est marquée comme complète une fois expédiée

## États d'une Commande

Une commande peut passer par les états suivants :

1. **PROCESSING** : La commande est en cours de traitement
2. **SHIPPED** : La commande a été expédiée

## Sécurité des Communications

Toutes les communications entre les services passent par l'API Gateway Traefik, qui ajoute des en-têtes de sécurité :

- Protection contre les attaques XSS
- Protection contre le MIME sniffing
- Politique de sécurité de contenu restrictive
- Prévention du framejacking

## Haute Disponibilité et Résilience

Le système est conçu avec plusieurs mécanismes de résilience :

- **Tentatives automatiques** : En cas d'échec de communication, les services réessaient automatiquement
- **Redémarrage automatique** : Les conteneurs redémarrent automatiquement en cas de défaillance
- **Journalisation des erreurs** : Toutes les erreurs de communication sont enregistrées pour analyse

## Pour aller plus loin

- [Service Wagon-Lits](service-wagon-lits.md)
- [Service Dev-Materiels](service-dev-materiels.md)
- [API Gateway avec Traefik](api-gateway.md)
- [Logging et Monitoring](logging-monitoring.md)
- [Guide de Dépannage](depannage.md)