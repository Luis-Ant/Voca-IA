# Especificación técnica breve — Migración Voca-IA a Next.js

## 1) Objetivo técnico

Migrar Voca-IA desde arquitectura separada **Vite+React (frontend) + Flask (API)** a una única aplicación **Next.js (App Router)** desplegable en Vercel, manteniendo **paridad funcional completa** del flujo actual:

1. Preguntas generales
2. Evaluación de ramas
3. Rama única o desempate entre ramas
4. Evaluación de carreras
5. Resultado final (único o empate de carrera)

Objetivos específicos de la migración:

- Consolidar frontend y backend en un solo repositorio/artefacto ejecutable.
- Mover la lógica de evaluación a un **dominio puro** (sin dependencia de Next/React).
- Definir contratos de API tipados en **TypeScript** y validados en runtime.
- Mantener v1 sin base de datos ni autenticación.
- Preparar base para evolución (persistencia, analytics, auth) sin reescritura mayor.

---

## 2) Estado actual resumido (Vite+React + Flask)

### Frontend actual (Vite + React)

- Cliente en `client/`.
- Routing con `react-router-dom`:
  - `/` → Home
  - `/questions` → flujo de preguntas
  - `/results` → render de resultado
- Integración API por `fetch` usando `VITE_API_URL`.

### Backend actual (Flask)

- Servicio en `server/app.py`.
- Endpoints:
  - `GET /api/preguntas_generales`
  - `POST /api/evaluar_ramas`
  - `POST /api/evaluar_carrera`
- Lógica embebida en el mismo archivo:
  - Banco de preguntas generales por rama.
  - Banco de carreras/preguntas específicas por rama.
  - Cálculo de puntajes y resolución de empates.
- CORS explícito para dominios de frontend.

### Restricciones funcionales observadas

- Flujo actual depende de IDs de pregunta tipo `"{rama}_{index}"` y `"{carrera}_{index}"`.
- Respuestas esperadas como strings (`"sí" | "no"`).
- Estados de negocio del backend: `rama_elegida`, `empate_ramas_desempate`, `empate_carrera`, `resultado_final`, `no_carreras_evaluadas`.

---

## 3) Arquitectura objetivo (Next App Router + Route Handlers + dominio puro)

### Principios

1. **App Router para UI** (`app/`).
2. **Route Handlers** para API (`app/api/**/route.ts`).
3. **Dominio puro** en `src/domain/**`:
   - Sin imports de `next/*`, `react`, `window` o infraestructura.
   - Funciones determinísticas, testeables por unit tests.
4. **Separación por capas**:
   - `src/domain`: reglas de negocio y tipos del dominio.
   - `src/application`: casos de uso/orquestación.
   - `src/infrastructure`: adaptadores (HTTP mapping, catálogos en memoria).
5. **Tipado + validación runtime**:
   - TypeScript estricto.
   - Validación de payloads de entrada/salida con Zod.

### Vista de alto nivel

- UI (Server/Client Components) consume `/api/*` internos de Next.
- Route Handlers validan request con schema, ejecutan caso de uso y devuelven JSON tipado.
- Casos de uso invocan dominio puro con catálogo de preguntas en memoria (v1).

---

## 4) Estructura de carpetas objetivo propuesta

```txt
Voca-IA/
├─ app/
│  ├─ page.tsx                     # Home
│  ├─ questions/page.tsx           # Flujo de preguntas
│  ├─ results/page.tsx             # Resultado
│  └─ api/
│     ├─ preguntas-generales/route.ts
│     ├─ evaluar-ramas/route.ts
│     └─ evaluar-carrera/route.ts
│
├─ src/
│  ├─ domain/
│  │  ├─ entities/
│  │  │  ├─ rama.ts
│  │  │  ├─ carrera.ts
│  │  │  └─ pregunta.ts
│  │  ├─ services/
│  │  │  ├─ evaluarRamas.ts
│  │  │  └─ evaluarCarreras.ts
│  │  └─ types.ts
│  │
│  ├─ application/
│  │  ├─ use-cases/
│  │  │  ├─ getPreguntasGenerales.ts
│  │  │  ├─ postEvaluarRamas.ts
│  │  │  └─ postEvaluarCarrera.ts
│  │  └─ contracts.ts
│  │
│  ├─ infrastructure/
│  │  ├─ catalogo/
│  │  │  └─ preguntasCatalogo.ts   # datos en memoria (v1)
│  │  └─ http/
│  │     ├─ schemas.ts             # zod schemas req/res
│  │     └─ mappers.ts
│  │
│  └─ shared/
│     ├─ result.ts
│     └─ errors.ts
│
├─ tests/
│  ├─ unit/
│  │  ├─ evaluarRamas.test.ts
│  │  └─ evaluarCarreras.test.ts
│  └─ smoke/
│     └─ flujo-migracion.smoke.md
└─ docs/
   └─ spec-migracion-next.md
```

