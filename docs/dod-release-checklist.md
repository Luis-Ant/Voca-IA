# Voca-IA MVP (Next.js) — Definition of Done + Release Checklist

> Documento operativo para cierre de tareas/hitos del MVP migrado a Next.js.

## 1) Definition of Done (producto)

- [ ] El flujo vocacional completo funciona de punta a punta en producción:
  - [ ] Inicio en `/` (landing) con CTA funcional hacia `/questions`.
  - [ ] Cuestionario en `/questions` carga preguntas y permite responder Sí/No.
  - [ ] Resultado en `/results` muestra recomendación final o empate.
- [ ] Estados funcionales del motor vocacional validados:
  - [ ] `rama_elegida` (pasa a preguntas específicas de rama).
  - [ ] `empate_ramas_desempate` (activa preguntas de desempate entre ramas).
  - [ ] `resultado_final` (una carrera ganadora).
  - [ ] `empate_carrera` (múltiples carreras empatadas).
- [ ] Manejo de errores visible y entendible para usuario:
  - [ ] Error al cargar preguntas generales.
  - [ ] Error al evaluar ramas.
  - [ ] Error al evaluar carrera.
  - [ ] Acceso directo a `/results` sin estado muestra fallback y CTA de reinicio.
- [ ] Copys críticos revisados (sin mensajes ambiguos, sin placeholders de prueba).
- [ ] No hay regresiones funcionales respecto del alcance MVP aprobado.

## 2) Definition of Done (ingeniería)

- [ ] Rutas migradas a Next.js y consistentes con el flujo esperado (`/`, `/questions`, `/results`).
- [ ] Integración API operativa con endpoints esperados:
  - [ ] `GET /api/preguntas-generales`
  - [ ] `POST /api/evaluar-ramas`
  - [ ] `POST /api/evaluar-carrera`
- [ ] Estados y contratos de respuesta controlados en frontend (sin asumir respuestas “felices” únicamente).
- [ ] Manejo de errores HTTP y de red implementado (mensajes y fallback de UI).
- [ ] Variables de entorno definidas y documentadas (`.env`/Vercel Environment Variables).
- [ ] Lint/tests del alcance modificado en verde.
- [ ] Documentación mínima actualizada:
  - [ ] README o docs de operación del flujo.
  - [ ] ADR actualizado si hubo decisión técnica relevante (routing, estado, integración API, despliegue).
  - [ ] PRD actualizado si cambió alcance funcional/UX del MVP.

## 3) Checklist pre-merge

- [ ] Cambios acotados al objetivo del PR (sin “scope creep”).
- [ ] Review técnico aprobado (mínimo 1 reviewer).
- [ ] Conflictos de merge resueltos.
- [ ] Checklist funcional completado con evidencia (ver sección 7).
- [ ] Casos críticos verificados manualmente:
  - [ ] Ruta feliz: preguntas generales → rama específica/desempate → resultado.
  - [ ] Caso empate de ramas (`empate_ramas_desempate`).
  - [ ] Caso empate de carrera (`empate_carrera`).
  - [ ] Recuperación ante error de API/red.
- [ ] No se agregaron pasos fuera del flujo normal de release.

## 4) Checklist pre-deploy Vercel

- [ ] Proyecto/branch correcto seleccionado para deploy.
- [ ] Variables de entorno en Vercel validadas (nombres, valores, ambiente).
- [ ] Dominio/alias objetivo confirmado.
- [ ] Configuración de runtime y región verificada si aplica.
- [ ] Deploy Preview validado funcionalmente sobre los 4 estados vocacionales.
- [ ] Sin errores bloqueantes en logs de build/deploy de Vercel.

## 5) Checklist post-deploy

- [ ] Smoke test productivo en URL final:
  - [ ] `/` carga y navega.
  - [ ] `/questions` responde e invoca APIs correctamente.
  - [ ] `/results` muestra estado esperado y fallback en acceso inválido.
- [ ] Monitoreo inicial (15–30 min) sin errores críticos (5xx, timeouts, fallos de red).
- [ ] Verificación de métricas mínimas (error rate, tiempo de respuesta, éxito de flujo).
- [ ] Confirmación de negocio/producto de que el MVP quedó “usable”.

## 6) Criterios de rollback

Aplicar rollback si ocurre cualquiera de estos eventos en producción:

- [ ] No se puede completar el flujo vocacional end-to-end.
- [ ] Fallan sistemáticamente endpoints críticos (`/api/preguntas-generales`, `/api/evaluar-ramas`, `/api/evaluar-carrera`).
- [ ] Error rate crítico sostenido o UX rota (pantallas en blanco, navegación bloqueada).
- [ ] Datos/estado inconsistente que altera recomendaciones de carrera.

Acción de rollback:

- [ ] Revertir al deployment estable anterior en Vercel.
- [ ] Comunicar incidente y alcance (producto + ingeniería).
- [ ] Abrir ticket post-mortem con causa raíz y plan de corrección antes de reintentar release.

## 7) Evidencias mínimas requeridas para cerrar una tarea/hito

- [ ] Link a PR mergeado + descripción de alcance.
- [ ] Capturas o video corto de:
  - [ ] Ruta feliz.
  - [ ] Empate de ramas.
  - [ ] Empate de carrera.
  - [ ] Manejo de error/fallback.
- [ ] Evidencia de validación técnica:
  - [ ] Resultado de lint/tests relevantes.
  - [ ] Logs o capturas de Deploy Preview y producción (sin errores críticos).
- [ ] Evidencia documental:
  - [ ] README/docs actualizados.
  - [ ] ADR actualizado (si hubo cambio de decisión técnica).
  - [ ] PRD actualizado (si cambió alcance funcional).
- [ ] Criterio de aceptación de producto explícitamente marcado como cumplido.

---

**Regla de oro:** si no hay evidencia verificable, la tarea NO está Done.
