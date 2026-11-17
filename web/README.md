# Ariane application

The `web/` directory contains the local demonstrator application:

```text
web/
├── backend/      FastAPI API, services, PostgreSQL access, and tests
├── frontend/     Next.js public landing page and demonstrator screens
├── doc/          API decisions and implementation notes
├── .env.example  local backend and seed configuration
└── DESIGN.md     historical visual references
```

## Start locally

From the repository root, start PostgreSQL:

```bash
docker compose -f dependencies/compose.yml up -d
```

Then start the backend:

```bash
cd web
cp .env.example .env
cd backend
uv sync
uv run python -m app.seed
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

By default, the seed loads the 999 patients with a serum history plus one
featured synthetic case. The `--all-patients` option loads all 51,000 profiles.
Use `--only` to target one stage among `patients`, `synthetic`, `serum`,
`history`, `featured`, and `users`.

In a second terminal, start the frontend:

```bash
cd web/frontend
cp .env.example .env
npm ci
npm run dev
```

- landing page: <http://localhost:5173>;
- demonstrator: <http://localhost:5173/login>;
- API: <http://localhost:8000>;
- OpenAPI: <http://localhost:8000/docs>.

The local account is configured with `SEED_USER_EMAIL` and
`SEED_USER_PASSWORD` in `web/.env`. Values provided in `.env.example` are for
local development only.

## Contract

The backend is the source of truth. Routes declare Pydantic models, and the
frontend validates responses with Zod before using them. The session cookie is
HTTP-only and is sent with backend requests.

The core workflow uses synthetic data exclusively. The import shown in the
interface is simulated and does not upload any file to the server.

## Documentation

- [system architecture](../docs/ARCHITECTURE.md);
- [demonstration workflow](../docs/DEMO.md);
- [responsible use](../docs/RESPONSIBLE_USE.md);
- [endpoint catalog](doc/api-endpoints.md);
- [API decision log](doc/api-decisions.md).
