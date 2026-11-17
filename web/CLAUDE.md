# Project context

## Purpose and safety boundary

Ariane prepares the immunological review of synthetic kidney-transplant cases
so biological experts can focus on interpretation. It structures patient
history, serum evolution, and work queues; a professional always makes the
final decision.

- The demonstrator does not claim an official LymFIP integration and never
  replaces a biologist's assessment.
- Treat health-like data as sensitive: never log it, hard-code it in tests, or
  expose it without authentication.
- Do not invent LymFIP formats, access methods, medical rules, thresholds, or
  interpretations. Ask for validated input when they are unknown.
- Use synthetic data only. All results require human validation.

## Repository architecture

```text
Hackathon-Adopt-AI/
├── dependencies/       # PostgreSQL + pgvector Docker Compose
└── web/
    ├── backend/        # FastAPI application
    └── frontend/       # Next.js App Router application
```

Paths beginning with `backend/` or `frontend/` in this file are relative to
`web/`.

## Stack

The backend uses Python, FastAPI, SQLAlchemy, Pydantic, asyncpg, and uv. Every
route validates both input and output and returns a Pydantic response model,
never a SQLAlchemy entity directly.

The frontend uses Next.js 16, React 19, strict TypeScript, Zod, Tailwind CSS,
Motion, GSAP, TanStack Query, TanStack Table, React Hook Form, and nuqs. Next.js
routes live in `app/`; product screens and logic live in `src/features/`.

PostgreSQL 17 with pgvector runs through `dependencies/compose.yml`. Secrets
and connection settings belong in `.env`; `.env.example` contains safe local
placeholders. Docker Compose reads `dependencies/.env` automatically, not
`web/.env`; use `--env-file web/.env` when needed.

## API and contracts

The local API base URL is `http://localhost:8000/api/v1`. OpenAPI remains at
`/docs`, `/redoc`, and `/openapi.json`. Keep `doc/api-endpoints.md` and
`doc/api-decisions.md` synchronized with code changes.

`GET /api/v1/analysis/result` is the only public product route. It is allowed
only because `AnalysisResultRead` enforces `synthetic: true`. Real or
patient-level results must use a separate authenticated route.

`patients.patient_id` is the stable functional identifier, while `patients.id`
is the technical UUID used in URLs. Synthetic profiles, serum tests, and event
history join through `patient_id`. All generated identities and events are
fictional and deterministic.

The default seed loads 999 patients with serum history plus the featured
synthetic case: 1,000 patients total, with 714 constant-profile cases proposed
for signature and 286 fluctuating-profile cases proposed for review. These are
demonstration figures, not clinical results.

Run the seed from `web/backend/`:

```bash
uv run python -m app.seed \
  [--csv PATH] [--serum-csv PATH] \
  [--only patients|synthetic|serum|history|featured|users] \
  [--all-patients] [--reset]
```

The seed is deterministic, replayable, and transactional. It processes batches
of 400 rows to stay under asyncpg's parameter limit. `create_all` does not
migrate existing tables; after an entity change, rerun the seed with `--reset`.
User and session tables are never part of that reset.

## Authentication

Authentication uses FastAPI Users with an opaque database-backed token in an
`HttpOnly`, `SameSite=lax` cookie. `Secure` is enabled unless
`COOKIE_SECURE=false`. Passwords use Argon2id and are never logged or returned.

Public routes are registration and login. Product routes require
`Depends(current_active_user)`. Logout revokes the current token; logout-all
revokes every token owned by the current user. The frontend reads session state
through `GET /users/me` and never reads the cookie directly.

The public landing page is `/`; the local demonstrator sign-in is `/login`.
Product data queries remain disabled until the simulated import has completed.
The import reads and uploads no file; its completion flag lives in the current
tab's `sessionStorage` and is cleared on logout.

Password reset, email verification, rate limiting, automatic session
revocation after password changes, and database migrations are not implemented.

## Commands

| Action | Command | Directory |
| --- | --- | --- |
| Start PostgreSQL | `docker compose -f ./dependencies/compose.yml up -d` | repository root |
| Start backend | `uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000` | `web/backend/` |
| Start frontend | `npm run dev` | `web/frontend/` |
| Run backend tests | `uv run pytest` | `web/backend/` |

## Engineering conventions

- The HTTP API is the frontend/backend contract: Pydantic on the server, Zod
  on the client.
- Validate every boundary and return structured errors.
- Put meaningful literals in the appropriate constants directory. Put
  environment-specific values and secrets in configuration.
- Never commit `.env`, `.venv`, `node_modules`, or database volumes.
- Follow the current Ariane visual system documented in
  `doc/rigueur-calme.md`; `DESIGN.md` is a historical reference only.
