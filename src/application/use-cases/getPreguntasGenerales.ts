import type { GetPreguntasGeneralesResponse } from "../contracts";
import { preguntasGenerales } from "../../infrastructure/catalogo/preguntasCatalogo";

export function getPreguntasGenerales(): GetPreguntasGeneralesResponse {
  return preguntasGenerales;
}
