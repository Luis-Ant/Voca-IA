import { z } from "zod";

const respuestaSchema = z.enum(["sí", "no"]);
const respuestaIdSchema = z.string().regex(/^.+_\d+$/u, "ID inválido: usar <nombre>_<indice>");

export const evaluarRamasRequestSchema = z
  .record(respuestaIdSchema, respuestaSchema)
  .refine((value) => Object.keys(value).length > 0, { message: "No se recibieron datos" });

const respuestasCarreraSchema = z
  .record(respuestaIdSchema, respuestaSchema)
  .refine((value) => Object.keys(value).length > 0, { message: "No se recibieron datos" });

export const evaluarCarreraRequestSchema = z.object({
  rama: z.string().min(1).optional(),
  ramas_desempate: z.array(z.string().min(1)).optional(),
  respuestas: respuestasCarreraSchema,
});

export type EvaluarRamasRequest = z.infer<typeof evaluarRamasRequestSchema>;
export type EvaluarCarreraRequest = z.infer<typeof evaluarCarreraRequestSchema>;
