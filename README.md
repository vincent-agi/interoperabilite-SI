# interoperabilite-SI

## Prérequis

Avoir docker Desktop installé sur votre machine (Mac/Windows)

[Docker Desktop Mac](https://docs.docker.com/desktop/setup/install/mac-install/)

[Docker Desktop Windows](https://docs.docker.com/desktop/setup/install/windows-install/)

## Quick start

1. Cloner le dépot

```bash
git clone https://github.com/vincent-agi/interoperabilite-SI.git
```

```bash
cd interoperabilite-SI
```

2. Lancer le projet

```bash
docker-compose up -d
```

## Fonctionnement du projet

- Le service **Wagon-Lits** envoie automatiquement des commandes de matériel toutes les 30 secondes au service Dev-Materiels via l'API Gateway.
- Le service **Dev-Materiels** traite ces commandes et envoie des mises à jour toutes les 30 secondes sur l'état d'avancement de ces commandes.
- L'**API Gateway** (Traefik) gère le routage entre les services et assure la sécurité via des headers HTTP.

## Logs

Les logs de chaque service sont enregistrés dans leurs dossiers respectifs sous `/logs` :
- `/wagon-lits/logs/wagon-lits-YYYY-MM-DD.log`
- `/dev-materiels/logs/dev-materiels-YYYY-MM-DD.log`

## Contexte

Ce cas d’étude s’inscrit dans le secteur du transport ferroviaire, impliquant trois entreprises spécialisées dans la fabrication, l’entretien et la maintenance de wagons : WagonLits (France), ConstructWagons (international) et leur sous-traitant DevMateriels. WagonLits et ConstructWagons exploitent leurs propres ERP (WAGL et CWAG), tandis que DevMateriels utilise l’ERP DEMAT.

Le processus de maintenance curative repose aujourd’hui sur des échanges manuels : fichiers Excel transmis par email, négociations téléphoniques, saisies manuelles dans les ERP. Cette organisation génère des problèmes récurrents (erreurs, ruptures de stock, pénalités de retard) et complexifie la collaboration, d’autant que chaque entreprise a ses propres pratiques et outils.

Face à cette situation, DevMateriels souhaite mettre en place un système interopérable lui permettant de centraliser et automatiser la réception des commandes de ses clients, sans leur imposer de changer d’ERP, mais en rendant leurs systèmes compatibles avec une plateforme commune. L’objectif est d’améliorer la fiabilité, l’efficience et la performance des opérations de maintenance, tout en anticipant les besoins logistiques et en optimisant les flux d’information entre partenaires.

## Choix techniques

1. Connecteurs (Adapters)

Chaque ERP est équipé d’un connecteur qui fait le pont entre son format, son protocole natif (SQL, CSV, XML, fichiers plats…) et les standards interopérables. Ce connecteur peut supporter plusieurs protocoles (API REST, SOAP, EDI pour l’industrie, ETL pour les gros volumes ou synchronisation historique, Proxy pour la sécurité). 
Ce connecteur peut implémenter le pattern façade entre autre (Design pattern)
Cela permet de s’adapter à la diversité des ERP sans imposer de refonte applicative, tout en garantissant la compatibilité avec la plateforme centrale.

2. API Gateway (Plateforme Centrale)

L’API Gateway centralise tous les échanges inter-entreprises. Elle expose des interfaces standards (REST, GraphQL pour la flexibilité, SOAP pour l’héritage, EDI pour la structure industrielle, Webhooks pour la notification temps réel).  
La sécurité, la traçabilité et l’orchestration de tous les flux facilitent l’intégration de nouveaux clients ou partenaires, tout en maîtrisant la gestion des versions et la montée en charge.

3. Message Queue / Event Broker

Le broker de messages (AMQP, Kafka, MQTT) assure la transmission asynchrone des commandes, statuts et notifications.  
Le découplage des systèmes absorbe les pics de charge, garantit la résilience et la scalabilité des échanges et permet la distribution multi-consommateurs (logistique, maintenance, finance).

4. AuthN/AuthZ (Sécurité)

Gestion centralisée de l’authentification et de l’autorisation via OAuth2, SAML ou OpenID.  
Le contrôle fin des accès, auditabilité, conformité RGPD, intégration possible avec SSO des entreprises garantira aux entreprises la traçabilité des actions et permettra d’agir en proactivité pour sa sécurité. En cas de panne (erreur ou attaque) la reprise d’activité sera plus simple et moins coûteuse.

5. Data Warehouse/ BI

Centralisation des données métiers et techniques pour l’analyse, le reporting, l’optimisation des processus et la prédiction.  
Transformer la donnée en valeur ajoutée permettra le pilotage, l’anticipation des stocks et la justification des décisions métier.

6. Monitoring & Alerting

Supervision proactive des flux et des composants (Prometheus, Grafana, ELK) & Webhooks. Alertes automatiques vers les équipes concernées en cas d’incident ou d'événement métier critique.  
Le but est de réduire les risques opérationnels, augmenter la réactivité, permettre le suivi des SLA (contrat de niveau de service) et l’amélioration continue.

7. Standards ouverts

API REST, GraphQL, SOAP, EDI, Webhooks, ETL, AMQP, MQTT…  
Maximiser l’interopérabilité, l’évolutivité et la pérennité de la solution. Limite la dépendance à des technologies propriétaires et réduit le coût d’intégration de nouveaux partenaires car les standards sont connus et éprouvés.

## Architecture avant

![WhatsApp Image 2025-10-15 at 17 04 53](https://github.com/user-attachments/assets/9e7b501b-307e-47fd-ada0-4316af122c83)


## Architecture finale
<img width="2044" height="1788" alt="Mermaid Chart - Create complex, visual diagrams with text -2025-10-15-144217" src="https://github.com/user-attachments/assets/93817c53-8d26-465e-837d-549d4baa87e3" />


[Documentations supplémentaires](./documentation/README.md)
