# Local Demonstration

## Preparation

The demonstration uses three local processes: PostgreSQL, FastAPI, and Next.js.

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

Open <http://localhost:5173>.

## Recommended walkthrough

1. Present the landing page and award.
2. Show the short video when time is limited.
3. Open `/login` and sign in with the local account created by the seed.
4. Start the simulated import from the dashboard.
5. Open the **Ready to sign** queue and expand a record's results.
6. Show that signing requires an explicit action.
7. Open the **Needs review** queue and display a fluctuating record's history.
8. Remind the audience that all data is synthetic and validation remains human.

## Fallback plan

- local video: `web/frontend/public/showcase/demo-ariane.mp4`;
- main screenshot: `web/frontend/public/showcase/signing-queue-full.png`;
- landing page available without a backend connection;
- reproducible seed to rebuild demonstration data.

## Shutdown

Stop the servers with `Ctrl+C`, then run:

```bash
docker compose -f dependencies/compose.yml down
```
