# Hackathon Adopt AI — HLA Twin

Monorepo for the HLA Twin hackathon demonstrator.

## Workspaces

- [`data-model/`](data-model/README.md): deterministic synthetic data contracts,
  canonical scenarios, validation, and tests.
- [`web/backend/`](web/backend/): FastAPI application, local database access,
  deterministic seed workflow, and backend tests.
- [`web/frontend/`](web/frontend/): React and TypeScript application.
- [`dependencies/`](dependencies/): local PostgreSQL service for development.

The demonstrator is decision support only. It never validates a clinical result
without a human reviewer.

## Local checks

Run each command from its workspace:

```bash
# Data contracts and deterministic scenarios
cd data-model
PYTHONPATH=src python3 -m unittest discover -s tests -v
PYTHONPATH=src python3 -m hla_data_model.validator data/scenarios

# Backend
cd ../web/backend
uv sync
uv run pytest

# Frontend
cd ../frontend
npm ci
npm run lint
npm run build
```
