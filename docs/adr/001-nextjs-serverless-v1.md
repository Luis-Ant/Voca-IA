# ADR 001: Reescritura a Next.js App Router + Route Handlers Serverless en Vercel

## Estado
Accepted

## Fecha
2026-04-22

## Contexto
Voca-IA necesitaba consolidar frontend y backend en una arquitectura simple de operar y desplegar. La base anterior con separación de frontend (Vite) y backend (Flask) introducía fricción operativa: CORS, despliegues desacoplados, doble observabilidad y mayor superficie de configuración en ambientes.

Para v1, el objetivo principal es entregar valor rápido con una plataforma mantenible, con bajo costo operativo y sin imponer una base de datos como prerequisito. El alcance funcional inicial puede operar con servicios externos y/o almacenamiento efímero según caso de uso.

## Decisión
Se adopta una reescritura directa a **Next.js con App Router** y **Route Handlers serverless** desplegados en **Vercel** como arquitectura principal de v1.

Esta decisión implica:
- Unificar UI y API en un mismo repositorio y runtime de despliegue.
- Implementar endpoints backend en Route Handlers (`app/api/**/route.ts`) serverless.
- Estandarizar rutas API canónicas en **kebab-case** (`/api/preguntas-generales`, `/api/evaluar-ramas`, `/api/evaluar-carrera`).
- Mantener la **lógica de dominio desacoplada del transporte HTTP** (casos de uso y servicios de dominio independientes de `Request`/`Response`).
- No requerir base de datos obligatoria en v1; la persistencia se define por necesidad funcional puntual.

## Alternativas consideradas
1. **Mantener Vite + Flask**  
   Se descarta porque mantiene dos stacks operativos, configuración de CORS entre orígenes y pipelines de despliegue separados.

2. **Vite + Vercel Functions**  
   Se descarta porque reduce parte de la operación, pero conserva la fragmentación entre frontend y backend, además de límites de consistencia arquitectónica entre proyectos.

3. **Next.js full static (sin Route Handlers)**  
   Se descarta porque no cubre necesidades de lógica server-side para integraciones y orquestación de requests en v1.

## Consecuencias positivas
- Se elimina la fricción de CORS al unificar frontend y API bajo el mismo dominio/plataforma.
- Se simplifica el deploy en Vercel con un único pipeline y configuración centralizada.
- Se reduce el overhead operativo (menos servicios, menos observabilidad distribuida, menos puntos de falla).
- Se acelera la entrega de funcionalidades al compartir tipado, utilidades y convenciones en un solo codebase.

## Consecuencias negativas / trade-offs
- Mayor acoplamiento estratégico al ecosistema Next.js/Vercel.
- Restricciones del modelo serverless (cold starts, límites de ejecución y de entorno).
- Necesidad de disciplina arquitectónica para evitar mezclar dominio con capa HTTP en Route Handlers.

## Plan de mitigación
- Diseñar la aplicación con capas explícitas: `domain`/`application` separadas de `infrastructure/http`.
- Definir contratos de puertos/adaptadores para aislar proveedores externos y facilitar migración futura.
- Monitorear latencia, errores y tiempos de arranque en funciones serverless con alertas tempranas.
- Documentar guías de implementación para Route Handlers que prohíban lógica de negocio en handlers.

## Revisión futura (triggers para reevaluar)
Esta decisión se reevaluará si ocurre cualquiera de estos triggers:
- Requisito de procesamiento de larga duración incompatible con límites serverless.
- Necesidad sostenida de workloads stateful que justifiquen infraestructura dedicada.
- Incremento de costo/latencia en Vercel por encima de umbrales definidos por producto.
- Exigencias de compliance o residencia de datos que requieran control infra más estricto.
