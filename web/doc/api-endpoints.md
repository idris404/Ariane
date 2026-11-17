# Endpoint catalog

Local base URL: `http://localhost:8000/api/v1`.

Last updated: 2026-11-15 · 17 operations.

## Overview

| Method | Path | Protection | Purpose |
| --- | --- | --- | --- |
| `GET` | `/analysis/result` | Public | Fixed synthetic analysis result |
| `POST` | `/auth/register` | Public | Register an account |
| `POST` | `/auth/login` | Public | Sign in and set the session cookie |
| `POST` | `/auth/logout` | Session | Revoke the current session |
| `POST` | `/auth/logout-all` | Session | Revoke all current-user sessions |
| `GET`, `PATCH` | `/users/me` | Session | Read or update the current profile |
| `GET`, `PATCH`, `DELETE` | `/users/{id}` | Superuser | Manage one user |
| `GET` | `/patients` | Session | Paginated patients with serum tests |
| `GET` | `/patients/{id}` | Session | One patient with serum tests |
| `GET` | `/synthetic-patients` | Session | Paginated synthetic profiles |
| `GET` | `/patients/{id}/synthetic-patients` | Session | Synthetic profiles for one patient |
| `GET` | `/signatures/queue` | Session | Simple cases awaiting validation |
| `POST` | `/signatures` | Session | Validate one patient case |
| `GET` | `/consultations/queue` | Session | Fluctuating cases requiring review |

A session is the `HttpOnly` cookie set by `/auth/login`; clients must send it
with `credentials: "include"`. Without a valid active session, protected routes
return `401`.

`id` is a patient's technical UUID and is used in URLs. `patient_id` is the
stable functional identifier, such as `HIS-00355`, and is used for joins and
filters. Do not interchange them.

## Common conventions

List endpoints return:

```json
{ "items": [], "total": 1000, "page": 1, "page_size": 20 }
```

| Parameter | Type | Default | Constraint |
| --- | --- | --- | --- |
| `page` | integer | `1` | at least 1 |
| `page_size` | integer | `20` | 1 to 100 |
| `sort_by` | endpoint-specific enum | endpoint-specific | unknown values return `422` |
| `sort_order` | `asc` or `desc` | `asc` | |

Totals include every filtered result. Null values sort last in both directions,
and ties are stable. Unknown query parameters return `422`; empty search fields
behave as absent filters. Text search is case-insensitive but accent-sensitive.
Literal `%` and `_` are escaped rather than treated as SQL wildcards.

### Error format

| Status | Body | Meaning |
| --- | --- | --- |
| `400` | `{"detail":"LOGIN_BAD_CREDENTIALS"}` | Invalid or disabled credentials |
| `401` | `{"detail":"Unauthorized"}` | Missing or invalid session |
| `403` | `{"detail":"Forbidden"}` | Insufficient privileges |
| `404` | `{"detail":"PATIENT_NOT_FOUND"}` | Unknown patient |
| `409` | `{"detail":"PATIENT_ALREADY_SIGNED"}` | Duplicate signature |
| `422` | FastAPI validation details | Invalid input |

Business error codes are stable constants. Validation errors retain FastAPI's
standard `422` structure.

## Analysis

### `GET /analysis/result`

Public, parameter-free, and synthetic-only. The schema enforces
`synthetic: true`; it must never be reused for real patient results.

```json
{
  "case_id": "SYN-CASE-001",
  "synthetic": true,
  "phase": "pre_transplant",
  "profile": {
    "profile_score": 4,
    "score_status": "pending_review",
    "proposed_risk_category": "medium",
    "category_status": "pending_review",
    "factors": [],
    "missing_data": []
  },
  "assays": [],
  "history_pattern": "negative_constant",
  "history_pattern_status": "pending_review",
  "trend": "stable",
  "discordances": [],
  "review_status": "human_review_required",
  "candidate_for_simplified_review": false,
  "triggered_rules": [],
  "ruleset_version": "pending_review",
  "uncertainties": [],
  "human_validation_required": true,
  "provenance": {
    "source_record_copied": false,
    "generator_version": "demo-v1"
  }
}
```

