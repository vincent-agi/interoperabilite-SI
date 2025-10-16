# Logging et Monitoring

Ce document détaille le système de journalisation (logging) et de surveillance (monitoring) mis en place dans notre architecture d'interopérabilité.

## Système de Journalisation

### Vue d'Ensemble

Chaque service dispose d'un système de journalisation autonome qui enregistre toutes les opérations importantes. Ce système est basé sur la bibliothèque Winston, un logger polyvalent et performant pour Node.js.

### Architecture de Logging

Le système de journalisation est structuré autour d'un service personnalisé (`CustomLoggerService`) qui :
1. Crée et gère les fichiers de logs
2. Formate les entrées de journal
3. Gère différents niveaux de gravité
4. Segmente les logs par contexte

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

Les logs sont stockés dans des fichiers avec rotation quotidienne :

- **Service Wagon-Lits** : `/logs/wagon-lits-YYYY-MM-DD.log`
- **Service Dev-Materiels** : `/logs/dev-materiels-YYYY-MM-DD.log`

La rotation des logs permet de :
- Limiter la taille des fichiers
- Faciliter l'archivage
- Optimiser les performances

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

## Pour aller plus loin

- [Guide de Dépannage](depannage.md)
- [API Gateway avec Traefik](api-gateway.md)
- [Service Wagon-Lits](service-wagon-lits.md)
- [Service Dev-Materiels](service-dev-materiels.md)
- [Documentation officielle de Winston](https://github.com/winstonjs/winston)