Notas:

- v1 mantiene catálogo en memoria para evitar dependencia de DB.
- No se implementa auth en esta etapa.

---

## 5) Mapeo de endpoints (Flask -> Next Route Handlers)

| Flask actual | Next objetivo | Método | Responsabilidad |
|---|---|---|---|
| `/api/preguntas_generales` | `/api/preguntas-generales` | GET | Retornar preguntas generales por rama |
| `/api/evaluar_ramas` | `/api/evaluar-ramas` | POST | Calcular rama elegida o desempate de ramas |
| `/api/evaluar_carrera` | `/api/evaluar-carrera` | POST | Calcular carrera(s) sugerida(s) y resultado final |

Decisión de compatibilidad:

- Internamente se usará naming **kebab-case** en rutas Next.
- Durante transición puede agregarse alias temporal para mantener compatibilidad con cliente legado, pero el contrato canónico será el de rutas nuevas.

---

## 6) Contratos de API (requests/responses esperados)

> Todas las respuestas JSON incluyen `content-type: application/json`.
> Errores de validación retornan `400` con detalle.
> Fuente de verdad de contrato canónico: `docs/api-contract.md`.

### 6.1 GET `/api/preguntas-generales`

**Response 200**

```json
{
  "Ingeniería y Ciencias Físico Matemáticas": ["..."],
  "Ciencias Médico Biológicas": ["..."],
  "Ciencias Sociales y Administrativas": ["..."]
}
```

### 6.2 POST `/api/evaluar-ramas`

**Request**

```json
{
  "Ingeniería y Ciencias Físico Matemáticas_0": "sí",
  "Ciencias Médico Biológicas_1": "no"
}
```

Reglas:

- Valor permitido por respuesta: `"sí" | "no"`.
- Keys deben respetar patrón `<rama>_<indice>`.

**Response 200 (rama elegida)**

```json
{
  "status": "rama_elegida",
  "rama_sugerida": "Ingeniería y Ciencias Físico Matemáticas",
  "preguntas_carreras": {
    "Ingeniería en Sistemas Computacionales": ["..."],
    "Ingeniería Industrial": ["..."]
  }
}
```

**Response 200 (empate para desempate)**

```json
{
  "status": "empate_ramas_desempate",
  "ramas_sugeridas": [
    "Ingeniería y Ciencias Físico Matemáticas",
    "Ciencias Médico Biológicas"
  ],
  "message": "Mostraste el mismo nivel de interés por varias áreas...",
  "preguntas_para_desempate": {
    "Ingeniería y Ciencias Físico Matemáticas": {
      "Ingeniería en Sistemas Computacionales": ["..."]
    },
    "Ciencias Médico Biológicas": {
      "Médico Cirujano y Partero": ["..."]
    }
  }
}
```

**Response 400**

```json
{
  "error": "No se recibieron datos"
}
```

### 6.3 POST `/api/evaluar-carrera`

**Request (contexto rama específica)**

```json
{
  "rama": "Ingeniería y Ciencias Físico Matemáticas",
  "respuestas": {
    "Ingeniería en Sistemas Computacionales_0": "sí",
    "Ingeniería Industrial_1": "no"
  }
}
```

**Request (contexto desempate)**

```json
{
  "ramas_desempate": [
    "Ingeniería y Ciencias Físico Matemáticas",
    "Ciencias Médico Biológicas"
  ],
  "respuestas": {
    "Ingeniería en Sistemas Computacionales_0": "sí",
    "Médico Cirujano y Partero_1": "sí"
  }
}
```

**Response 200 (resultado final)**

```json
{
  "status": "resultado_final",
  "rama_sugerida": "Ingeniería y Ciencias Físico Matemáticas",
  "carreras_sugeridas": ["Ingeniería en Sistemas Computacionales"],
  "message": "La carrera que más se ajusta a tus intereses es:"
}
```

**Response 200 (empate de carrera)**

```json
{
  "status": "empate_carrera",
  "rama_sugerida": "Múltiples Ramas",
  "carreras_sugeridas": ["Carrera A", "Carrera B"],
  "message": "Has mostrado el mismo interés por varias carreras..."
}
```

**Response 400 (payload inválido/contexto faltante)**

