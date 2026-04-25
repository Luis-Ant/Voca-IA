# Release humano final — Voca-IA

Estado de esta fase: **listo para release humano**.

Bloqueante actual: **falta push de la rama local por bloqueo SSH**.

## 1. Qué está listo hoy

- Fases 1-5 implementadas localmente.
- Validación local requerida ejecutable:
  - `npm test`
  - `npm run test:smoke`
  - `npx tsc --noEmit`
- Documentación operativa lista para hacer release apenas se destrabe el push.

## 2. Push pendiente

Hacer esto apenas vuelva el acceso SSH:

1. Verificar rama actual correcta.
2. Verificar cambios esperados con `git status`.
3. Pushear la rama local pendiente al remoto.
4. Confirmar que el commit local de Fase 4 y los cambios de Fase 5 quedaron en remoto.
5. Abrir o actualizar la PR.
6. Publicar comentario de estado usando `docs/pr-comment-phase5.md`.

## 3. Release exacto: preview -> prod -> merge

### A. Antes del push

- [ ] `npm test` verde.
- [ ] `npm run test:smoke` verde.
- [ ] `npx tsc --noEmit` verde.
- [ ] Sin cambios locales inesperados.

### B. Después del push

- [ ] PR creada o actualizada.
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

1. Push.
2. PR.
3. Preview.
4. Validación preview.
5. Promote a prod.
6. Validación prod.
7. Merge.

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

- rama pueda pushearse,
- preview quede validada,
- prod quede validada,
- y la PR quede lista para merge sin dudas operativas.
