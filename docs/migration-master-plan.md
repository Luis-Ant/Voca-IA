# Plan maestro de migración — Voca-IA

Fuente de verdad final para continuar la migración y release de Voca-IA.

## 1. Objetivo del proyecto

Consolidar Voca-IA en una única aplicación **Next.js 15 + App Router + Route Handlers**, desplegable en **Vercel**, manteniendo paridad funcional del flujo vocacional v1:

1. Home `/`.
2. Quiz `/questions`.
3. Evaluación de ramas.
4. Desempate de ramas si aplica.
5. Evaluación de carreras.
6. Resultado `/results`.

Alcance v1:

- Sin base de datos.
- Sin autenticación.
- Catálogo de preguntas versionado en código.
- API interna serverless en Next.
- Validación local sin ejecutar `npm run build`.

## 2. Arquitectura final

Arquitectura activa:

- `app/`: UI con App Router.
- `app/api/**/route.ts`: Route Handlers serverless.
- `src/domain/**`: reglas puras, sin Next, React, `window` ni transporte HTTP.
- `src/application/**`: casos de uso/orquestación.
- `src/infrastructure/**`: catálogos en memoria, schemas y adaptadores HTTP.
- `tests/unit/**`: validación de dominio.
- `tests/smoke/**`: smoke tests API y checklist manual.

Endpoints canónicos:

- `GET /api/preguntas-generales`
- `POST /api/evaluar-ramas`
- `POST /api/evaluar-carrera`

El repositorio ya es **Next-only**. `client/` y `server/` legacy fueron removidos.

## 3. Decisiones aceptadas

- Usar **Next.js 15 + App Router** como plataforma única.
- Usar **Route Handlers** para API serverless.
- Desplegar en **Vercel**.
- Mantener v1 **sin DB** y **sin auth**.
- Mantener dominio puro separado de framework e infraestructura.
- Usar rutas API canónicas en **kebab-case**.
- Validar runtime con **Zod**.
- No ejecutar `npm run build` como validación manual de esta fase.
- Fuente de verdad de contrato API: `docs/api-contract.md`.
- Fuente de verdad operativa de release: `docs/release-checklist.md`.
- Fuente de verdad de estado global: este documento.

## 4. Fases y estado

| Fase | Estado | Resultado |
|---|---|---|
| Fase 1 — Next base + dominio | DONE | Next.js 15, App Router, Route Handlers, dominio puro, tests unitarios y AGENTS por capas completados. |
| Fase 2 — Remoción legacy | DONE | `client/` y `server/` removidos. Repo consolidado como Next-only. |
| Fase 3 — Hardening UX/API | DONE | Manejo de errores UX/API reforzado y smoke tests API ejecutables agregados. |
| Fase 4 — Preparación Vercel | BLOCKED | Configuración, headers, metadata y docs de producción/rollback listas localmente. Bloqueado solo por push SSH pendiente. |
| Fase 5 — Release humano final | BLOCKED | Checklist final y comentario PR listos localmente. Falta push, preview, validación prod y merge. |

No hay fases funcionales pendientes dentro del repo local. Lo pendiente es publicación/validación remota.

## 5. Commits relevantes conocidos

- `998e6dc` — `feat(next): migrate quiz flow to app router and serverless api`
- `b44ff57` — `chore(repo): remove legacy vite and flask code after phase 2`
- `95a3908` — `docs: update project status after legacy removal`
- `c90e9d5` — `feat(quality): harden error recovery and add api smoke tests`
- `6cc1361` — `chore(deploy): prepare vercel rollout and rollback docs`
- `32bc072` — `docs(release): add final human rollout checklist`

## 6. Validaciones requeridas

Ejecutar antes de push, PR, preview y cierre:

```bash
npm test
npm run test:smoke
npx tsc --noEmit
```

No ejecutar:

```bash
npm run build
```

## 7. Estado actual exacto

- Rama actual: `feat/next-rewrite-phase-1`.
- Tracking: `origin/feat/next-rewrite-phase-1`.
- Estado git conocido: rama local **ahead 2**.
- Commits locales pendientes de push:
  - `6cc1361`
  - `32bc072`
- Bloqueante actual: **push por SSH pendiente**.
- No hacer push hasta que el acceso SSH vuelva.
- No hay que tocar lógica de app para cerrar planeación.

## 8. Próximos pasos cuando vuelva push

1. Confirmar rama:
   ```bash
   git status --short --branch
   ```
2. Confirmar que sigue `ahead 2` y sin cambios inesperados.
3. Ejecutar validaciones locales:
   ```bash
   npm test
   npm run test:smoke
   npx tsc --noEmit
   ```
4. Hacer push de `feat/next-rewrite-phase-1`.
5. Abrir o actualizar PR.
6. Pegar comentario usando `docs/pr-comment-phase5.md`.
7. Esperar preview de Vercel.
8. Ejecutar smoke manual de `tests/smoke/flujo-migracion.smoke.md` en preview.
9. Si preview da OK, promover a producción.
10. Repetir smoke manual en producción.
11. Mergear solo con preview y producción validadas.

## 9. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Push SSH sigue bloqueado | No reescribir historia. Resolver acceso y pushear la rama actual. |
| Drift entre docs | Usar este plan como estado global; usar `docs/planning-index.md` para elegir documento. |
| Regresión de contrato API | Ejecutar `npm run test:smoke` y revisar `docs/api-contract.md`. |
| Regresión de flujo UX | Ejecutar smoke manual en preview y prod. |
| Deploy Vercel falla | No promover a prod. Revisar logs, corregir rama y regenerar preview. |
| Falla en producción | Aplicar rollback de `docs/operacion-produccion.md`. |

## 10. Criterios de cierre total

La migración queda cerrada al 100% cuando:

- La rama `feat/next-rewrite-phase-1` está pusheada.
- La PR existe o está actualizada con contexto claro.
- `npm test` está verde.
- `npm run test:smoke` está verde.
- `npx tsc --noEmit` está verde.
- Preview de Vercel está generada y validada manualmente.
- Producción está promovida y validada manualmente.
- No hay rollback activo.
- La PR fue aprobada y mergeada.
- README y docs apuntan a este plan maestro y al índice.
