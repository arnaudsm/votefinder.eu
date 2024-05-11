# VoteFinder

![Logo](frontend/src/icons/logo.svg)

Juge les textes votés au Parlement Européen ✉️

Et découvre quelle liste vote comme toi ✌️

## Ambition

Une application web de statistiques sur les votes du parlement européen.

Porte sur le 9ème mandat et les députés Français pour l'instant.

## Dépendances

- GNU make
- node.js >= 18 (`nvm use lts/hydrogen`)
- yarn (`npm install --global yarn`)

## Fonctionnement

- `make` pour initialiser et lancer un serveur local
- `make build` pour compiler l'application

## Contribuer

Les contribution techniques sont les bienvenues, mais aussi les non-techniques.
VoteFinder ne comporte qu'une centaine de lois résumées pour l'instant. N'hésitez pas à rajouter la votre !

Notre ligne éditoriale sur les textes est la suivante

- Préférer les votes de texte entier, le vote final de préférence.
- Eviter les petits amendements rejetés pour des raisons partisanes.
- Eviter les textes purement techniques sans teneur politique.

### Proposer un résumé de texte

- Identifiez le numéro du vote en question, par exemple sur `https://howtheyvote.eu/votes/112117`.
- Créez un fichier `data/votes/[vote_id].txt`, avez le format suivant

```
Titre
- Sous Titre 1
- Sous Titre 2
URL du texte
```

Exemple

```
Réduire l'écart de salaire entre les femmes et les hommes
- Fixer des objectifs pour réduire l'écart de rémunération d'ici 2025
- Introduire des mesures de transparence des salaires et protéger les droits des travailleurs à temps partiel
https://oeil.secure.europarl.europa.eu/oeil/popups/summary.do?id=1606927&t=e&l=fr
```

- La CI vous dira si le texte est dans le format approprié.
- Créez une pull request avec le texte en question.

## Todo
- Crash rotations successives
- Screenshot plus joli
- Tests
- Communiqué de presse
- Réseaux Sociaux
- Taux d'absentéisme
- Etendre aux autres pays d'europe
