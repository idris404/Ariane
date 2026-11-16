# HLA Twin — Rigueur calme

## Scope and audit (2026-11-15)

This section records the frontend state before the public showcase and Next.js
migration. For the current implementation, see the 2026-11-16 update below.

The requested repository is `idris404/Hackathon-Adopt-AI`, local checkout
`Hackathon-Adopt-AI`, branch `main`. The initial working tree was clean.
The similarly named `Hackathon AdoptAI` checkout points to the old `HLA-twin`
repository and was not modified.

There is no root or nested `AGENTS.md` in the target checkout. The supplied
agent instructions apply. `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`,
`docs/HACKATHON_RUNBOOK.md`, `docs/MEDICAL_RULES.md`, and the future data model
are absent here; their copies in the old repository were consulted as historical
context only. Current sources inspected: root README, web README/CLAUDE/DESIGN,
API decisions and schemas, and the data-model README.

Actual stack, verified in manifests, lockfile and installed packages:

- React 19.3.1, Vite 8.3.8, TypeScript 7.0.2, Tailwind 4.3.5.
- npm with `web/frontend/package-lock.json`; the root lockfile is an empty stub.
- React Router 8.5.1, TanStack Query/Table, Zod and React Hook Form.
- Four routed screens: login, patient list, patient file and signature queue.
- No Next.js, shadcn configuration, frontend tests or formatter script existed.
  The old README mentioned Vitest/Playwright, but neither was configured.
- `lint` and `build` passed before changes. The existing production bundle
  already exceeded Vite's 500 kB warning threshold.

The earlier green hospital-oriented Greffe4IA charter conflicts with this
request. The current direction supersedes its visual guidance, preserving its
historical reference. Older text promising removal of manual review is not a
product promise: human validation remains mandatory.

## Visual system

- Cool near-white background, white panels, restrained violet actions,
  dark neutral text, pale blue information and soft green accents.
- Semantic CSS tokens live in `frontend/src/index.css`. The palette is visual;
  it does not define risk thresholds or medical status meanings.
- Destructive small text uses darker `destructive-ink` rather than white or
  the lighter destructive swatch. Input borders are darker than panel borders
  so interactive controls remain distinguishable.
- Manrope headings and Inter body text, both local variable font files with
  OFL licenses in `public/fonts`. No runtime Google Fonts request.
- 16 px cards/controls, 24 px large panels, light borders, restrained shadows.
  Body/control text is 15 px; metadata is at least 12 px.
- Original connected-node mark, no hospital cross, photography, gradients,
  proprietary Alan assets or copied brand components.
- Focus outlines, skip link, native links/buttons/details, labelled horizontal
  table regions, and reduced-motion overrides. No perpetual animation.

## Screen behavior and boundaries

The shell exposes synthetic-data and mandatory-human-validation notices on
all authenticated screens. Login and session loading/error screens also expose
the demonstration boundary. Navigation only offers implemented routes.

The patient file prioritizes recipient identity, the existing server history,
serum evolution and missing information. `PatientRead.history` was already in
the API; the frontend now validates and renders it. Its default empty list
preserves compatibility with older payloads. No HTTP contract changed.

Serum labels use the backend `output` flags, never a client-side threshold.
Visible signs and words distinguish positive from negative. Column alignment
uses antigen codes; an absent cell is explicitly “Non transmis”. An empty
history never means no antecedents, and an empty serum series never means a
negative test. Existing status labels and profile mappings retain their meaning.

Existing fixed KPI, follow-up, treatment and audit examples remain available in
explicitly labelled illustrative panels, collapsed initially. They are not
represented as measurements or recommendations for the selected patient.
Existing no-op add/export/edit buttons are disabled with explanations; no
working action was removed. Search, filters, sort, pagination, authentication,
detail expansion and signature submission retain their existing handlers.

## Component and dependency decision

