import { describe, expect, it } from "vitest";
import { evaluarCarreras } from "../../src/domain/services/evaluarCarreras";
import { ramasCatalogo } from "../../src/infrastructure/catalogo/preguntasCatalogo";

describe("evaluarCarreras", () => {
  it("devuelve resultado_final para una carrera ganadora", () => {
    const result = evaluarCarreras({
      rama: "Ingeniería y Ciencias Físico Matemáticas",
      respuestas: {
        "Ingeniería en Sistemas Computacionales_0": "sí",
        "Ingeniería en Sistemas Computacionales_1": "sí",
        "Ingeniería en Sistemas Computacionales_2": "sí",
      },
      ramasCatalogo,
    });

    expect(result.status).toBe("resultado_final");
  });

  it("devuelve empate_carrera cuando hay varias carreras con mismo puntaje", () => {
    const result = evaluarCarreras({
      rama: "Ingeniería y Ciencias Físico Matemáticas",
      respuestas: {
        "Ingeniería en Sistemas Computacionales_0": "sí",
        "Ingeniería Industrial_0": "sí",
      },
      ramasCatalogo,
    });

    expect(result.status).toBe("empate_carrera");
  });

  it("devuelve no_carreras_evaluadas sin contexto válido", () => {
    const result = evaluarCarreras({
      rama: "Rama inventada",
      respuestas: {
        "X_0": "sí",
      },
      ramasCatalogo,
    });

    expect(result.status).toBe("no_carreras_evaluadas");
  });
});
