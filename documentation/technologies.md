# Technologies Utilisées

Ce document détaille l'ensemble des technologies, frameworks et outils utilisés dans le projet d'interopérabilité des systèmes d'information.

## Technologies Principales

### NestJS

[NestJS](https://nestjs.com/) est un framework pour construire des applications serveur Node.js efficaces et évolutives. Il est utilisé pour développer les deux services principaux du projet.

**Caractéristiques principales utilisées** :
- Architecture modulaire inspirée d'Angular
- Injection de dépendances native
- Support complet de TypeScript
- API REST facilement configurable
- Tâches programmées avec le module `@nestjs/schedule`
- Module HTTP intégré (`@nestjs/axios`) pour les requêtes entre services

### Traefik

[Traefik](https://traefik.io/) est un Edge Router moderne qui facilite le déploiement des microservices. Il est utilisé comme API Gateway dans notre projet.

**Fonctionnalités exploitées** :
- Découverte automatique des services via Docker
- Configuration dynamique
- Routage basé sur les chemins URL
- Middleware pour la sécurité HTTP
- Tableau de bord intégré pour la surveillance

### Docker et Docker Compose

[Docker](https://www.docker.com/) permet la conteneurisation des applications, tandis que [Docker Compose](https://docs.docker.com/compose/) orchestre le déploiement de plusieurs conteneurs.

**Avantages** :
- Isolation des environnements
- Gestion simplifiée des dépendances
- Déploiement cohérent sur différentes plateformes
- Configuration déclarative des services

## Technologies Secondaires

### TypeScript

[TypeScript](https://www.typescriptlang.org/) est un sur-ensemble typé de JavaScript qui se compile en JavaScript pur. Il apporte :
- Typage statique
- Détection des erreurs à la compilation
- Meilleure autocomplétion dans les IDE
- Refactoring plus sûr

### Winston

[Winston](https://github.com/winstonjs/winston) est une bibliothèque de journalisation pour Node.js utilisée pour :
- Journalisation multi-niveaux (info, error, warn, etc.)
- Format personnalisable des logs
- Rotation des fichiers journaux avec winston-daily-rotate-file

### Axios

[Axios](https://axios-http.com/) est un client HTTP basé sur les promesses pour le navigateur et Node.js :
- Utilisé pour les communications entre services
- Gestion simplifiée des requêtes et des réponses HTTP
- Support des intercepteurs pour la transformation des requêtes/réponses

### RxJS

[RxJS](https://rxjs.dev/) est une bibliothèque pour la programmation réactive en JavaScript :
- Utilisée en conjonction avec @nestjs/axios pour gérer les flux asynchrones
- Permet de transformer, combiner et traiter les données de manière déclarative

## Frameworks et Bibliothèques Complémentaires

### ESLint et Prettier

Outils d'analyse statique et de formatage du code qui assurent :
- Cohérence du style de code
- Détection précoce de problèmes potentiels
- Meilleure lisibilité du code

## Environnement de Développement

L'environnement de développement recommandé pour ce projet comprend :
- [Visual Studio Code](https://code.visualstudio.com/) avec les extensions pour TypeScript et NestJS
- Node.js version 18 ou supérieure
- Docker Desktop pour la conteneurisation

## Ressources d'Apprentissage

- [Documentation officielle de NestJS](https://docs.nestjs.com/)
- [Documentation de Traefik](https://doc.traefik.io/traefik/)
- [Guide Docker pour débutants](https://docker-curriculum.com/)
- [TypeScript en 5 minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

## Pour aller plus loin

- [Service Wagon-Lits](service-wagon-lits.md)
- [Service Dev-Materiels](service-dev-materiels.md)
- [API Gateway avec Traefik](api-gateway.md)
- [Logging et Monitoring](logging-monitoring.md)