# Backend API decisions

This log records the API decisions implemented by the project. Endpoint
behavior is documented in [api-endpoints.md](api-endpoints.md).

Statuses are **Requested**, **Design choice**, or **To be confirmed**. A pending
medical or product decision must not be silently converted into an implemented
rule.

Last updated: 2026-11-15.

## Cross-cutting conventions

### D-01 — Version routes under `/api/v1`

- **Status:** Design choice
- **Decision:** Product routes live below `/api/v1`; OpenAPI stays at the root.
- **Consequence:** Introduce a new API version for future incompatible changes.

### D-02 — Require a session by default

- **Status:** Design choice
- **Decision:** Product routers require an active session. Registration, login,
  and the synthetic-only analysis result are the documented exceptions.
- **Consequence:** CORS uses explicit origins with credentials, never `*`.

### D-03 — Use stable business error codes

- **Status:** Design choice
- **Decision:** Services raise domain exceptions; handlers in `main.py` map
  them once to `{"detail": "CODE"}` responses.
- **Consequence:** Clients test stable codes rather than free-form messages.

### D-04 — Keep list endpoints uniform

- **Status:** Requested for patients; generalized by design
- **Decision:** Lists use server-side pagination, sorting, and filtering and
  return `{items, total, page, page_size}`.

### D-05 — Allowlisted, stable sorting

- **Status:** Design choice
- **Decision:** `sort_by` maps an enum to columns. Nulls sort last and `id`
  provides a deterministic tie-breaker.

### D-06 — Strict query parameters

- **Status:** Design choice
- **Decision:** Unknown parameters and inconsistent ranges return `422`; empty
  text parameters behave as absent filters.

### D-07 — Case-insensitive, accent-sensitive search

- **Status:** Design choice
- **Decision:** Search is escaped substring matching, case-insensitive but
  accent-sensitive. PostgreSQL `unaccent` is not enabled.

### D-08 — Dedicated response schemas

- **Status:** Design choice
- **Decision:** Every route declares an explicit response model and never
  returns a database entity directly.

### D-09 — Patient resources are read-only

- **Status:** Design choice
- **Decision:** Patient and synthetic-patient resources expose `GET` routes
  only. Mutations require a separate authorization and audit decision.

## Analysis

### D-10 — Public analysis is synthetic-only

- **Status:** Requested; path to be confirmed
- **Decision:** `GET /analysis/result` is public only because its schema enforces
  `synthetic: true` and currently returns a fixed demonstration case.
- **Consequence:** Real results require an authenticated route and schema.

### D-11 — Keep unknown result shapes loose

- **Status:** Temporary design choice
- **Decision:** Unknown status values remain strings and currently empty result
  collections remain loosely typed rather than inventing a medical contract.

## Patients and synthetic patients

### D-12 — Provide patient detail

- **Status:** To be confirmed
- **Decision:** `GET /patients/{id}` returns one patient or
  `404 PATIENT_NOT_FOUND`.

### D-13 — Join by `patient_id`, not `id`

- **Status:** Requested
- **Decision:** `patient_id` is the stable functional key. `id` is a technical
  UUID. Related synthetic records and tests join through `patient_id`.

### D-14 — Generate deterministic fictional identities

- **Status:** Design choice
- **Decision:** Names and locations absent from the source CSV are fictional,
  deterministic, and carry no clinical meaning.

### D-15 — Distinguish missing parent from an empty child list

- **Status:** Requested; response semantics are a design choice
- **Decision:** `/patients/{id}/synthetic-patients` returns `404` for an unknown
  patient and an empty `200` page for a known patient without records.

### D-16 — Expose generator truth fields without sorting

- **Status:** To be confirmed
- **Decision:** The 13 `_`-prefixed generator truth fields are returned by alias
  but cannot be filtered or sorted.
- **Risk:** Remove them if the frontend must not see expected outcomes.

### D-17 — Limit pages to 100 records

- **Status:** To be confirmed
- **Decision:** The default page size is 20 and the maximum is 100.

### D-18 — Keep synthetic patients in a separate context

- **Status:** Design choice
- **Decision:** The synthetic-patient context depends on the patient service,
  never directly on the patient repository.

### D-19 — Limit synthetic-patient filters

- **Status:** To be confirmed
- **Decision:** Filters cover `search`, `patient_id`, `sexe`, `jeu`, `phase`,
  `statut_parcours`, and `organe`; other CSV fields are not query parameters.

### D-20 — URL `{id}` values are UUIDs

- **Status:** Design choice
- **Decision:** Patient URL parameters use the technical UUID. Functional
  `patient_id` values are used for joins and filters.

## Data and seed

### D-21 — Deterministic, replayable seed

- **Status:** Requested in stages; implementation details are a design choice
- **Decision:** The seed creates parents before dependants, derives UUIDv5 IDs,
  skips orphan rows, batches writes, and runs in one transaction.

### D-22 — Detect stale schemas until migrations exist

- **Status:** Design choice; must be revisited
- **Decision:** The seed refuses stale regenerable tables. `--reset` recreates
  them without touching user or session data.
- **Consequence:** User-authored data will require a real migration system.

## Human workflow

### D-23 — Sign simple cases with an audit record

- **Status:** Requested; eligibility thresholds to be confirmed
- **Decision:** Constant-profile unsigned cases enter the signature queue. A
  signature records the patient, current user, and server timestamp and cannot
  be undone through the current API.
- **Boundary:** Signing is human validation, not an autonomous clinical result.

### D-24 — Review fluctuating profiles

- **Status:** Requested; selection rule to be confirmed
- **Decision:** Profile `C` cases enter a paginated review-only queue. Reading a
  case does not remove it and signatures do not affect this queue.

## Open decisions

1. Whether generator truth fields should remain visible to the frontend.
2. Whether search should become accent-insensitive.
3. Whether a maximum page size of 100 remains appropriate.
4. Whether detail-by-functional-ID routes are needed.
5. The validated source, shape, and reviewer for future model results.
6. Roles, authorization, and audit requirements for patient mutations.
7. When to freeze the v1 contract and introduce migrations.
8. Rate limiting, password reset, email verification, and session revocation
   after password changes.
