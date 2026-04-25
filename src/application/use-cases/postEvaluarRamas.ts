import type { PostEvaluarRamasRequest, PostEvaluarRamasResponse } from "../contracts";
import { evaluarRamas } from "../../domain/services/evaluarRamas";
import { preguntasGenerales, ramasCatalogo } from "../../infrastructure/catalogo/preguntasCatalogo";

export function postEvaluarRamas(payload: PostEvaluarRamasRequest): PostEvaluarRamasResponse {
  return evaluarRamas({
    respuestas: payload,
    preguntasGenerales,
    ramasCatalogo,
  });
}
