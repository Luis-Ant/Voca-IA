import type { PostEvaluarCarreraRequest, PostEvaluarCarreraResponse } from "../contracts";
import { evaluarCarreras } from "../../domain/services/evaluarCarreras";
import { ramasCatalogo } from "../../infrastructure/catalogo/preguntasCatalogo";

export function postEvaluarCarrera(payload: PostEvaluarCarreraRequest): PostEvaluarCarreraResponse {
  return evaluarCarreras({
    rama: payload.rama,
    ramasDesempate: payload.ramas_desempate,
    respuestas: payload.respuestas,
    ramasCatalogo,
  });
}
