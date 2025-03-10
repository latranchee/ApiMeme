# APIMemе Clone

Un clone léger du générateur de mèmes APIMemе pour usage éducatif dans le cadre d'un cours sur les API.

## Fonctionnalités

- Interface utilisateur simple et intuitive
- Sélection de templates de mèmes
- Ajout de texte en haut et en bas de l'image
- Génération et téléchargement des mèmes
- API accessible pour intégration dans d'autres applications

## Prérequis

- Node.js (version 16 ou supérieure)
- npm (inclus avec Node.js)

## Installation

1. Clonez ce dépôt :
   ```
   git clone <url-du-repo>
   cd apimeme-clone
   ```

2. Installez les dépendances :
   ```
   npm install
   ```

3. Ajoutez vos templates de mèmes :
   - Placez vos images PNG dans le dossier `templates/images/`
   - Nommez les fichiers selon le format `nom-du-meme.png` (par exemple, `10-guy.png`)

## Démarrage

Pour lancer l'application :

```
node server.js
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## Utilisation de l'API

### Obtenir la liste des templates disponibles

```
GET /api/templates
```

Réponse :
```json
[
  {
    "id": "10-guy",
    "name": "10 Guy"
  },
  {
    "id": "bad-luck-brian",
    "name": "Bad Luck Brian"
  }
]
```

### Générer un mème

```
GET /api/meme?template=10-guy&top=Texte%20du%20haut&bottom=Texte%20du%20bas
```

Paramètres :
- `template` : ID du template à utiliser (obligatoire)
- `top` : Texte à afficher en haut de l'image (optionnel)
- `bottom` : Texte à afficher en bas de l'image (optionnel)

La réponse est l'image générée au format PNG.

## Personnalisation

Vous pouvez personnaliser l'application en modifiant les fichiers suivants :
- `public/index.html` : Structure de la page
- `public/css/styles.css` : Styles CSS
- `public/js/app.js` : Logique côté client
- `server.js` : Logique côté serveur

## Licence

Ce projet est destiné à un usage éducatif uniquement. 