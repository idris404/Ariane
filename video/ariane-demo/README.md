# Vidéo de démonstration Ariane

Projet Remotion isolé pour produire la vidéo courte de présentation d’Ariane.

## Prévisualiser

```bash
npm ci
npm run dev -- --no-open
```

Ouvrir ensuite <http://localhost:3000/ArianeDemo>.

## Composition

La composition `ArianeDemo` dure 44 secondes en 1920 × 1080 à 30 images par seconde. Elle comprend quatre scènes éditables :

1. le retard accumulé ;
2. l’objectif opérationnel 6 → 1 mois ;
3. le parcours réel du démonstrateur ;
4. la validation humaine et le prix remporté.

L’objectif 6 → 1 mois reste explicitement présenté comme une ambition à confirmer en pilote.

## Vérifier

```bash
npm run lint
npm run build
```

Le dossier `out/` est réservé aux exports et n’est pas versionné.
