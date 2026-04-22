import type { CarrerasPorRama, EvaluarCarrerasResultado, RespuestasPorId } from "../types";

type Input = {
  rama?: string;
  ramasDesempate?: string[];
  respuestas: RespuestasPorId;
  ramasCatalogo: CarrerasPorRama;
};

export function evaluarCarreras({ rama, ramasDesempate = [], respuestas, ramasCatalogo }: Input): EvaluarCarrerasResultado {
  const carrerasAEvaluar: Record<string, string[]> = {};

  if (rama && ramasCatalogo[rama]) {
    Object.assign(carrerasAEvaluar, ramasCatalogo[rama].carreras);
  } else if (ramasDesempate.length > 0) {
    ramasDesempate.forEach((ramaActual) => {
      if (ramasCatalogo[ramaActual]) {
        Object.assign(carrerasAEvaluar, ramasCatalogo[ramaActual].carreras);
      }
    });
  }

  if (Object.keys(carrerasAEvaluar).length === 0) {
    return {
      status: "no_carreras_evaluadas",
      message: "No se pudieron evaluar carreras con los datos proporcionados.",
    };
  }

  const puntajes: Record<string, number> = {};

  for (const [carrera, preguntas] of Object.entries(carrerasAEvaluar)) {
    puntajes[carrera] = preguntas.reduce((acc, _, index) => {
      const id = `${carrera}_${index}`;
      return respuestas[id] === "sí" ? acc + 1 : acc;
    }, 0);
  }

  const maxPuntaje = Math.max(...Object.values(puntajes));
  const mejoresCarreras = Object.entries(puntajes)
    .filter(([, valor]) => valor === maxPuntaje)
    .map(([carrera]) => carrera);

  if (mejoresCarreras.length > 1) {
    return {
      status: "empate_carrera",
      rama_sugerida: rama ?? "Múltiples Ramas",
      carreras_sugeridas: mejoresCarreras,
      message:
        "Has mostrado el mismo interés por varias carreras. Te recomendamos investigar más sobre estas opciones para tomar una mejor decisión.",
    };
  }

  const carreraGanadora = mejoresCarreras[0];
  let ramaFinal = rama ?? "Múltiples Ramas";

  if (ramasDesempate.length > 0) {
    for (const ramaActual of ramasDesempate) {
      if (ramasCatalogo[ramaActual]?.carreras[carreraGanadora]) {
        ramaFinal = ramaActual;
        break;
      }
    }
  }

  return {
    status: "resultado_final",
    rama_sugerida: ramaFinal,
    carreras_sugeridas: [carreraGanadora],
    message: "La carrera que más se ajusta a tus intereses es:",
  };
}
