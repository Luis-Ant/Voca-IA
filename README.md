# Voca-IA

Plataforma de orientación vocacional.

## Estado actual

Repositorio consolidado en **Next.js 15 + App Router + Route Handlers** (TypeScript).

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
