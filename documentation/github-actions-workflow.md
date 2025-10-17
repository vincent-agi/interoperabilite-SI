# Workflow GitHub Actions pour l'Intégration Continue

## Introduction

Ce document décrit le workflow GitHub Actions mis en place pour automatiser le processus de construction et de publication des images Docker de notre système d'interopérabilité SI. Cette automatisation s'inscrit dans une démarche DevOps visant à améliorer la qualité et la rapidité de nos déploiements.

## Principe de fonctionnement

Le workflow GitHub Actions est un système d'automatisation qui permet d'exécuter des séquences d'opérations prédéfinies en réaction à des événements spécifiques dans notre dépôt Git. Dans notre cas, le workflow est déclenché lors des modifications du code source pour :

1. **Construire** automatiquement les images Docker de nos microservices
2. **Publier** ces images dans GitHub Container Registry (GHCR)
3. **Versionner** les images de façon cohérente et traçable

Ce processus d'automatisation garantit que chaque modification du code entraîne la création de nouvelles versions de nos images Docker, toujours disponibles et à jour.

## Utilité

L'utilisation de ce workflow GitHub Actions présente plusieurs avantages majeurs :

- **Cohérence** : Chaque image Docker est construite dans un environnement standardisé, éliminant les problèmes liés aux différences d'environnement de développement
- **Traçabilité** : Chaque image est associée à un commit Git spécifique, permettant de retrouver exactement quel code est déployé
- **Automatisation** : Plus besoin de construire et publier manuellement les images, réduisant les risques d'erreur humaine
- **Rapidité** : Le processus de déploiement est accéléré grâce à l'automatisation complète de la chaîne de construction
- **Sécurité** : Utilisation des mécanismes d'authentification sécurisés de GitHub pour la publication des images

## Cas d'usage

### 1. Déploiement continu

Le workflow facilite la mise en place d'un pipeline de déploiement continu :
- L'équipe développe de nouvelles fonctionnalités
- Les changements sont validés et fusionnés dans la branche principale
- Le workflow construit et publie automatiquement les nouvelles images
- Ces images peuvent ensuite être déployées automatiquement dans un environnement de test ou de production

### 2. Tests d'intégration

Lors du développement de nouvelles fonctionnalités :
- Un développeur crée une pull request
- Le workflow construit les images Docker correspondantes
- Ces images peuvent être utilisées pour effectuer des tests d'intégration avant la fusion

### 3. Versionnage cohérent

Pour les versions de production :
- Une version est étiquetée avec un tag Git (ex: v1.2.3)
- Le workflow génère des images Docker avec ce même tag
- Ces images spécifiques peuvent être référencées dans les déploiements de production

### 4. Audit et diagnostic

En cas de problème en production :
- L'identifiant de l'image Docker en cours d'exécution révèle le commit exact
- Les développeurs peuvent examiner précisément le code déployé
- Une nouvelle image corrective peut être générée rapidement