# PRD Voca-IA v1 (ligero y accionable)

## 1) Resumen ejecutivo

Voca-IA v1 se enfocará en entregar una experiencia de orientación vocacional simple, útil y transparente para estudiantes, migrando la app actual (frontend React + backend Flask) a una arquitectura unificada en **Next.js + funciones serverless en Vercel**.

El flujo principal se mantiene sin cambios de negocio: **Home → Questions → Results**, con evaluación por fases:

1. preguntas generales por rama,
2. evaluación de ramas,
3. preguntas específicas de carreras (rama elegida o desempate),
4. resultado final (una o múltiples carreras).

La v1 prioriza velocidad de entrega, bajo costo operativo y despliegue simple. **No habrá autenticación ni base de datos obligatoria en v1**. El sistema operará de forma stateless, con catálogo de preguntas versionado en código y cálculo de resultados en endpoints serverless.

---

## 2) Problema y contexto

### Problema
Estudiantes adolescentes y jóvenes necesitan una guía inicial para explorar carreras, pero muchas herramientas:

- son opacas (no explican cómo recomiendan),
- tienen fricción de entrada alta,
- o no están pensadas para una primera decisión vocacional comunitaria.

### Contexto actual del proyecto
Voca-IA ya tiene una base funcional:

- Frontend con rutas `"/"`, `"/questions"`, `"/results"`.
- Backend con API por fases:
  - `GET /api/preguntas_generales` (legacy Flask)
  - `POST /api/evaluar_ramas` (legacy Flask)
  - `POST /api/evaluar_carrera` (legacy Flask)
- Lógica de desempate entre ramas y entre carreras.

El principal gap de producto/tecnología hoy es la fragmentación de stack (cliente + servidor separados) y la necesidad de simplificar operación/despliegue para escalar validación temprana de producto.

---

## 3) Objetivos de producto (negocio + usuario)

### Objetivos de negocio
1. Reducir complejidad operativa mediante una única plataforma de despliegue (Vercel).
2. Lanzar v1 estable en menor tiempo para validar adopción real.
3. Posicionar Voca-IA como herramienta comunitaria de orientación vocacional clara y confiable.

### Objetivos de usuario
1. Completar el quiz de forma fluida, sin registro obligatorio.
2. Obtener recomendaciones comprensibles (rama/carreras) en pocos minutos.
3. Entender que el resultado es orientativo y transparente, no una “caja negra”.

---

## 4) Público objetivo (primario/secundario)

### Primario
- Estudiantes de secundaria/preparatoria (15-19) que buscan primera orientación vocacional.

### Secundario
- Docentes, orientadores y familias que acompañan decisiones educativas.
- Comunidad educativa que necesita una herramienta rápida para iniciar conversaciones vocacionales.

---

## 5) Alcance v1 (in-scope / out-of-scope)

### In-scope v1
- Migración del flujo actual a Next.js (App Router) con páginas equivalentes:
  - `/` (home)
  - `/questions`
  - `/results`
- Implementación de API serverless equivalente a la lógica actual:
  - `GET /api/preguntas-generales`,
  - `POST /api/evaluar-ramas`,
  - `POST /api/evaluar-carrera`.
- Conservación de estados de respuesta del usuario en cliente (memoria local durante sesión).
- Mensajería clara de resultado orientativo y explicabilidad básica del proceso.
- Deploy único en Vercel.

### Out-of-scope v1
- **Autenticación (login/registro).**
- **Base de datos obligatoria** para operación principal.
- Historial persistente de resultados por usuario.
- Panel administrativo completo.
- Personalización avanzada por perfil/escuela.
- Integraciones externas (CRM, LMS, WhatsApp, etc.).

---

## 6) Requisitos funcionales (priorizados MoSCoW)

### Must Have
1. El usuario puede iniciar en Home y avanzar al quiz con CTA principal.
2. El sistema presenta preguntas generales por rama y registra respuestas “sí/no”.
3. Al terminar preguntas generales, el sistema evalúa puntajes por rama:
   - si hay una rama ganadora: pasa a preguntas de carrera de esa rama,
   - si hay empate de ramas: activa fase de desempate con preguntas de carreras de ramas empatadas.
4. Al terminar preguntas de carrera, el sistema entrega resultado:
   - carrera única sugerida, o
   - empate de carreras (lista de opciones).
5. La vista de resultados muestra rama sugerida (cuando aplique), lista de carreras y mensaje orientativo.
6. Manejo básico de errores de red/API con mensajes comprensibles.

### Should Have
1. Reinicio del quiz desde resultados.
2. Indicador de progreso visible durante preguntas.
3. Copy de transparencia: “resultado orientativo basado en tus respuestas”.
4. Validación de payload en endpoints serverless para evitar respuestas inválidas.

### Could Have
1. Versión de contenido informativo breve por carrera (descripción corta).
2. Evento analítico básico (inicio, finalización, tipo de resultado).

