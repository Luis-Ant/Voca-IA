# Voca-IA

Plataforma de orientación vocacional enfocada en comunidad educativa.

## Estado del proyecto

- **Estado actual (implementado):** frontend en React + Vite (`client/`) y API en Flask (`server/`).
- **Dirección arquitectónica definida:** migración directa a **Next.js + Route Handlers serverless en Vercel** (sin DB obligatoria en v1).

La documentación de producto/arquitectura ya está creada para guiar la migración.

## Documentación esencial

- [`docs/prd.md`](docs/prd.md) — PRD ligero v1 (objetivos, alcance, KPIs, riesgos)
- [`docs/adr/001-nextjs-serverless-v1.md`](docs/adr/001-nextjs-serverless-v1.md) — decisión arquitectónica principal
- [`docs/spec-migracion-next.md`](docs/spec-migracion-next.md) — plan técnico por fases
- [`docs/api-contract.md`](docs/api-contract.md) — contrato API canónico v1
- [`docs/dod-release-checklist.md`](docs/dod-release-checklist.md) — Definition of Done + checklist de release

## Flujo funcional actual

1. `Home` → inicio del quiz
2. `Questions` → fase general por ramas
3. Evaluación de ramas:
   - rama única, o
   - empate de ramas (desempate)
4. Evaluación de carreras
5. `Results` → carrera sugerida o empate de carreras

## Estructura del repositorio

```txt
Voca-IA/
├─ client/   # Frontend React + Vite (estado actual)
├─ server/   # API Flask (estado actual)
└─ docs/     # Documentación guía para migración a Next.js
```

## Desarrollo local (estado actual)

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

## Principios de v1 (migración)

- Sin autenticación obligatoria
- Sin base de datos obligatoria
- Dominio de negocio desacoplado del transporte HTTP
- Contratos API claros y tipados
- Despliegue simple en Vercel

## Próximo hito

Iniciar la reescritura directa a Next.js según `docs/spec-migracion-next.md`, siguiendo los criterios de `docs/dod-release-checklist.md`.
