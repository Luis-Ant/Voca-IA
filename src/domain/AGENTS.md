## Purpose
- Keep domain core pure and framework-agnostic.
- Hold business rules in isolated functions.

## Do Rules
- Write pure functions (same input, same output).
- Keep domain deterministic and testable.
- Use explicit inputs/outputs.
- Keep domain types and rules independent.

## Dont Rules
- Do not import framework code.
- Do not import HTTP, DB, UI, or runtime adapters.
- Do not add side effects inside domain logic.
- Do not read env/process globals in domain.

## Done Criteria
- Domain files contain pure business logic only.
- No framework imports in domain.
- Functions are easy to test in isolation.
