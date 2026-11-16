# Frontend Ariane

Application Next.js 16 avec App Router, React 19, TypeScript strict et Tailwind CSS 4.

## Routes

| Route | Accès | Contenu |
| --- | --- | --- |
| `/` | Public | Landing, prix, vidéo, architecture et limites |
| `/login` | Public | Connexion au démonstrateur local |
| `/dashboard` | Session | Cockpit et import simulé |
| `/fiche/[id]` | Session | Historique et évolution sérique |
| `/a-signer` | Session | Dossiers préparés pour validation |
| `/a-consulter` | Session | Dossiers à examiner en détail |

## Configuration

```bash
cp .env.example .env
npm ci
```

`NEXT_PUBLIC_API_URL` indique l’origine du backend FastAPI, sans `/api/v1`.

## Commandes

```bash
npm run dev        # http://localhost:5173
npm run lint
npm run typecheck
npm run test:ui
npm run build
npm run start      # build de production sur :5173
```

Les tests Playwright utilisent des réponses synthétiques contrôlées et bloquent les appels vers Internet. Ils ne signent aucun dossier dans une base locale réelle.

## Organisation

```text
app/               routes Next.js et layouts
src/features/      pages et logique par parcours
src/shared/        composants, schémas, appels API et hooks communs
src/components/ui/ composants d’interface
src/constants/     valeurs partagées du frontend
public/brand/      identité Ariane
public/showcase/   captures et vidéo de démonstration
```

La direction artistique est documentée dans [`../doc/rigueur-calme.md`](../doc/rigueur-calme.md). Les limites de communication sont décrites dans [`../../docs/RESPONSIBLE_USE.md`](../../docs/RESPONSIBLE_USE.md).
