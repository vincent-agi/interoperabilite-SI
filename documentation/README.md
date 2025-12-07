# Documentation du Projet d'Interopérabilité des Systèmes d'Information

Bienvenue dans la documentation du projet d'interopérabilité. Ce projet pédagogique vise à simuler la communication entre différents systèmes d'information dans un contexte de maintenance ferroviaire.

## Table des matières

1. [Introduction au Projet](introduction.md)
   - Contexte
   - Problématique
   - Objectifs

2. [Architecture Globale](architecture.md)
   - Vue d'ensemble
   - Conteneurisation
   - Réseaux Docker
   - Flux de communication

3. [Technologies Utilisées](technologies.md)
   - NestJS
   - Traefik
   - Docker et Docker Compose
   - TypeScript
   - Winston et autres bibliothèques

4. [Services Principaux](service-wagon-lits.md)
   - [Service Wagon-Lits](service-wagon-lits.md)
   - [Service Dev-Materiels](service-dev-materiels.md)

5. [API Gateway](api-gateway.md)
   - Rôle et configuration de Traefik
   - Règles de routage
   - Middlewares de sécurité

6. [Communication Entre Services](communication-services.md)
   - Formats d'échange
   - Cycle de vie d'une commande
   - Gestion des erreurs

7. [Système de Notification par Webhook](webhook-notification.md)
   - Gestion automatique des nouveaux acteurs
   - Intérêt métier et avantages
   - Impact sur la chaîne de valeur

8. [Logging et Monitoring](logging-monitoring.md)
   - Système de journalisation
   - Surveillance des services
   - Accès aux logs

9. [Guide de Dépannage](depannage.md)
   - Problèmes courants et solutions
   - Vérification de l'état du système
   - Ressources d'aide supplémentaire