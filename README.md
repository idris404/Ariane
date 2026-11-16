<p align="center">
  <img src="web/frontend/public/brand/ariane-lockup.png" alt="Ariane" width="360">
</p>

<h1 align="center">Rattraper le retard. Garder l’expertise.</h1>

<p align="center">
  Ariane prépare la revue immunologique répétitive pour rendre de la capacité aux équipes,<br>
  sans automatiser la décision du biologiste.
</p>

<p align="center">
  <strong>🏆 Prix de la meilleure solution pour les patients</strong><br>
  Hackathon AI for Health · Paris · 13–15 novembre 2026
</p>

<p align="center">
  <a href="#pourquoi-ariane">Pourquoi Ariane</a> ·
  <a href="#démonstration">Démonstration</a> ·
  <a href="#démarrage-local">Démarrage local</a> ·
  <a href="docs/PILOT.md">Démarche pilote</a> ·
  <a href="docs/RESPONSIBLE_USE.md">Usage responsable</a>
</p>

![File de validation du démonstrateur Ariane](web/frontend/public/showcase/signing-queue-full.png)

## Pourquoi Ariane

La revue immunologique en transplantation demande de reconstituer des historiques, de rapprocher des résultats successifs et de repérer les dossiers qui nécessitent une lecture approfondie. Lorsque cette préparation répétitive monopolise le temps expert, la file grandit plus vite qu’elle ne se résorbe.

**Ariane transforme cette accumulation en une file de travail lisible et priorisée.** Le produit réunit l’historique synthétique d’un dossier, expose les informations absentes ou incertaines et distingue deux parcours :

- **À signer** : le dossier est préparé pour une dernière vérification professionnelle ;
- **À consulter** : le dossier reste visible pour une revue plus approfondie.

Le biologiste conserve la décision et déclenche lui-même toute validation.

## La proposition de valeur

| Problème opérationnel | Réponse d’Ariane | Valeur recherchée |
| --- | --- | --- |
| L’historique doit être reconstruit dossier par dossier. | Les résultats et événements sont réunis dans une lecture longitudinale. | Réduire le temps passé à retrouver le contexte. |
| La routine et les cas complexes partagent la même file. | Deux parcours rendent immédiatement visibles les dossiers à approfondir. | Concentrer le temps expert là où il est le plus utile. |
| Les informations absentes peuvent être difficiles à repérer. | Les données manquantes et les limites restent explicites. | Éviter qu’une absence d’information devienne une conclusion favorable. |
| Le retard s’accumule. | La préparation et la priorisation visent à rendre de la capacité à l’équipe. | Ramener une file estimée à six mois vers un mois, à confirmer en pilote. |

L’objectif **6 → 1 mois** est une ambition opérationnelle issue du besoin terrain. Il ne s’agit pas d’un résultat déjà obtenu : il doit être mesuré avec une équipe pilote avant toute communication comme performance.

## Ce que nous avons construit en 50 heures

- une landing publique cohérente avec l’identité Ariane ;
- un cockpit avec recherche, filtres, tri et pagination ;
- une fiche synthétique avec historique et évolution sérique ;
- des files **À signer** et **À consulter** ;
- une signature déclenchée uniquement par une action humaine ;
- une API FastAPI, une base PostgreSQL locale et un pipeline déterministe ;
- des contrats frontend/backend validés aux frontières ;
- des tests automatisés du pipeline, de l’API et des parcours web.

Le prix remporté valide la pertinence de la proposition présentée au jury. Il ne constitue pas une validation clinique du produit.

## Résultat du scénario synthétique

Le scénario présenté au jury contient **1 000 profils entièrement synthétiques** :

| Parcours | Profils | Rôle dans la démonstration |
| --- | ---: | --- |
| Préparés pour validation | 714 | Le professionnel vérifie chaque dossier avant de signer. |
| Conservés pour revue approfondie | 286 | Le dossier reste visible dans la file de consultation. |

Ces nombres décrivent la distribution contrôlée du démonstrateur. Ils ne mesurent ni une performance clinique, ni un gain de temps, ni une prévalence réelle.

## Démonstration

La présentation et le produit partagent le même frontend :

- `/` — storytelling, prix, impact visé, architecture et garde-fous ;
- `/login` — entrée du démonstrateur local ;
- [`demo-ariane.mp4`](web/frontend/public/showcase/demo-ariane.mp4) — parcours vidéo court.

Après le démarrage local, ouvrir <http://localhost:5173>.

## De la preuve de produit à la preuve d’impact

