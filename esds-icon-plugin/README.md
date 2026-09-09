# Mon Plugin Figma

Plugin Figma exclusif - fonctionne uniquement dans Figma Design (pas FigJam).

## Installation rapide

1. Dans Figma Desktop : **Plugins** → **Développement** → **Import plugin from manifest...**
2. Sélectionnez le fichier `manifest.json`

## Structure

```
plugin-icon/
├── manifest.json    # Configuration du plugin
├── code.js          # Logique JavaScript
└── ui.html          # Interface utilisateur
```

## Configuration clé

**manifest.json** :
```json
"editorType": ["figma"]
```

Cela garantit que le plugin n'apparaît que dans Figma Design.

## Fonctionnement

Le plugin crée des rectangles oranges avec une interface simple pour choisir le nombre.

## Fonctionnalités supportées

- ✅ Figma Design

## Fonctionnalités NON supportées

- ❌ FigJam
- ❌ Figma Dev Mode  
- ❌ Figma Slides
- ❌ Figma Buzz