Unknown result collections remain loosely typed until the medical contract is
validated.

## Authentication and users

| Endpoint | Request | Success |
| --- | --- | --- |
| `POST /auth/register` | `{email, password}`; password 12–256 characters | `201`, user without password data |
| `POST /auth/login` | `{email, password}` | `204`, session cookie set |
| `POST /auth/logout` | none | `204`, current token revoked |
| `POST /auth/logout-all` | none | `204`, all current-user tokens revoked |
| `GET /users/me` | none | `200`, current user |
| `PATCH /users/me` | fields to update | `200`, updated user |
| `/users/{id}` | superuser only | `200` or `204` |

Passwords and password hashes never appear in responses.

## Patients

Patient identities, locations, histories, and serum values are deterministic
and synthetic. Serum `*_output` values equal `1` when the simulated antigen
value is at least 500. This threshold describes the demonstrator dataset and
must not be presented as a validated clinical rule.

### Patient response

```text
id, patient_id, firstname, lastname, birth, gender, city, country, created_at,
serum_tests[], serum_evolution, history[]
```

`serum_tests` are ordered by `test_date`. `serum_evolution` groups the same
simulated B12, B13, DR53, DR51, and DQ10 values by date. `history` contains
fictional events and is ordered by `occurred_on`.

### `GET /patients`

Additional filters:

| Parameter | Behavior |
| --- | --- |
| `search` | all words must match `patient_id`, first name, or last name |
| `gender` | exact `M` or `F` |
| `city`, `country` | case-insensitive exact match |
| `birth_from`, `birth_to` | inclusive ISO-date bounds |
| `sort_by` | `patient_id`, `firstname`, `lastname`, `birth`, `gender`, `city`, `country`, or `created_at` |

The default sort is `lastname`. Reversed birth bounds return `422`.

### `GET /patients/{id}`

Returns one patient by UUID. An unknown UUID returns
`404 PATIENT_NOT_FOUND`; a functional `patient_id` in the path returns `422`.

## Synthetic patients

Each response exposes `id`, `created_at`, and the 65 CSV fields under their
lowercase API names. Nullable CSV cells become `null`. `_`-prefixed generator
truth fields are returned by alias but cannot be filtered or sorted. These
fields are pending a product decision and must not be treated as clinical
ground truth.

### `GET /synthetic-patients`

| Parameter | Behavior |
| --- | --- |
| `search` | substring of `patient_id` |
| `patient_id` | case-insensitive exact match |
| `sexe` | exact `M` or `F` |
| `jeu`, `phase`, `statut_parcours`, `organe` | case-insensitive exact match |
| `sort_by` | allowlisted identity, date, phase, status, organ, or creation fields |

Returns the common paginated envelope. A page of 100 records is approximately
179 KB with the current schema.

### `GET /patients/{id}/synthetic-patients`

Accepts only pagination and sorting parameters. A known patient with no
synthetic record returns an empty `200` page; an unknown patient returns
`404 PATIENT_NOT_FOUND`.

## Human validation queues

### `GET /signatures/queue`

Returns up to five unsigned constant-profile cases plus `remaining`:

```json
{ "items": [], "remaining": 714 }
```

Eligibility is demonstrator logic pending professional review. Every item is a
full Patient response and still requires human validation.

### `POST /signatures`

Request body: `{"patient_id":"<patient UUID>"}`. The value is the technical
UUID despite the field name. Success returns `201` with the functional
`patient_id`, `signed_by`, and server-generated `signed_at`. Unknown patients
return `404`; repeated signatures return `409`.

### `GET /consultations/queue`

Returns profile `C` cases in the common paginated envelope. A signature does
not remove a case from this review-only queue. The current synthetic dataset
contains 286 such cases; this is a demo count, not a clinical statistic.
