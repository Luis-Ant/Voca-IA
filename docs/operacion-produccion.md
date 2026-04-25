# Operación producción v1 — Voca-IA

Documento corto para deploy y rollback en **Vercel**.

## 1. Prerequisitos

- Repo conectado a Vercel.
- Rama lista para promotion.
- Validaciones locales en verde:

```bash
npm test
npm run test:smoke
npx tsc --noEmit
```

- Confirmado: **v1 no usa DB ni auth**.

## 2. Deploy en Vercel

1. Abrir proyecto en Vercel.
2. Verificar branch y commit correctos.
3. Confirmar detección automática de **Next.js**.
4. Confirmar que no haya env vars nuevas requeridas para v1.
5. Lanzar deploy preview.
6. Ejecutar checklist manual de `tests/smoke/flujo-migracion.smoke.md` sobre la preview.
7. Si todo da bien, promover a producción.

## 3. Qué validar post deploy

- Home `/` renderiza bien y CTA navega a `/questions`.
- `/questions` carga preguntas generales.
- Flujo normal termina en `/results` con resultado final.
- Acceso directo a `/results` muestra fallback usable.
- Caso de empate sigue visible y entendible.
- Casos de error siguen mostrando mensaje claro.
- Endpoints críticos responden:
  - `GET /api/preguntas-generales`
  - `POST /api/evaluar-ramas`
  - `POST /api/evaluar-carrera`

## 4. Rollback básico

Aplicar rollback si el flujo no termina, hay errores críticos repetidos o la UX queda rota.

1. Ir a **Vercel → Deployments**.
2. Elegir último deployment estable.
3. Promover ese deployment o redeployar el commit estable.
4. Repetir smoke manual mínimo en producción.
5. Registrar incidente y causa probable antes de redeploy nuevo.

## 5. Notas operativas

- No usar `npm run build` como validación manual de esta fase.
- No agregar `vercel.json` salvo necesidad real futura.
- Headers básicos de seguridad quedan centralizados en `next.config.ts`.
