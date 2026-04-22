"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Respuesta = "sí" | "no";

type Pregunta = {
  id: string;
  texto: string;
};

type ResultadoRamas =
  | {
      status: "rama_elegida";
      rama_sugerida: string;
      preguntas_carreras: Record<string, string[]>;
    }
  | {
      status: "empate_ramas_desempate";
      ramas_sugeridas: string[];
      preguntas_para_desempate: Record<string, Record<string, string[]>>;
    };

type ResultadoFinal = {
  status: "resultado_final" | "empate_carrera" | "no_carreras_evaluadas";
  rama_sugerida?: string;
  carreras_sugeridas?: string[];
  message: string;
};

function flattenGenerales(data: Record<string, string[]>): Pregunta[] {
  const items: Pregunta[] = [];
  Object.entries(data).forEach(([rama, preguntas]) => {
    preguntas.forEach((texto, index) => {
      items.push({ id: `${rama}_${index}`, texto });
    });
  });
  return items;
}

function flattenCarreras(data: Record<string, string[]> | Record<string, Record<string, string[]>>): Pregunta[] {
  const items: Pregunta[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      value.forEach((texto, index) => {
        items.push({ id: `${key}_${index}`, texto });
      });
      continue;
    }

    Object.entries(value).forEach(([carrera, preguntasRaw]) => {
      if (!Array.isArray(preguntasRaw)) return;
      preguntasRaw.forEach((texto, index) => {
        items.push({ id: `${carrera}_${index}`, texto });
      });
    });
  }

  return items;
}

export default function QuestionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fase, setFase] = useState<"general" | "rama_specific" | "tie_breaking">("general");
  const [indice, setIndice] = useState(0);
  const [preguntasGenerales, setPreguntasGenerales] = useState<Pregunta[]>([]);
  const [preguntasCarrera, setPreguntasCarrera] = useState<Pregunta[]>([]);
  const [respuestas, setRespuestas] = useState<Record<string, Respuesta>>({});
  const [ramaSeleccionada, setRamaSeleccionada] = useState<string | null>(null);
  const [ramasEmpatadas, setRamasEmpatadas] = useState<string[]>([]);

  async function readJsonSafe<T>(res: Response): Promise<T | null> {
    try {
      return (await res.json()) as T;
    } catch {
      return null;
    }
  }

  async function cargarPreguntas() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/preguntas-generales");
      const data = await readJsonSafe<Record<string, string[]>>(res);

      if (!res.ok || !data) {
        setError("No se pudieron cargar las preguntas. Probá reintentar.");
        return;
      }

      setPreguntasGenerales(flattenGenerales(data));
    } catch {
      setError("No se pudieron cargar las preguntas. Probá reintentar.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void cargarPreguntas();
  }, []);

  const listaActual = fase === "general" ? preguntasGenerales : preguntasCarrera;

  const actual = listaActual[indice];

  async function evaluarRamas() {
    const payload: Record<string, Respuesta> = {};
    preguntasGenerales.forEach((pregunta) => {
      const valor = respuestas[pregunta.id];
      if (valor) payload[pregunta.id] = valor;
    });

    const res = await fetch("/api/evaluar-ramas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await readJsonSafe<ResultadoRamas | { error: string }>(res);

    if (!data) {
      setError("Respuesta inválida evaluando ramas. Probá reintentar.");
      return;
    }

    if (!res.ok || "error" in data) {
      setError("error" in data ? data.error : "Error evaluando ramas. Probá reintentar.");
      return;
    }

    if (data.status === "rama_elegida") {
      setRamaSeleccionada(data.rama_sugerida);
      setPreguntasCarrera(flattenCarreras(data.preguntas_carreras));
      setFase("rama_specific");
      setIndice(0);
      return;
    }

    setRamasEmpatadas(data.ramas_sugeridas);
    setPreguntasCarrera(flattenCarreras(data.preguntas_para_desempate));
    setFase("tie_breaking");
    setIndice(0);
  }

  async function evaluarCarrera() {
    const payload: {
      rama?: string;
      ramas_desempate?: string[];
      respuestas: Record<string, Respuesta>;
    } = { respuestas: {} };

    preguntasCarrera.forEach((pregunta) => {
      const valor = respuestas[pregunta.id];
      if (valor) payload.respuestas[pregunta.id] = valor;
    });

    if (fase === "rama_specific" && ramaSeleccionada) payload.rama = ramaSeleccionada;
    if (fase === "tie_breaking") payload.ramas_desempate = ramasEmpatadas;

    const res = await fetch("/api/evaluar-carrera", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await readJsonSafe<ResultadoFinal | { error: string }>(res);

    if (!data) {
      setError("Respuesta inválida evaluando carrera. Probá reintentar.");
      return;
    }

    if (!res.ok || "error" in data) {
      setError("error" in data ? data.error : "Error evaluando carrera. Probá reintentar.");
      return;
    }

    sessionStorage.setItem("voca-ia-resultado", JSON.stringify(data));
    router.push("/results");
  }

  async function responder(valor: Respuesta) {
    if (!actual) return;

    const updated = { ...respuestas, [actual.id]: valor };
    setRespuestas(updated);

    const ultimo = indice === listaActual.length - 1;

    if (!ultimo) {
      setIndice((prev) => prev + 1);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      if (fase === "general") {
        await evaluarRamas();
      } else {
        await evaluarCarrera();
      }
    } catch {
      setError("Fallo de red.");
    } finally {
      setLoading(false);
    }
  }

  async function reintentar() {
    if (fase === "general" && preguntasGenerales.length === 0) {
      await cargarPreguntas();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      if (fase === "general") {
        await evaluarRamas();
      } else {
        await evaluarCarrera();
      }
    } catch {
      setError("No se pudo reintentar. Volvé al inicio.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main>
        <p>Cargando...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <p className="error">{error}</p>
        <div className="row">
          <button onClick={() => void reintentar()}>Reintentar</button>
          <button className="secondary" onClick={() => router.push("/")}>Volver al inicio</button>
        </div>
      </main>
    );
  }

  if (!actual) {
    return (
      <main>
        <p>No hay preguntas para mostrar.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Questions</h1>
      <p className="muted">
        Fase: {fase} · Pregunta {indice + 1} de {listaActual.length}
      </p>

      <div className="card">
        <p>{actual.texto}</p>
        <div className="row">
          <button onClick={() => void responder("sí")}>Sí</button>
          <button className="secondary" onClick={() => void responder("no")}>No</button>
        </div>
      </div>
    </main>
  );
}