Shadcn/ui is now configured for the existing Vite/Tailwind 4 application with
`components.json` and the `@/` alias. The generated new-york components used
by existing screens are Button, Card, Badge, Alert, Input and Label. They are
owned by this project and tuned to the HLA Twin tokens, control size and
focus treatment. No new clinical behavior or API contract was introduced.
The runtime additions `cn`, `radix-ui` and `class-variance-authority` support
these shadcn primitives; no remote service is required to run them.

New shared presentation components: `DemoNotice`, `SurfaceState`,
`RecipientTimeline`. The patient file delegates to `ReviewLimits` and
`FollowUpIllustration`; the existing shell, brand, serum and page components
are adapted rather than replacing the application.

The initial visual slice added no production dependency. Development-only dependencies:
`@playwright/test` for browser regression tests and `@axe-core/playwright` for
automated accessibility checks. Both are npm-lockfile pinned. Test browser
installation is a one-time development setup step, not a demo dependency.

## Reproduction and verification

From `web/frontend`:

```bash
npm ci
npx playwright install chromium
npm run lint
npm run typecheck
npm run test:ui
npm run build
```

The test runner starts Vite on port 5181 with a local API URL. It uses only
synthetic backend-derived fixtures and intercepts API requests, including all
signature writes. It never signs a record on a running backend. Desktop
(1440 px) and mobile (360 px) projects cover session flow, search/filter/sort,
recipient history, serum labels and missing cells, errors and empty states,
signature payload/failure, focus and reduced motion. External network requests
are blocked. Axe checks WCAG A/AA on ready, expanded and error surfaces.

Automated accessibility checks do not establish full WCAG conformance or
clinical validation. Browser tests use a mocked API, not a seeded PostgreSQL
end-to-end environment. Real backend behavior is separately covered by its
existing pytest suite.

For a local demonstration, prepare dependencies, fonts, PostgreSQL and the
synthetic seed before disconnecting internet access. The application still
requires its local backend and database. Offline does not mean a standalone
frontend or a service-worker cache. No remote runtime dependency was added.

## Remaining product and medical input

- The current patient response does not supply a ruleset version, triggered
  rules, uncertainty objects, doubtful/not-tested states or contradiction
  objects. The UI explicitly reports these limitations; it does not fabricate
  values or conclude that no contradictions exist. `SurfaceState` can render
  an explicitly supplied contradiction, but no current route supplies one.
- The public `/analysis/result` is an independent synthetic demo case, not the
  selected patient's analysis. It is deliberately not attached to that patient.
- Three-donor comparison, live recalculation and a structured post-transplant
  alert are absent from this routed application. Adding them requires a
  separate agreed product/API slice and validated synthetic inputs.
- Signature queue eligibility thresholds remain the backend's existing rules;
  this visual change does not validate them. Medical review of rule meaning,
  uncertainty, status wording and illustrative content is still required.
- No root `make` commands were introduced. No commit, push, PR or deployment.

## Verification results

- `npm run lint`: passed (oxlint).
- `npm run typecheck`: passed (TypeScript project build).
- `npm run test:ui`: 26 passed across desktop and mobile, including axe checks.
- `npm run build`: passed; existing large-chunk warning remains (about 609 kB
  JavaScript, 182 kB gzip).
- `uv run pytest -q`: 319 backend tests passed.
- `PYTHONPATH=src python3 -m unittest discover -s tests -q`: 69 passed.
- `PYTHONPATH=src python3 -m hla_data_model.validator data/scenarios`: all six
  scenarios passed.
- `git diff --check`: passed.
- Changed UI files formatted with an ephemeral Prettier 3.6.2 invocation
  (`--single-quote --no-semi --print-width 100`); no formatter dependency added.
- Eight local screenshots captured: login, dashboard, recipient and signature,
  each at desktop and 360 px. These use explicitly mocked synthetic API
  responses, not a live database.

## Changed files

