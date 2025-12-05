# Logging et Monitoring

Ce document détaille le système de journalisation (logging) et de surveillance (monitoring) mis en place dans notre architecture d'interopérabilité.

## Système de Journalisation

### Vue d'Ensemble

Chaque service dispose d'un système de journalisation autonome qui enregistre toutes les opérations importantes. Ce système est basé sur la bibliothèque Winston pour la journalisation dans des fichiers et PostgreSQL pour le stockage structuré des logs dans une base de données.

### Architecture de Logging

Le système de journalisation est structuré autour de deux services principaux :

1. **CustomLoggerService** :
   - Crée et gère les fichiers de logs
   - Formate les entrées de journal
   - Gère différents niveaux de gravité
   - Segmente les logs par contexte
   - Coordonne l'enregistrement dans les fichiers et la base de données

2. **DatabaseLoggerService** :
   - Stocke les logs dans une base de données PostgreSQL
   - Permet des requêtes structurées sur les logs
   - Facilite l'analyse et la visualisation des données de log

### Niveaux de Log

Le système utilise les niveaux de gravité standard :

- **ERROR** : Erreurs critiques nécessitant une attention immédiate
- **WARN** : Avertissements sur des situations anormales mais non critiques
- **INFO** : Informations générales sur le fonctionnement du service
- **DEBUG** : Informations détaillées pour le débogage
- **VERBOSE** : Informations très détaillées pour l'analyse approfondie

### Format des Logs

Les entrées de journal suivent un format standardisé qui inclut :

```
[Timestamp] [NIVEAU] [Contexte] - Message
```

Par exemple :
```
2025-10-16T14:30:05.123Z [INFO] [CommandsService] - Envoi de la commande WL-1234-5678 vers dev-materiels
```

### Stockage et Rotation des Logs

#### Stockage dans des Fichiers

Les logs sont stockés dans des fichiers avec rotation quotidienne :

- **Service Wagon-Lits** : `/logs/wagon-lits-YYYY-MM-DD.log`
- **Service Dev-Materiels** : `/logs/dev-materiels-YYYY-MM-DD.log`

La rotation des logs permet de :
- Limiter la taille des fichiers
- Faciliter l'archivage
- Optimiser les performances

#### Stockage dans la Base de Données

En parallèle, les logs sont enregistrés dans une base de données PostgreSQL avec la structure suivante :

**Tables :**
- `wagon_lits_logs` - Logs du service Wagon-Lits
- `dev_materiels_logs` - Logs du service Dev-Materiels

**Structure des tables :**
- `id` : Identifiant unique (UUID)
- `timestamp` : Date et heure de l'événement
- `level` : Niveau de gravité (error, warn, info, debug, verbose)
- `context` : Contexte de l'événement (nom du service/module)
- `message` : Description de l'événement
- `trace` : Stack trace en cas d'erreur (optionnel)
- `metadata` : Données supplémentaires au format JSON (optionnel)
- `service` : Nom du service source (wagon-lits ou dev-materiels)

Cette double approche de stockage offre :
- Persistance robuste des logs
- Capacités de recherche et filtrage avancées
- Possibilité d'analyse statistique des événements

### Événements Journalisés

#### Service Wagon-Lits
- Génération de commandes
- Envoi de commandes
- Réception de mises à jour
- Erreurs de communication

#### Service Dev-Materiels
- Réception de commandes
- Traitement de commandes
- Envoi de mises à jour
- Changements d'état des commandes

## Surveillance du Système

### Tableau de Bord Traefik

L'API Gateway Traefik fournit un tableau de bord accessible à l'adresse `http://localhost:80/dashboard/` qui permet de surveiller :

- **Routeurs** : État des règles de routage
- **Services** : Disponibilité des services
- **Middlewares** : État des middlewares appliqués
- **Entrypoints** : Points d'entrée configurés

### Surveillance des Conteneurs Docker

Docker fournit des commandes pour surveiller l'état des conteneurs :

```bash
docker ps                  # Liste des conteneurs en cours d'exécution
docker stats               # Statistiques d'utilisation des ressources
docker logs <container_id> # Logs d'un conteneur spécifique
```

### Métriques Surveillées

1. **Métriques d'application** :
   - Nombre de commandes envoyées/reçues
   - Temps de traitement des requêtes
   - Taux d'erreur

2. **Métriques système** :
   - Utilisation CPU
   - Utilisation mémoire
   - Trafic réseau

## Alerting et Notifications

Dans un environnement de production réel, le système pourrait être étendu avec :

- Intégration de solutions comme Prometheus et Grafana
- Configuration d'alertes basées sur des seuils
- Notifications par email, SMS ou webhook

## Bonnes Pratiques de Logging

1. **Structurer les logs** : Utiliser un format cohérent pour faciliter l'analyse
2. **Contextualiser** : Inclure suffisamment d'informations pour comprendre le contexte
3. **Éviter les données sensibles** : Ne jamais logger de mots de passe ou d'informations confidentielles
4. **Équilibrer la verbosité** : Trouver le bon équilibre entre trop et pas assez d'informations

## Accès aux Logs

Pour accéder aux logs des services :

1. **Logs des conteneurs** :
   ```bash
   docker logs wagon-lits-connector
   docker logs dev-materiels-connector
   ```

2. **Logs des fichiers** (nécessite d'accéder aux volumes Docker) :
   ```bash
   docker exec -it wagon-lits-connector cat /app/logs/wagon-lits-2025-10-16.log
   docker exec -it dev-materiels-connector cat /app/logs/dev-materiels-2025-10-16.log
   ```

3. **Logs de la base de données** :
   - Accès via pgAdmin : http://localhost:5050
     - Email: admin@admin.com
     - Mot de passe: admin
   - Connexion à la base de données :
     - Host: db
     - Port: 5432
     - Database: siinteroperable
     - Username: postgres
     - Password: postgres
   
   - Requêtes SQL utiles :
     ```sql
     -- Tous les logs d'erreur
     SELECT * FROM wagon_lits_logs WHERE level = 'error' ORDER BY timestamp DESC;
     
     -- Logs des dernières 24 heures
     SELECT * FROM dev_materiels_logs 
     WHERE timestamp > NOW() - INTERVAL '24 hours' 
     ORDER BY timestamp DESC;
     
     -- Groupement des erreurs par contexte
     SELECT context, COUNT(*) as error_count 
     FROM wagon_lits_logs 
     WHERE level = 'error' 
     GROUP BY context 
     ORDER BY error_count DESC;
     ```

## Système monitoring services

Suivre cette [documentation](https://github.com/DuoOfChips/dockprom)

## Pour aller plus loin

- [Guide de Dépannage](depannage.md)
- [API Gateway avec Traefik](api-gateway.md)
- [Service Wagon-Lits](service-wagon-lits.md)
- [Service Dev-Materiels](service-dev-materiels.md)
- [Documentation officielle de Winston](https://github.com/winstonjs/winston)
