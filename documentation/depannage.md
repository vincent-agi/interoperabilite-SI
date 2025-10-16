# Guide de Dépannage

Ce document fournit des solutions aux problèmes courants que vous pourriez rencontrer lors du déploiement ou de l'exécution du projet d'interopérabilité des systèmes d'information.

## Problèmes de Construction Docker

### Erreur : Module introuvable

**Symptôme** :
```
error TS2307: Cannot find module '@nestjs/axios' or its corresponding type declarations.
```

**Causes possibles** :
1. Dépendance manquante dans package.json
2. Installation incomplète des dépendances

**Solutions** :
1. Vérifier que toutes les dépendances sont listées dans package.json :
   ```json
   "dependencies": {
     "@nestjs/axios": "^3.0.0",
     ...
   }
   ```
2. Forcer la réinstallation des dépendances :
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

### Erreur : Build annulé

**Symptôme** :
```
=> CANCELED [service-name stage-name]
```

**Causes possibles** :
1. Timeout pendant la construction
2. Ressources système insuffisantes

**Solutions** :
1. Augmenter les ressources allouées à Docker (CPU, mémoire)
2. Optimiser les Dockerfiles pour des builds plus rapides
3. Construire les services individuellement :
   ```bash
   docker-compose build wagon-lits
   docker-compose build dev-materiels
   ```

## Problèmes de Communication

### Erreur : Connexion refusée

**Symptôme** :
```
Error: connect ECONNREFUSED api-gateway:80
```

**Causes possibles** :
1. L'API Gateway n'est pas démarré
2. Les services ne sont pas sur le même réseau Docker
3. Problème de résolution de noms dans Docker

**Solutions** :
1. Vérifier que tous les services sont en cours d'exécution :
   ```bash
   docker-compose ps
   ```
2. Vérifier les logs de l'API Gateway :
   ```bash
   docker-compose logs api-gateway
   ```
3. S'assurer que les services sont sur les bons réseaux Docker

### Erreur : Timeout des requêtes

**Symptôme** :
```
Error: timeout of 5000ms exceeded
```

**Causes possibles** :
1. Service destinataire surchargé
2. Service destinataire planté
3. Délai de timeout trop court

**Solutions** :
1. Vérifier l'état du service destinataire
2. Augmenter les délais de timeout dans la configuration
3. Mettre en place un mécanisme de retry

## Problèmes de Routage

### Erreur : 404 Not Found

**Symptôme** :
```
HTTP 404 Not Found lors d'une requête à api-gateway/service-path
```

**Causes possibles** :
1. Chemin d'URL incorrect
2. Règle de routage mal configurée dans Traefik
3. Le service cible n'expose pas ce point d'accès

**Solutions** :
1. Vérifier les règles de routage dans docker-compose.yml :
   ```
   traefik.http.routers.service-name.rule=PathPrefix(`/correct-path`)
   ```
2. Vérifier que le service a le bon préfixe global dans NestJS :
   ```typescript
   app.setGlobalPrefix('correct-path');
   ```
3. Accéder au tableau de bord Traefik pour vérifier les routes actives

### Erreur : 502 Bad Gateway

**Symptôme** :
```
HTTP 502 Bad Gateway
```

**Causes possibles** :
1. Service cible non disponible
2. Port du service mal configuré
3. Traefik ne peut pas établir de connexion avec le service

**Solutions** :
1. Vérifier que le service cible est en cours d'exécution
2. Vérifier la configuration du port dans docker-compose.yml :
   ```
   traefik.http.services.service-name.loadbalancer.server.port=3000
   ```
3. Vérifier les logs de Traefik pour les erreurs de connexion

## Problèmes de Logs

### Erreur : Impossible de créer des fichiers de log

**Symptôme** :
```
Error: EACCES: permission denied, mkdir '/app/logs'
```

**Causes possibles** :
1. Problèmes de permissions dans le conteneur
2. Volume Docker mal configuré
3. Chemin de logs incorrect

**Solutions** :
1. S'assurer que le dossier logs est créé au démarrage :
   ```typescript
   const logDir = path.join(process.cwd(), 'logs');
   if (!fs.existsSync(logDir)) {
     fs.mkdirSync(logDir, { recursive: true });
   }
   ```
2. Vérifier les permissions du dossier dans le Dockerfile :
   ```dockerfile
   RUN mkdir -p logs && chmod 755 logs
   ```

## Problèmes de Configuration

### Erreur : Conflit de ports

**Symptôme** :
```
Error starting userland proxy: listen tcp 0.0.0.0:80: bind: address already in use
```

**Causes possibles** :
1. Le port 80 est déjà utilisé par un autre service
2. Une instance précédente du projet est toujours en cours d'exécution

**Solutions** :
1. Arrêter le service utilisant le port 80 :
   ```bash
   sudo lsof -i :80
   sudo kill <PID>
   ```
2. Modifier le port dans docker-compose.yml :
   ```yaml
   ports:
     - "8080:80"
   ```

## Vérification de l'État du Système

### Commandes Utiles

1. **Vérifier l'état des conteneurs** :
   ```bash
   docker-compose ps
   ```

2. **Consulter les logs des services** :
   ```bash
   docker-compose logs -f wagon-lits
   docker-compose logs -f dev-materiels
   docker-compose logs -f api-gateway
   ```

3. **Vérifier les réseaux Docker** :
   ```bash
   docker network ls
   docker network inspect api-gateway-public
   ```

4. **Accéder à un shell dans un conteneur** :
   ```bash
   docker-compose exec wagon-lits sh
   docker-compose exec dev-materiels sh
   ```

5. **Redémarrer un service spécifique** :
   ```bash
   docker-compose restart wagon-lits
   docker-compose restart dev-materiels
   docker-compose restart api-gateway
   ```

## Comment obtenir de l'aide supplémentaire

Si les solutions ci-dessus ne résolvent pas votre problème :

1. Consulter la [documentation officielle de NestJS](https://docs.nestjs.com/)
2. Consulter la [documentation de Traefik](https://doc.traefik.io/traefik/)
3. Consulter la [documentation de Docker](https://docs.docker.com/)
4. Rechercher sur [Stack Overflow](https://stackoverflow.com/)
5. Ouvrir une issue sur le dépôt GitHub du projet

## Pour aller plus loin

- [Architecture Globale](architecture.md)
- [Logging et Monitoring](logging-monitoring.md)
- [API Gateway avec Traefik](api-gateway.md)