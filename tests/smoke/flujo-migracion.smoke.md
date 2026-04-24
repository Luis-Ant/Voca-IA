# Smoke checklist migración Next (manual post-deploy)

Usar este checklist sobre **Preview** y luego sobre **Producción**.

## 1. Homepage

- [ ] Entrar a `/`.
- [ ] Verificar que la página renderiza sin error visual.
- [ ] Verificar presencia del CTA principal.
- [ ] Hacer click en **Empezar quiz**.
- [ ] Confirmar navegación correcta a `/questions`.

## 2. Questions — ruta feliz

- [ ] Confirmar que `/questions` carga preguntas generales.
- [ ] Responder todas las preguntas generales con valores válidos.
- [ ] Confirmar que el flujo avanza sin pantallas en blanco.
- [ ] Si sale `rama_elegida`, completar preguntas de carrera.
- [ ] Confirmar llegada a `/results`.
- [ ] Verificar que existe recomendación final visible (`resultado_final`) o fallback coherente si no hubo carreras evaluadas.

## 3. Results fallback

- [ ] Abrir `/results` directo en una pestaña nueva o refrescar sin estado válido.
- [ ] Confirmar que aparece fallback entendible.
- [ ] Confirmar que existe CTA para reiniciar o volver al flujo.
- [ ] Confirmar que no rompe la app ni deja pantalla vacía.

## 4. Empate de ramas / empate de carrera

- [ ] Forzar o reproducir un caso de `empate_ramas_desempate`.
- [ ] Confirmar que el mensaje de empate se entiende.
- [ ] Confirmar que aparecen preguntas para desempate.
- [ ] Completar desempate y seguir flujo.
- [ ] Validar un caso final con `empate_carrera`.
- [ ] Confirmar que `/results` muestra el empate de forma clara.

## 5. Errores visibles

- [ ] Verificar que si falla carga de preguntas generales hay mensaje entendible.
- [ ] Verificar que si falla evaluación de ramas hay mensaje entendible.
- [ ] Verificar que si falla evaluación de carrera hay mensaje entendible.
- [ ] Confirmar que ningún error deja navegación bloqueada sin salida.

## 6. APIs críticas

- [ ] `GET /api/preguntas-generales` responde.
- [ ] `POST /api/evaluar-ramas` responde.
- [ ] `POST /api/evaluar-carrera` responde.

## 7. Cierre

- [ ] Smoke manual completo en Preview.
- [ ] Smoke manual completo en Producción.
- [ ] Si algo falla, rollback al deployment estable anterior.
