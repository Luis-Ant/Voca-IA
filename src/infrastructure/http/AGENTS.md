## Purpose
- Implement HTTP adapters for external transport.
- Translate between wire format and domain format.

## Do Rules
- Keep controllers/handlers thin.
- Validate and normalize incoming payloads.
- Map domain results to HTTP status and JSON.
- Keep serialization logic explicit and small.

## Dont Rules
- Do not place business decisions here.
- Do not leak framework/request objects into domain.
- Do not duplicate domain rules in adapter code.
- Do not bypass contract constraints.

## Done Criteria
- HTTP layer acts as adapter only.
- Domain stays isolated from transport concerns.
- Responses are consistent and contract-safe.
