# Introduction au Projet d'Interopérabilité des Systèmes d'Information

## Contexte

Ce projet pédagogique s'inscrit dans une formation de Master en informatique, axé sur l'interopérabilité des systèmes d'information dans le secteur ferroviaire. Il simule un environnement réel où plusieurs services informatiques doivent communiquer efficacement à travers une API Gateway.

Le cas d'étude concerne trois entreprises dans le secteur du transport ferroviaire :
- **WagonLits** (France) : Spécialisée dans la fabrication et l'entretien de wagons
- **ConstructWagons** (international) : Fabricant de wagons
- **DevMateriels** : Sous-traitant fournissant des pièces et matériels

Chacune de ces entreprises possède son propre système d'information (ERP) :
- WagonLits utilise l'ERP WAGL
- ConstructWagons utilise l'ERP CWAG
- DevMateriels utilise l'ERP DEMAT

## Problématique

Actuellement, le processus de maintenance curative repose sur des échanges manuels : fichiers Excel partagés par email, négociations téléphoniques et saisie manuelle dans les ERP. Ce fonctionnement génère divers problèmes :
- Erreurs de saisie
- Ruptures de stock
- Pénalités de retard
- Difficulté de collaboration entre les différents acteurs

## Objectif du Projet

L'objectif principal est de mettre en place une solution d'interopérabilité permettant à DevMateriels de centraliser et automatiser la réception des commandes de ses clients (WagonLits et ConstructWagons) sans leur imposer de changer d'ERP.

Cette solution vise à :
- Améliorer la fiabilité des opérations de maintenance
- Augmenter l'efficience des processus
- Optimiser les flux d'information entre partenaires
- Anticiper les besoins logistiques

## Structure de la Documentation

Pour mieux comprendre ce projet, consultez les documents suivants :

- [Architecture Globale](architecture.md) - Vue d'ensemble de l'architecture technique
- [Technologies Utilisées](technologies.md) - Description des technologies et frameworks employés
- [Service Wagon-Lits](service-wagon-lits.md) - Fonctionnement détaillé du service Wagon-Lits
- [Service Dev-Materiels](service-dev-materiels.md) - Fonctionnement détaillé du service Dev-Materiels
- [API Gateway avec Traefik](api-gateway.md) - Description du fonctionnement de l'API Gateway
- [Communication Entre Services](communication-services.md) - Flux de données entre les différents services
- [Logging et Monitoring](logging-monitoring.md) - Système de journalisation et surveillance
- [Guide de Dépannage](depannage.md) - Solutions aux problèmes courants