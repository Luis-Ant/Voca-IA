# Voca-IA

Plataforma de orientación vocacional.

## Estado actual

Repositorio consolidado en **Next.js 15 + App Router + Route Handlers** (TypeScript).

### Alcance v1

- Sin base de datos.
- Sin autenticación.
- Deploy objetivo: **Vercel**.

## Stack

- Next.js 15
- React 19
- TypeScript
- Zod (validación runtime)

## Flujo funcional

1. `Home` (`/`)
2. `Questions` (`/questions`)
3. Evaluación de ramas (incluye desempate)
4. Evaluación de carreras
5. `Results` (`/results`)

## API

- `GET /api/preguntas-generales`
- `POST /api/evaluar-ramas`
- `POST /api/evaluar-carrera`

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Validación (sin build)

```bash
npm test
npm run test:smoke
npx tsc --noEmit
```

## Deploy en Vercel paso a paso

### Prerequisitos

1. Node.js instalado para validación local.
2. Cuenta y proyecto en Vercel conectados al repo.
3. Rama lista con validaciones locales en verde.
4. Confirmar que v1 no requiere DB ni auth.

### Comandos a correr antes del deploy

```bash
npm test
npm run test:smoke
npx tsc --noEmit
```

### Pasos en Vercel

1. Importar/conectar el repo en Vercel.
2. Framework detectado: **Next.js**.
3. Root directory: repo raíz.
4. No agregar variables de entorno para v1 salvo que cambie alcance.
5. Ejecutar deploy de preview sobre la rama.
6. Validar preview con `tests/smoke/flujo-migracion.smoke.md`.
7. Promover a producción cuando el smoke manual dé ok.

### Qué validar post deploy

- `/` carga y navega a `/questions`.
- `/questions` obtiene preguntas y permite completar flujo.
- `/results` resuelve fallback si entrás sin estado.
- Casos de empate y errores visibles siguen funcionando.
- APIs `/api/preguntas-generales`, `/api/evaluar-ramas` y `/api/evaluar-carrera` responden.

### Rollback básico

1. Ir a Vercel → Deployments.
2. Identificar último deploy sano.
3. Promover ese deployment o redeploy del commit estable.
4. Repetir smoke manual básico.
5. Documentar incidente antes de reintentar.

## Smoke tests ejecutables

- Archivo: `tests/smoke/api.smoke.test.ts`
- Manual complementario: `tests/smoke/flujo-migracion.smoke.md`

Ejecutar:

```bash
npm run test:smoke
```

## Documentación

- [`docs/prd.md`](docs/prd.md)
- [`docs/adr/001-nextjs-serverless-v1.md`](docs/adr/001-nextjs-serverless-v1.md)
- [`docs/spec-migracion-next.md`](docs/spec-migracion-next.md)
- [`docs/api-contract.md`](docs/api-contract.md)
- [`docs/dod-release-checklist.md`](docs/dod-release-checklist.md)
- [`docs/release-checklist.md`](docs/release-checklist.md)
- [`docs/operacion-produccion.md`](docs/operacion-produccion.md)
- [`docs/pr-comment-phase5.md`](docs/pr-comment-phase5.md)
