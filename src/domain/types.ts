import type { CarreraNombre } from "./entities/carrera";
import type { PreguntaTexto } from "./entities/pregunta";
import type { RamaNombre } from "./entities/rama";

export type RespuestaQuiz = "sí" | "no";

export type PreguntasGenerales = Record<RamaNombre, PreguntaTexto[]>;

export type CarrerasPorRama = Record<RamaNombre, { carreras: Record<CarreraNombre, PreguntaTexto[]> }>;

export type RespuestasPorId = Record<string, RespuestaQuiz>;

export type EvaluarRamasResultado =
  | {
      status: "rama_elegida";
      rama_sugerida: RamaNombre;
      preguntas_carreras: Record<CarreraNombre, PreguntaTexto[]>;
    }
  | {
      status: "empate_ramas_desempate";
      ramas_sugeridas: RamaNombre[];
      message: string;
      preguntas_para_desempate: Record<RamaNombre, Record<CarreraNombre, PreguntaTexto[]>>;
    };

export type EvaluarCarrerasResultado =
  | {
      status: "resultado_final";
      rama_sugerida: RamaNombre;
      carreras_sugeridas: CarreraNombre[];
      message: string;
    }
  | {
      status: "empate_carrera";
      rama_sugerida: RamaNombre | "Múltiples Ramas";
      carreras_sugeridas: CarreraNombre[];
      message: string;
    }
  | {
      status: "no_carreras_evaluadas";
      message: string;
    };