```json
{
  "error": "No se proporcionó contexto de rama o desempate válido"
}
```

---

## 7) Plan por fases con Definition of Done

### Fase 1 — Base Next + dominio tipado

**Alcance**

- Crear app Next con App Router y TypeScript strict.
- Portar catálogos (preguntas/ramas/carreras) a `src/infrastructure/catalogo`.
- Implementar dominio puro (`evaluarRamas`, `evaluarCarreras`) + unit tests.

**DoD**

- Build local en modo desarrollo funciona.
- Unit tests de dominio en verde.
- Sin imports de Next/React dentro de `src/domain`.

### Fase 2 — API Route Handlers con validación

**Alcance**

- Implementar `/api/preguntas-generales`, `/api/evaluar-ramas`, `/api/evaluar-carrera`.
- Validar requests con Zod.
- Mapear errores de validación a `400`.

**DoD**

- Contratos JSON cumplen ejemplos definidos.
- Casos inválidos devuelven errores consistentes.
- Paridad de estados de negocio con Flask.

### Fase 3 — Migración UI del flujo completo

**Alcance**

- Migrar páginas Home / Questions / Results a `app/**`.
- Adaptar llamadas a nueva API interna (sin `VITE_API_URL`).
- Conservar comportamiento UX del flujo actual.

**DoD**

- Flujo completo ejecutable end-to-end.
- Se mantiene secuencia general → rama/tie-break → resultado.
- No hay regresiones funcionales visibles en flujo core.

### Fase 4 — Hardening + deploy

**Alcance**

- Smoke tests manuales/e2e básicos.
- Configuración Vercel (preview + production).
- Documentación operativa y rollback.

**DoD**

- Preview deployment validado.
- Producción estable con monitoreo básico de errores.
- Rollback documentado y probado en simulación.

---

## 8) Riesgos técnicos y mitigación

1. **Riesgo: ruptura de contrato por cambio de naming en rutas**
   - Mitigación: tabla de mapeo + alias temporal + tests de contrato.

2. **Riesgo: diferencias en parsing/encoding de keys con acentos y espacios**
   - Mitigación: esquema de IDs estable, helper centralizado para construir/leer IDs y tests de casos con tildes.

3. **Riesgo: lógica de desempate inconsistente respecto a Flask**
   - Mitigación: test matrix de escenarios (rama única, empate ramas, empate carreras, contexto inválido).

4. **Riesgo: acoplar dominio a framework durante migración rápida**
   - Mitigación: regla de arquitectura: dominio puro + lint/import boundaries.

5. **Riesgo: regresión UX en navegación del flujo**
   - Mitigación: smoke checklist de navegación y rendering de resultados por tipo de estado.

---

## 9) Estrategia de pruebas mínimas

### Unit tests (obligatorio)

- Foco en `evaluarRamas` y `evaluarCarreras`.
- Casos mínimos:
  - rama única ganadora,
  - empate de ramas,
  - carrera única ganadora,
  - empate de carreras,
  - payload/contexto inválido.

### Smoke e2e/manual (mínimo viable)

Checklist:

1. Iniciar quiz desde Home.
2. Completar preguntas generales y verificar transición correcta.
3. Forzar escenario de empate de ramas y resolver desempate.
4. Verificar render final para `resultado_final` y `empate_carrera`.
5. Validar mensaje de error ante payload faltante (simulado).

Herramienta sugerida para evolución: Playwright (no bloqueante para v1).

---

## 10) Plan de despliegue en Vercel y rollback básico

### Despliegue

1. Conectar repositorio a Vercel (framework preset Next.js).
2. Configurar ramas:
   - `main` → Production
   - feature branches → Preview
3. Variables de entorno:
   - v1 idealmente sin variables críticas para core.
4. Validaciones previas a promote:
   - unit tests verdes,
   - smoke manual completado,
   - revisión de contratos API.

### Rollback básico

Estrategia recomendada (sin complejidad extra):

- Si falla release en producción, usar **Promote Previous Deployment** en Vercel para volver al último build estable.
- Mantener tag/versionado por release (`vX.Y.Z`) para trazabilidad.
- Si hubo cambio de contrato, preservar compatibilidad temporal en rutas o response fields hasta estabilizar frontend.

---

## Decisiones técnicas explícitas para v1

- **Sin base de datos**: catálogo en memoria versionado en código.
- **Sin autenticación**: endpoints públicos internos del producto.
- **TypeScript strict** como estándar de tipado.
- **Validación runtime con Zod** para requests y respuestas críticas.
- **Paridad funcional primero**, optimizaciones/limpieza de UX en iteraciones posteriores.
