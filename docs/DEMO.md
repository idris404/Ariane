# Démonstration locale

## Préparation

La démonstration repose sur trois processus locaux : PostgreSQL, FastAPI et Next.js.

### PostgreSQL

```bash
docker compose -f dependencies/compose.yml up -d
```

### Backend

```bash
cd web
cp .env.example .env
cd backend
uv sync
uv run python -m app.seed
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd web/frontend
cp .env.example .env
npm ci
npm run dev
```

Ouvrir <http://localhost:5173>.

## Parcours conseillé

1. Présenter la landing et le prix remporté.
2. Montrer la vidéo courte si le temps est limité.
3. Ouvrir `/login` et se connecter avec le compte local créé par le seed.
4. Lancer l’import simulé depuis le cockpit.
5. Ouvrir la file **À signer** et développer les résultats d’un dossier.
6. Montrer qu’une signature exige une action explicite.
7. Ouvrir la file **À consulter** et afficher l’historique d’un dossier fluctuant.
8. Rappeler que les données sont synthétiques et que la validation reste humaine.

## Plan de secours

- vidéo locale : `web/frontend/public/showcase/demo-ariane.mp4` ;
- capture principale : `web/frontend/public/showcase/signing-queue-full.png` ;
- landing disponible sans connexion au backend ;
- seed reproductible pour reconstruire les données de démonstration.

## Arrêt

Arrêter les serveurs avec `Ctrl+C`, puis :

```bash
docker compose -f dependencies/compose.yml down
```
