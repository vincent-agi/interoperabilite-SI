# API Gateway avec Traefik

## Présentation

Dans notre architecture d'interopérabilité, Traefik joue le rôle crucial d'API Gateway. Il agit comme point d'entrée unique pour toutes les communications entre les services, permettant ainsi une gestion centralisée du routage, de la sécurité et de la surveillance.

## Rôle et Responsabilités

L'API Gateway Traefik a pour principales responsabilités :

1. **Routage** : Diriger les requêtes vers les services appropriés en fonction des chemins URL
2. **Proxy inverse** : Exposer les services internes de manière sécurisée
3. **Équilibrage de charge** : Répartir les requêtes en cas de montée en charge
4. **Sécurité** : Appliquer des politiques de sécurité HTTP via des en-têtes personnalisés
5. **Surveillance** : Fournir un tableau de bord pour surveiller le trafic et l'état des services

## Architecture et Configuration

### Mode de Fonctionnement

Traefik fonctionne en découvrant automatiquement les services via Docker. Il analyse les labels des conteneurs pour déterminer comment router les requêtes.

### Configuration Statique et Dynamique

- **Configuration statique** : Définie dans le docker-compose.yml, elle comprend les paramètres de base comme les points d'entrée, le mode de découverte, etc.
- **Configuration dynamique** : Stockée dans le dossier `./traefik/dynamic/`, elle contient des paramètres comme les middlewares de sécurité

### Points d'Entrée (Entrypoints)

Traefik expose deux points d'entrée :
- **web** : Port 80 pour le trafic HTTP
- **websecure** : Port 443 pour le trafic HTTPS (préparé mais non utilisé dans l'implémentation actuelle)

## Règles de Routage

### Service Wagon-Lits

```
PathPrefix(`/wagon-list`)
```

Cette règle dirige toutes les requêtes commençant par `/wagon-list` vers le service Wagon-Lits.

### Service Dev-Materiels

```
PathPrefix(`/dev-materiels`)
```

Cette règle dirige toutes les requêtes commençant par `/dev-materiels` vers le service Dev-Materiels.

### Tableau de Bord Traefik

```
PathPrefix(`/dashboard`) || PathPrefix(`/api/dashboard`)
```

Cette règle permet d'accéder au tableau de bord de Traefik pour surveiller l'état du système.

## Middlewares de Sécurité

Traefik utilise plusieurs middlewares pour renforcer la sécurité :

1. **Compression** : Compresse les réponses pour optimiser la bande passante
2. **Rate Limiting** : Limite le nombre de requêtes par seconde
3. **En-têtes de Sécurité** : Configure des en-têtes HTTP pour protéger contre diverses vulnérabilités :
   - `X-Frame-Options: DENY` - Empêche le site d'être affiché dans une iframe
   - `X-Content-Type-Options: nosniff` - Empêche le navigateur de deviner le type MIME
   - `X-XSS-Protection: 1; mode=block` - Active la protection XSS du navigateur
   - `Referrer-Policy: strict-origin-when-cross-origin` - Limite les informations de référence
   - `Content-Security-Policy` - Définit des restrictions sur les sources de contenu

### Authentification

L'accès au tableau de bord est protégé par une authentification basique :

```
traefik.http.middlewares.auth.basicauth.users=${TRAEFIK_BASIC_AUTH:-admin:$2y$05$WxrbJS/fJx7uvXe7CEzGregmkrKX7jZD0TyvBSMTOHOwLJeH7XQzS}
```

Le nom d'utilisateur par défaut est `admin` et le mot de passe est stocké sous forme de hash.

## Surveillance et Tableau de Bord

Le tableau de bord Traefik est accessible à l'adresse `http://localhost:80/dashboard/` et fournit :
- Vue d'ensemble de tous les services
- État des routeurs et des services
- Métriques de trafic en temps réel
- Visualisation des middlewares actifs

## Réseaux et Communications

Traefik est connecté au réseau `api-gateway-public`, qui est partagé avec tous les services. Cette configuration permet :
- Une isolation logique des services
- Une découverte facile des services par Traefik
- Une communication sécurisée entre les services via l'API Gateway

## Pour aller plus loin

- [Architecture Globale](architecture.md)
- [Communication Entre Services](communication-services.md)
- [Documentation officielle de Traefik](https://doc.traefik.io/traefik/)
- [Guide de Dépannage](depannage.md)