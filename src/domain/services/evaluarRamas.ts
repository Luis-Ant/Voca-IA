import type {
  CarrerasPorRama,
  EvaluarRamasResultado,
  PreguntasGenerales,
  RespuestasPorId,
} from "../types";

type Input = {
  respuestas: RespuestasPorId;
  preguntasGenerales: PreguntasGenerales;
  ramasCatalogo: CarrerasPorRama;
};

export function evaluarRamas({ respuestas, preguntasGenerales, ramasCatalogo }: Input): EvaluarRamasResultado {
  const puntajes = Object.keys(preguntasGenerales).reduce<Record<string, number>>((acc, rama) => {
    acc[rama] = 0;
    return acc;
  }, {});

  for (const [rama, preguntas] of Object.entries(preguntasGenerales)) {
    preguntas.forEach((_, index) => {
      const id = `${rama}_${index}`;
      if (respuestas[id] === "sí") puntajes[rama] += 1;
    });
  }

  const maxPuntaje = Math.max(...Object.values(puntajes));
  const ramasConMax = Object.entries(puntajes)
    .filter(([, valor]) => valor === maxPuntaje)
    .map(([rama]) => rama);

  if (ramasConMax.length > 1) {
    const preguntasParaDesempate = ramasConMax.reduce<Record<string, Record<string, string[]>>>((acc, rama) => {
      if (ramasCatalogo[rama]) {
        acc[rama] = ramasCatalogo[rama].carreras;
      }
      return acc;
    }, {});

    return {
      status: "empate_ramas_desempate",
      ramas_sugeridas: ramasConMax,
      message:
        "Mostraste el mismo nivel de interés por varias áreas. Por favor, responde las siguientes preguntas para afinar la sugerencia.",
      preguntas_para_desempate: preguntasParaDesempate,
    };
  }

  const ramaElegida = ramasConMax[0];

  return {
    status: "rama_elegida",
    rama_sugerida: ramaElegida,
    preguntas_carreras: ramasCatalogo[ramaElegida].carreras,
  };
}
