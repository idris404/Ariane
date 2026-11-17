# Documentation

Backend and API decisions and references. This directory complements
`README.md` (setup) and `CLAUDE.md` (conventions) without replacing them.

| File | Content |
| --- | --- |
| [api-endpoints.md](api-endpoints.md) | Endpoint catalog: method, path, protection, parameters, responses, and error format. Use it when **calling** the API. |
| [api-decisions.md](api-decisions.md) | API decision log, including rationale and consequences. Use it to **understand or evolve** the API. |

FastAPI's generated interactive documentation remains the exact source for
schemas: `http://localhost:8000/docs` (OpenAPI: `/openapi.json`).

## Keep this documentation current

- When an endpoint is added, removed, or changed, update `api-endpoints.md` in
  the same change as the code.
- When a decision is made about endpoint behavior, conventions, or trade-offs,
  append the next numbered entry to `api-decisions.md`. Never renumber entries.
  Mark a superseded decision as “Superseded by D-xx” instead of deleting it.
- Use this template:

```markdown
### D-xx — Short title

- **Status**: Requested | Design choice | To be confirmed
- **Decision**: what was selected.
- **Why**: the constraint or rationale.
- **Consequences**: implications for API consumers and maintainers.
```

Statuses: **Requested** means explicitly requested by the team; **Design
choice** records an implementation convention; **To be confirmed** marks an
assumption that still requires validation or correction.
