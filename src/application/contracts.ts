import type { EvaluarCarrerasResultado, EvaluarRamasResultado, PreguntasGenerales, RespuestasPorId } from "../domain/types";

export type GetPreguntasGeneralesResponse = PreguntasGenerales;

export type PostEvaluarRamasRequest = RespuestasPorId;
export type PostEvaluarRamasResponse = EvaluarRamasResultado;

export type PostEvaluarCarreraRequest = {
  rama?: string;
  ramas_desempate?: string[];
  respuestas: RespuestasPorId;
};

export type PostEvaluarCarreraResponse = EvaluarCarrerasResultado;
