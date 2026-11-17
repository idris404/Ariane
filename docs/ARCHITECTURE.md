# Ariane Architecture

## Overview

```text
data-model/                    web/backend/                 web/frontend/
┌─────────────────────┐       ┌─────────────────────┐      ┌─────────────────────┐
│ Synthetic profiles  │       │ FastAPI API         │      │ Public landing page │
│ Serum history       │──────►│ Domain services     │─────►│ Record dashboard    │
│ Contracts and rules │       │ PostgreSQL access   │      │ Files and queues    │
└─────────────────────┘       └─────────────────────┘      └─────────────────────┘
                                         │                            │
                                         └──────── human validation ──┘
```

## Frontend

The frontend uses Next.js with the App Router. The `/` route serves the public presentation and `/login` opens the demonstrator. Data screens are protected on the client through backend session verification.

| Route | Purpose |
| --- | --- |
| `/` | Public landing page and demonstration video |
| `/login` | Local demonstrator sign-in |
| `/dashboard` | List, search, filters, sorting, and simulated import |
| `/fiche/[id]` | Record history and serum evolution |
| `/a-signer` | Records prepared for verification and signature |
| `/a-consulter` | Records retained for deeper review |

TanStack Query manages server state. Zod validates responses before use. The frontend never turns missing values into favorable conclusions and does not implement medical thresholds.

## Backend

The FastAPI backend separates routes, services, repositories, and entities. Pydantic validates inputs and outputs. SQLAlchemy accesses PostgreSQL.

The demonstrated workflow includes:

- HTTP-only cookie sessions;
- paginated patient browsing;
- record and history retrieval;
- signature and consultation queues;
- explicit signature recording.

## Data

The `data-model/` directory contains schemas, the pipeline, and synthetic scenarios. The backend seed loads the profiles, serum tests, and events required for the local workflow.

Demonstration identifiers are stable. Inputs are reproducible and contain no real patient data.

## Contract and boundaries

The frontend/backend contract is the HTTP API: Pydantic models on the server and Zod schemas on the client. The backend remains the source of truth.

Some prototype values remain scenario or mock elements. They must stay labeled as synthetic, simulated, or unvalidated. See [Responsible Use](RESPONSIBLE_USE.md).
