# Ariane frontend

Next.js 16 application using the App Router, React 19, strict TypeScript, and
Tailwind CSS 4.

## Routes

| Route | Access | Content |
| --- | --- | --- |
| `/` | Public | Landing page, award, video, architecture, and limitations |
| `/login` | Public | Local demonstrator sign-in |
| `/dashboard` | Session | Workspace overview and simulated import |
| `/fiche/[id]` | Session | Patient history and serum evolution |
| `/a-signer` | Session | Cases prepared for human validation |
| `/a-consulter` | Session | Cases requiring detailed review |

## Configuration

```bash
cp .env.example .env
npm ci
```

`NEXT_PUBLIC_API_URL` defines the FastAPI backend origin without `/api/v1`.

## Commands

```bash
npm run dev        # http://localhost:5173
npm run lint
npm run typecheck
npm run test:ui
npm run build
npm run start      # production build on :5173
```

Playwright tests use controlled synthetic responses and block internet access.
They never sign a case in a real local database.

## Structure

```text
app/               Next.js routes and layouts
src/features/      pages and workflow-specific logic
src/shared/        shared components, schemas, API calls, and hooks
src/components/ui/ interface components
src/constants/     shared frontend values
public/brand/      Ariane identity assets
public/showcase/   demonstration screenshots and video
```

The visual direction is documented in
[`../doc/rigueur-calme.md`](../doc/rigueur-calme.md). Communication boundaries
are defined in [`../../docs/RESPONSIBLE_USE.md`](../../docs/RESPONSIBLE_USE.md).
