## Purpose
- Keep API layer aligned with canonical contract.
- Protect request/response compatibility in migration.

## Do Rules
- Follow docs/api-contract.md as single source of truth.
- Use base path /api.
- Use kebab-case canonical routes:
  - GET /api/preguntas-generales
  - POST /api/evaluar-ramas
  - POST /api/evaluar-carrera
- Use JSON payloads and responses.
- Validate quiz answers as "sí" | "no".
- Keep legacy underscore aliases temporary compatibility only.

## Dont Rules
- Do not invent new endpoint names.
- Do not change payload shape without contract update.
- Do not return non-JSON content.
- Do not move business rules into transport glue.

## Done Criteria
- Endpoints match docs/api-contract.md.
- Status codes and response shapes stay contract-safe.
- API changes are minimal and documented in contract when needed.
