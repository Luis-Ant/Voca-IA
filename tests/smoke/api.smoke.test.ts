import { describe, expect, it } from "vitest";
import { GET as getPreguntasGenerales } from "../../app/api/preguntas-generales/route";
import { POST as postEvaluarRamas } from "../../app/api/evaluar-ramas/route";
import { POST as postEvaluarCarrera } from "../../app/api/evaluar-carrera/route";

function createPostRequest(url: string, body: unknown) {
  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("Smoke API", () => {
  it("GET /api/preguntas-generales responde 200 y shape base", async () => {
    const response = await getPreguntasGenerales();
    const body = (await response.json()) as Record<string, unknown>;

    expect(response.status).toBe(200);
    expect(body).toBeTypeOf("object");

    const ramas = Object.keys(body);
    expect(ramas.length).toBeGreaterThan(0);
    const primeraRama = body[ramas[0]];
    expect(Array.isArray(primeraRama)).toBe(true);
  });

  it("POST /api/evaluar-ramas válido", async () => {
    const payload = {
      "Ingeniería y Ciencias Físico Matemáticas_0": "sí",
    };

    const response = await postEvaluarRamas(createPostRequest("http://localhost/api/evaluar-ramas", payload));
    const body = (await response.json()) as { status?: string; error?: string };

    expect(response.status).toBe(200);
    expect(body.error).toBeUndefined();
    expect(body.status).toBeTruthy();
  });

  it("POST /api/evaluar-ramas inválido", async () => {
    const response = await postEvaluarRamas(createPostRequest("http://localhost/api/evaluar-ramas", {}));
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(400);
    expect(typeof body.error).toBe("string");
  });

  it("POST /api/evaluar-carrera válido", async () => {
    const payload = {
      rama: "Ingeniería y Ciencias Físico Matemáticas",
      respuestas: {
        "Ingeniería en Sistemas Computacionales_0": "sí",
      },
    };

    const response = await postEvaluarCarrera(createPostRequest("http://localhost/api/evaluar-carrera", payload));
    const body = (await response.json()) as { status?: string; error?: string };

    expect(response.status).toBe(200);
    expect(body.error).toBeUndefined();
    expect(body.status).toBeTruthy();
  });

  it("POST /api/evaluar-carrera sin contexto", async () => {
    const payload = {
      respuestas: {
        "Ingeniería en Sistemas Computacionales_0": "sí",
      },
    };

    const response = await postEvaluarCarrera(createPostRequest("http://localhost/api/evaluar-carrera", payload));
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(400);
    expect(body.error).toBe("No se proporcionó contexto de rama o desempate válido");
  });
});
