# Release humano final — Voca-IA

Estado global vigente: `docs/migration-master-plan.md`.

Estado de esta fase: **listo para validación humana en Vercel**.

## 1. Qué está listo hoy

- Fases 1-5 implementadas y separadas en PRs por trazabilidad.
- Validación local requerida ejecutable:
  - `npm test`
  - `npm run test:smoke`
  - `npx tsc --noEmit`
- Documentación operativa lista para preview, producción y merge final.

## 2. PRs y trazabilidad

Cada fase debe tener PR propia y issue aprobado.

1. Fase 1: core Next.
2. Fase 2: limpieza legacy.
3. Fase 3: hardening + smoke tests.
4. Fase 4: preparación Vercel.
5. Fase 5: release/planning final.

Usar `docs/pr-comment-phase5.md` como resumen para la última PR.

## 3. Release exacto: preview -> prod -> merge

### A. Antes de validar preview

- [ ] `npm test` verde.
- [ ] `npm run test:smoke` verde.
- [ ] `npx tsc --noEmit` verde.
- [ ] PRs de fases previas mergeadas.

### B. Preview

- [ ] PR creada o actualizada para la fase vigente.
- [ ] Preview de Vercel generada para la rama correcta.
- [ ] URL de preview visible en la PR.

### C. Validación manual en preview

Usar `tests/smoke/flujo-migracion.smoke.md`.

- [ ] `/` carga y CTA navega a `/questions`.
- [ ] `/questions` carga preguntas generales.
- [ ] Ruta feliz termina en `/results`.
- [ ] `/results` directo muestra fallback usable.
- [ ] Caso `empate_ramas_desempate` funciona.
- [ ] Caso `empate_carrera` funciona.
- [ ] Errores visibles siguen claros.
- [ ] APIs críticas responden:
  - [ ] `GET /api/preguntas-generales`
  - [ ] `POST /api/evaluar-ramas`
  - [ ] `POST /api/evaluar-carrera`

### D. Go / No-Go para producción

**GO** si se cumple todo:

- [ ] Tests locales en verde.
- [ ] Smoke manual completo en preview.
- [ ] Sin errores bloqueantes en preview.
- [ ] PR con contexto claro para reviewer.

**NO-GO** si pasa algo de esto:

- [ ] Smoke manual incompleto.
- [ ] Ruta feliz rota.
- [ ] Fallback de `/results` roto.
- [ ] APIs críticas fallando.
- [ ] Empates o errores visibles con regresión.

### E. Paso a producción

- [ ] Promover preview validada a prod en Vercel.
- [ ] Confirmar URL final correcta.
- [ ] Repetir smoke manual en prod.

### F. Merge final

Hacer merge recién si:

- [ ] Preview validada.
- [ ] Producción validada.
- [ ] Sin rollback en curso.
- [ ] Reviewer dio ok.

Orden recomendado:

1. PR.
2. Preview.
3. Validación preview.
4. Promote a prod.
5. Validación prod.
6. Merge.

## 4. Validación manual exacta en preview y prod

Checklist mínimo:

1. Entrar a `/`.
2. Ir a `/questions` desde CTA.
3. Completar flujo feliz hasta `/results`.
4. Abrir `/results` sin estado y validar fallback.
5. Reproducir empate de ramas.
6. Reproducir empate de carrera.
7. Validar mensajes de error visibles.
8. Validar respuesta de APIs críticas.

Si preview pasa, repetir igual en prod.

## 5. Si smoke falla

### Si falla en preview

1. **No promover a prod**.
2. Dejar comentario en PR con falla exacta.
3. Corregir en rama.
4. Revalidar local.
5. Generar nueva preview.

### Si falla en prod

1. **No mergear** si todavía no se mergeó.
2. Hacer rollback al deployment estable anterior.
3. Repetir smoke mínimo para confirmar rollback sano.
4. Documentar falla y causa probable.
5. Recién después reintentar release.

## 6. Criterio de salida de esta fase

Esta fase termina bien cuando:

- preview quede validada,
- prod quede validada,
- y la PR quede lista para merge sin dudas operativas.