- `web/DESIGN.md`
- `web/doc/rigueur-calme.md`
- `web/frontend/.gitignore`
- `web/frontend/README.md`
- `web/frontend/index.html`
- `web/frontend/package-lock.json`
- `web/frontend/package.json`
- `web/frontend/playwright.config.ts`
- `web/frontend/public/favicon.svg`
- `web/frontend/public/fonts/inter-LICENSE.txt`
- `web/frontend/public/fonts/inter-variable.ttf`
- `web/frontend/public/fonts/manrope-LICENSE.txt`
- `web/frontend/public/fonts/manrope-variable.ttf`
- `web/frontend/src/constants/app.ts`
- `web/frontend/src/index.css`
- `web/frontend/src/pages/dashboard/DashboardPage.tsx`
- `web/frontend/src/pages/dashboard/hooks/usePatientList.tsx`
- `web/frontend/src/pages/login/LoginPage.tsx`
- `web/frontend/src/pages/patient-file/PatientFilePage.tsx`
- `web/frontend/src/pages/patient-file/components/Dossier.tsx`
- `web/frontend/src/pages/patient-file/components/FollowUpIllustration.tsx`
- `web/frontend/src/pages/patient-file/components/LoginPanel.tsx`
- `web/frontend/src/pages/patient-file/components/ReviewLimits.tsx`
- `web/frontend/src/pages/patient-file/schemas.ts`
- `web/frontend/src/pages/patient-file/utils.ts`
- `web/frontend/src/pages/to-sign/ToSignPage.tsx`
- `web/frontend/src/pages/to-sign/components/SignCase.tsx`
- `web/frontend/src/shared/components/AppShell.tsx`
- `web/frontend/src/shared/components/BrandMark.tsx`
- `web/frontend/src/shared/components/DemoNotice.tsx`
- `web/frontend/src/shared/components/RecipientTimeline.tsx`
- `web/frontend/src/shared/components/SerumEvolution.tsx`
- `web/frontend/src/shared/components/SessionStatusScreen.tsx`
- `web/frontend/src/shared/components/SurfaceState.tsx`
- `web/frontend/tests/fixtures.ts`
- `web/frontend/tests/review.spec.ts`

## Shadcn integration update (2026-11-15)

User requested mandatory shadcn usage after commit `a676710`. The six components
listed above are now generated and used on login, dashboard, signature, shell
and shared status surfaces. The existing CSS variables remain authoritative.
TypeScript 7 rejects the `baseUrl` option shown in current shadcn Vite docs;
the alias uses `paths` without it. Run the frontend checks above after future
component additions.

## Public showcase and Next.js migration (2026-11-16)

The frontend now runs on Next.js 16 with the App Router. The public route `/`
presents Ariane, its patient-solution award, the demonstrator, architecture and
responsible-use boundary. `/login` opens the local demo; the existing dashboard,
review queues and patient file keep their URLs behind `AuthGate`.

The application features moved from `src/pages/` to `src/features/` so Next.js
does not interpret them as a Pages Router. API calls and medical presentation
logic were not moved to server components: FastAPI remains the data and domain
source of truth. The migration does not change the HTTP contract.

The current Ariane symbol, wordmark and composed lockup live in `public/brand/`.
The landing page and repository documentation reuse the approved Rigueur calme
tokens, local fonts, flat surfaces and explicit text labels. Project media is in
`public/showcase/` and includes the demo video and interface captures.

The repository is source-visible for presentation but is not open source. The
root proprietary `LICENSE` reserves code usage and commercialization rights;
`BRAND.md` separately reserves the Ariane name, visual identity and media. This
keeps a future commercial or dual-licensing agreement possible.

Current frontend commands are:

```bash
npm ci
npm run lint
npm run typecheck
npm run test:ui
npm run build
```

Playwright starts Next.js on port 5181 with mocked synthetic API responses. The
production build and local demo remain independent of a remote runtime service.
