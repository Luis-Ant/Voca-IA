# Voca-IA — Contrato API canónico (v1)

> Fuente única de verdad para rutas y payloads durante la migración a Next.js serverless.

## Convenciones

- Base path: `/api`
- Naming de rutas: **kebab-case**
- `Content-Type`: `application/json`
- Codificación de respuestas de quiz: `"sí" | "no"`

## Endpoints canónicos

1. `GET /api/preguntas-generales`
2. `POST /api/evaluar-ramas`
3. `POST /api/evaluar-carrera`

---

## 1) GET `/api/preguntas-generales`

### Response 200

```json
{
  "Ingeniería y Ciencias Físico Matemáticas": ["..."],
  "Ciencias Médico Biológicas": ["..."],
  "Ciencias Sociales y Administrativas": ["..."]
}
```

### Errores

- `500` si ocurre fallo interno inesperado.

---

## 2) POST `/api/evaluar-ramas`

### Request

```json
{
  "Ingeniería y Ciencias Físico Matemáticas_0": "sí",
  "Ciencias Médico Biológicas_1": "no"
}
```

### Reglas de validación

- Valores permitidos: `"sí" | "no"`
- Keys con patrón `<rama>_<indice>`

### Response 200 — rama elegida

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

### Response 200 — empate de ramas

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

### Errores

- `400` payload faltante/inválido
- `422` estructura inválida
- `500` fallo interno

---

## 3) POST `/api/evaluar-carrera`

### Request — contexto de rama específica

```json
{
  "rama": "Ingeniería y Ciencias Físico Matemáticas",
  "respuestas": {
    "Ingeniería en Sistemas Computacionales_0": "sí",
    "Ingeniería Industrial_1": "no"
  }
}
```

### Request — contexto de desempate

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

### Response 200 — resultado final

```json
{
  "status": "resultado_final",
  "rama_sugerida": "Ingeniería y Ciencias Físico Matemáticas",
  "carreras_sugeridas": ["Ingeniería en Sistemas Computacionales"],
  "message": "La carrera que más se ajusta a tus intereses es:"
}
```

### Response 200 — empate de carrera

```json
{
  "status": "empate_carrera",
  "rama_sugerida": "Múltiples Ramas",
  "carreras_sugeridas": ["Carrera A", "Carrera B"],
  "message": "Has mostrado el mismo interés por varias carreras..."
}
```

### Response 200 — sin carreras evaluadas

```json
{
  "status": "no_carreras_evaluadas",
  "message": "No se pudieron evaluar carreras con los datos proporcionados."
}
```

### Errores

- `400` contexto faltante o payload inválido
- `422` estructura inválida
- `500` fallo interno

---

## Compatibilidad legacy (temporal)

Durante migración, se permite alias temporal para rutas legacy Flask:

- `/api/preguntas_generales`
- `/api/evaluar_ramas`
- `/api/evaluar_carrera`

La versión canónica para desarrollo nuevo y documentación es la de kebab-case.