| Déjà démontré | À mesurer en pilote |
| --- | --- |
| Un parcours complet, local et reproductible | Le temps de préparation et de revue |
| Une interface testée sur des données synthétiques | L’évolution de la taille et de l’ancienneté de la file |
| Une validation humaine explicite | Les reprises et corrections avant validation |
| Une proposition récompensée pour sa valeur patient | L’adoption et la compréhension par les professionnels |

La [démarche pilote](docs/PILOT.md) décrit les indicateurs, les étapes de cadrage et les conditions nécessaires avant toute expérimentation. Une future version professionnelle pourrait ajouter des protocoles versionnés, un audit renforcé, une gestion des accès et un déploiement adapté à l’environnement cible.

## Architecture

```text
Données synthétiques
        │
        ▼
Pipeline déterministe ──► FastAPI ──► PostgreSQL
                              │
                              ▼
                       Next.js / React
                              │
                              ▼
                       Validation humaine
```

| Couche | Technologies |
| --- | --- |
| Présentation et application | Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui |
| État et validation frontend | TanStack Query, Zod, React Hook Form |
| API | FastAPI, Pydantic, SQLAlchemy |
| Données | PostgreSQL, pipeline Python déterministe |
| Vérification | Pytest, unittest, Playwright, axe-core |

Le backend reste la source de vérité des données et des règles. Le frontend valide les réponses reçues et les présente sans recalculer une interprétation médicale.

## Démarrage local

### Prérequis

- Node.js 22 ou plus récent ;
- Python 3.12 et [`uv`](https://docs.astral.sh/uv/) ;
- Docker avec Compose.

### 1. Lancer PostgreSQL

```bash
docker compose -f dependencies/compose.yml up -d
```

### 2. Lancer l’API et charger le scénario

```bash
cd web
cp .env.example .env
cd backend
uv sync
uv run python -m app.seed
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Lancer le frontend

```bash
cd web/frontend
cp .env.example .env
npm ci
npm run dev
```

| Service | URL locale |
| --- | --- |
| Landing et démonstrateur | <http://localhost:5173> |
| API | <http://localhost:8000> |
| OpenAPI | <http://localhost:8000/docs> |

Le scénario guidé et son plan de secours sont documentés dans [`docs/DEMO.md`](docs/DEMO.md).

## Vérifications

```bash
# Frontend
cd web/frontend
npm run lint
npm run typecheck
npm run test:ui
npm run build

# Backend
cd ../backend
uv run pytest

# Pipeline de données
cd ../../data-model
PYTHONPATH=src python3 -m unittest discover -s tests -v
PYTHONPATH=src python3 -m hla_data_model.validator data/scenarios
```

## Usage responsable

Ariane est un démonstrateur de hackathon et non un dispositif médical cliniquement validé.

- données exclusivement synthétiques dans ce dépôt ;
- aucune décision autonome de transplantation ;
- aucune prédiction de rejet ou recommandation thérapeutique ;
- aucune intégration officielle à LymFIP ;
- incertitudes et informations manquantes conservées ;
- validation finale explicitement humaine.

Lire [`docs/RESPONSIBLE_USE.md`](docs/RESPONSIBLE_USE.md) avant toute présentation ou réutilisation du démonstrateur.

## Documentation

| Document | Contenu |
| --- | --- |
| [`docs/PRODUCT.md`](docs/PRODUCT.md) | Problème, proposition de valeur et périmètre produit |
| [`docs/PILOT.md`](docs/PILOT.md) | Passage du démonstrateur à une évaluation encadrée |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Composants, flux et responsabilités |
| [`docs/DATA_PIPELINE.md`](docs/DATA_PIPELINE.md) | Données synthétiques et reproductibilité |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Déploiement Vercel Services et Neon |
| [`docs/DEMO.md`](docs/DEMO.md) | Lancement, scénario et plan de secours |
| [`docs/HACKATHON.md`](docs/HACKATHON.md) | Contexte, réalisation en 50 heures et prix |
| [`docs/RESPONSIBLE_USE.md`](docs/RESPONSIBLE_USE.md) | Limites médicales et communication responsable |
| [`BRAND.md`](BRAND.md) | Usage du nom, des logos et des médias Ariane |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Retours, collaborations et données interdites |
| [`SECURITY.md`](SECURITY.md) | Signalement privé et informations à ne jamais publier |

## Licence et droits

Ce dépôt est visible à des fins de présentation et d’évaluation, mais **il n’est pas open source**. Aucun droit d’utilisation, de modification, de distribution, de déploiement ou d’exploitation commerciale n’est accordé sans autorisation écrite préalable.

Des droits commerciaux, de recherche ou d’évaluation peuvent être accordés séparément dans le cadre d’un accord écrit. Voir [`LICENSE`](LICENSE), [`BRAND.md`](BRAND.md) et [`CONTRIBUTING.md`](CONTRIBUTING.md).
