import { describe, expect, it } from "vitest";
import { evaluarRamas } from "../../src/domain/services/evaluarRamas";
import { preguntasGenerales, ramasCatalogo } from "../../src/infrastructure/catalogo/preguntasCatalogo";

describe("evaluarRamas", () => {
  it("devuelve rama_elegida cuando hay ganadora", () => {
    const respuestas = {
      "Ingeniería y Ciencias Físico Matemáticas_0": "sí",
      "Ingeniería y Ciencias Físico Matemáticas_1": "sí",
      "Ciencias Médico Biológicas_0": "no",
    } as const;

    const result = evaluarRamas({ respuestas, preguntasGenerales, ramasCatalogo });

    expect(result.status).toBe("rama_elegida");
    if (result.status === "rama_elegida") {
      expect(result.rama_sugerida).toBe("Ingeniería y Ciencias Físico Matemáticas");
    }
  });

  it("devuelve empate_ramas_desempate cuando hay empate", () => {
    const respuestas = {
      "Ingeniería y Ciencias Físico Matemáticas_0": "sí",
      "Ciencias Médico Biológicas_0": "sí",
      "Ciencias Sociales y Administrativas_0": "no",
    } as const;

    const result = evaluarRamas({ respuestas, preguntasGenerales, ramasCatalogo });

    expect(result.status).toBe("empate_ramas_desempate");
    if (result.status === "empate_ramas_desempate") {
      expect(result.ramas_sugeridas.length).toBeGreaterThan(1);
    }
  });
});
