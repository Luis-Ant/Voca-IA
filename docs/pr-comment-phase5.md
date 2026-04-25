# PR comment corto — Fase 5

## Estado

- Fase 5 lista localmente.
- Queda listo release humano.
- Bloqueante actual: push pendiente por SSH.

## Validación local

- `npm test` ✅
- `npm run test:smoke` ✅
- `npx tsc --noEmit` ✅

## Qué validar al destrabarse el push

1. Generar preview.
2. Ejecutar smoke manual en preview.
3. Si da ok, promover a prod.
4. Repetir smoke en prod.
5. Si prod da ok, merge.

## Docs operativas

- `docs/release-checklist.md`
- `tests/smoke/flujo-migracion.smoke.md`
