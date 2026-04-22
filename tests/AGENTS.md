## Purpose
- Keep migration safety with focused tests.
- Verify contract, domain purity, and adapters.

## Do Rules
- Prefer fast unit tests first.
- Test domain functions as pure logic.
- Test API contract shapes and status codes.
- Keep fixtures minimal and explicit.

## Dont Rules
- Do not rely on brittle global state.
- Do not over-mock core domain behavior.
- Do not add slow end-to-end tests by default.
- Do not couple tests to unrelated implementation details.

## Done Criteria
- Critical flows covered with minimal tests.
- Contract behavior verified for API endpoints.
- Tests are readable, deterministic, and fast.