### Won’t Have (v1)
1. Registro/login.
2. Persistencia obligatoria en DB.
3. Recomendaciones con modelos ML externos.

---

## 7) Requisitos no funcionales

### Performance
- TTI percibido en Home/Questions aceptable en red móvil promedio.
- Respuesta de endpoints de evaluación en latencia baja para mantener continuidad del quiz.
- Evitar cargas innecesarias de datos: solo traer preguntas requeridas por fase.

### Disponibilidad
- Despliegue en Vercel con alta disponibilidad base de plataforma.
- Degradación controlada en caso de error serverless (mensaje claro y opción de reintento).

### Privacidad
- **Sin auth y sin DB obligatoria en v1**: minimiza recolección de datos personales.
- No solicitar datos sensibles para completar el quiz.
- Si se habilitan métricas, usar eventos agregados y no identificables por persona.

### Accesibilidad
- Navegación básica por teclado en botones principales.
- Contraste de texto/botones adecuado en vistas clave.
- Jerarquía semántica mínima de títulos y contenido.

### SEO básico
- Home indexable con metadata esencial (title/description).
- Mensaje claro de propósito comunitario de orientación vocacional.
- Resultados pueden permanecer no indexables si dependen de estado efímero de sesión.

---

## 8) Métricas de éxito (KPI con meta inicial)

1. **Tasa de inicio del quiz** = usuarios que pasan de Home a Questions / visitas a Home.
   - Meta inicial: **≥ 45%**.

2. **Tasa de finalización del quiz** = usuarios que llegan a Results / usuarios que iniciaron Questions.
   - Meta inicial: **≥ 65%**.

3. **Tiempo medio de completitud** (inicio Questions → Results).
   - Meta inicial: **≤ 6 minutos**.

4. **Error rate de API de evaluación** (4xx/5xx sobre requests a endpoints de evaluación).
   - Meta inicial: **< 2%**.

5. **Porcentaje de sesiones con resultado entregado** (al menos una sugerencia visible).
   - Meta inicial: **≥ 98%**.

---

## 9) Riesgos, supuestos y dependencias

### Riesgos
1. Reglas de evaluación rígidas pueden generar percepción de baja personalización.
2. Sin persistencia, se pierde historial al cerrar sesión/recargar.
3. Cambios de contenido de preguntas requieren redeploy si están en código.

### Supuestos
1. Para v1, valor principal está en orientación inicial rápida, no en tracking longitudinal.
2. El algoritmo actual por puntajes y desempates es suficiente para una primera versión pública.
3. Comunidad valora transparencia del método por encima de complejidad algorítmica.

### Dependencias
1. Migración técnica a Next.js 15+ (routing, renderizado y serverless).
2. Configuración de variables de entorno en Vercel para endpoints internos/externos según implementación.
3. Definición y curaduría mínima del catálogo de preguntas y carreras (contenido fuente).

---

## 10) Criterios de aceptación v1

Se considera v1 aceptada cuando:

1. El flujo **Home → Questions → Results** funciona de extremo a extremo en producción Vercel.
2. Existen endpoints serverless equivalentes a:
   - `GET /api/preguntas-generales`,
   - `POST /api/evaluar-ramas`,
   - `POST /api/evaluar-carrera`,
   con respuestas consistentes con la lógica actual de fases.
3. Se cubren los tres escenarios de salida:
   - rama elegida,
   - empate de ramas con desempate,
   - empate de carreras / resultado final.
4. Mensajes de error y estados vacíos no bloquean irreversiblemente el flujo.
5. El producto comunica explícitamente que:
   - no reemplaza orientación profesional formal,
   - el resultado es orientativo,
   - no requiere login ni base de datos obligatoria en v1.

---

## 11) Roadmap corto (MVP, post-MVP)

### MVP (v1)
- Migrar frontend actual a Next.js manteniendo UX principal.
- Portar lógica Flask de evaluación a funciones serverless.
- Publicar en Vercel con monitoreo básico de errores y KPIs mínimos.
- Validar uso real con comunidad educativa inicial.

### Post-MVP (v1.x / v2)
- Instrumentación analítica más robusta para optimizar abandono por fase.
- Gestión de contenido de preguntas sin redeploy (opcional: JSON remoto o CMS liviano).
- Exportación/compartido de resultado.
- Evaluar persistencia opcional (no obligatoria) para historial y seguimiento.
- Evaluar autenticación solo si habilita un caso de uso claro (seguimiento longitudinal, orientación guiada por tutor).

---

## Decisiones concretas y accionables

1. Mantener algoritmo de puntajes y desempates en v1 para evitar deriva funcional.
2. Consolidar FE+API en Next.js + Vercel para bajar fricción de operación.
3. Operar sin auth y sin DB obligatoria en v1 para acelerar salida y reducir riesgos de privacidad.
4. Priorizar claridad comunitaria: resultados explicados, lenguaje orientativo y expectativas realistas.
5. Medir conversión y finalización desde el día 1 para decidir evolución post-MVP con evidencia.
