# Vercel and Neon Deployment

The public production environment uses a Vercel Services project: Next.js is the public service and FastAPI remains private. The browser calls `/api/backend/*` on the same origin; the Next.js route forwards only `/api/v1/*` paths to the Python service. The session cookie therefore remains HTTP-only, `Secure`, and scoped to the public domain.

Neon hosts only synthetic demonstrator data. Use an encrypted pooled connection supplied to FastAPI through the `DATABASE_URL` secret.

## Production variables

| Service | Variable | Expected value |
| --- | --- | --- |
| frontend | `NEXT_PUBLIC_API_URL` | `/api/backend` |
| backend | `DATABASE_URL` | Pooled Neon URL with `sslmode=require` |
| backend | `FRONTEND_URL` | Public Vercel URL |
| backend | `COOKIE_SECURE` | `true` |

`BACKEND_URL` is not a manually entered secret. Vercel provides it to the frontend through the service binding declared in `vercel.json`.

Demonstration account credentials must not remain in the API process. They are used only during seeding through `SEED_USER_EMAIL` and `SEED_USER_PASSWORD`, then removed from the runtime environment.

## Initialization

From an authorized machine, load `DATABASE_URL`, `SEED_USER_EMAIL`, and `SEED_USER_PASSWORD` without writing them to the repository, then run:

```bash
cd web/backend
uv run python -m app.seed
```

The seed is repeatable and loads 1,000 entirely synthetic profiles by default. Never use `--reset` on an existing database without first checking which signatures and accounts must be retained.

## Pre-release checks

```bash
cd web/backend && uv run pytest
cd web/frontend && npm run lint && npm run typecheck && npm run test:ui && npm run build
```

After deployment, verify the landing page, video, sign-in, both queues, one patient file, explicit signing, and sign-out. Public communication must retain the statements **synthetic data**, **target to be measured**, and **human validation required**.
