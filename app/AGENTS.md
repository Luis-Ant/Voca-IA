## Purpose
- Define app-layer migration boundaries.
- Keep App Router code simple and predictable.

## Do Rules
- Put route/UI orchestration here.
- Keep handlers thin. Delegate business logic out.
- Use stable naming and small files.
- Keep data flow explicit.

## Dont Rules
- Do not put domain rules here.
- Do not couple UI to infrastructure internals.
- Do not add hidden side effects.
- Do not break public route behavior.

## Done Criteria
- App code only orchestrates.
- Domain/infrastructure concerns stay separated.
- Changes are minimal and reversible.
