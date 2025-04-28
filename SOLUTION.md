# Solution: Assistant de création guidé par étapes

Voici un récapitualatif du travail, par soucis de rapidité une grosse partie du travail a été ralisé avec Claure, notamment au vu de ma première expérience avec Tailwind.

## Table des matières
1. [Composants développés](#composants-développés)
2. [Architecture de données & API](#architecture-de-données-&-api)
3. [Améliorations futures](#améliorations-futures)


## Composants développés

### 1. Barre de progression
Un composant visuel qui montre à l'utilisateur où il se trouve dans le processus de création:

### 2. Composants pour chaque étape et code réutilisable

Steps
- Un conteneur pour chaque étape avec ses propres besoins

#### Types d'étapes spécifiques:

- Étape de sélection d'options
- Étape de sélection de lieux
- Étape de saisie d'items
- Étape de prévisualisation final

### 3. Composant de navigation

### 4. HOC (High Order Component) ici le stepper

Le composant principal qui orchestrera l'ensemble du processus:
- Gestion d'état pour suivre la progression
- Chargement dynamique des étapes selon les sélections
- Communication avec l'API pour récupérer les données
- Génération et soumission de la requête finale
- Gestion des erreurs et des états de chargement

## Architecture de données  & API

### Modification de la table "options"
- Ajout de champs pour définir les étapes requises pour chaque option

### Routes API
- Création des routes pour les nouvelles données


## Améliorations futures

### Repenser le layout des options
- Problème actuel: Le scroll n'est pas adapté pour visualiser rapidement toutes les options
- Solutions possibles:
  - Pré-filtrage par thème
  - Affichage en grille avec catégories
  - Système de tags pour filtrage rapide
  - Vue en arbre pour options hiérarchiques

### Requêtes adaptatives entre les étapes
- Optimiser l'expérience utilisateur avec des requêtes spécifiques:
  - Filtrage des options en fonction du thème sélectionné
  - Chargement des paramètres pertinents uniquement
  - Suggestions basées sur les sélections précédentes

### Amélioration du générateur de requêtes
- Revoir la syntaxe pour:
  - Encapsuler les valeurs importantes
  - Permettre une personnalisation plus fine
  - Améliorer la lisibilité du résultat

### Refonte du thème CSS
- Organisation en composants atomiques:
  - Atoms: éléments de base (boutons, inputs, etc.)
  - Molecules: combinaisons d'atoms (cartes, formulaires, etc.)
  - Organisms: sections complètes (étapes, navigation, etc.)
  - Templates: structures de page
  - Pages: implémentations spécifiques

### Faire un design system complet

A noter:
Temps Approximatif pour réalisé les parties 1h30/2h
Je n'ai pas fais de commits détallé avec des ous branches pour gagner du temps.

J'espère que le travail correspond aux attentes. A bientôt. Victor