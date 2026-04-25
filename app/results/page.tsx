"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Resultado = {
  status: "resultado_final" | "empate_carrera" | "no_carreras_evaluadas";
  rama_sugerida?: string;
  carreras_sugeridas?: string[];
  message: string;
};

export default function ResultsPage() {
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [error, setError] = useState<string | null>(null);

  function isResultado(value: unknown): value is Resultado {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Partial<Resultado>;
    const statusValido =
      candidate.status === "resultado_final" ||
      candidate.status === "empate_carrera" ||
      candidate.status === "no_carreras_evaluadas";
    return statusValido && typeof candidate.message === "string";
  }

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("voca-ia-resultado");
      if (!raw) return;

      const parsed = JSON.parse(raw) as unknown;
      if (!isResultado(parsed)) {
        sessionStorage.removeItem("voca-ia-resultado");
        setError("Resultado inválido. Hacé el quiz de nuevo.");
        return;
      }

      setResultado(parsed);
    } catch {
      sessionStorage.removeItem("voca-ia-resultado");
      setError("Resultado corrupto. Hacé el quiz de nuevo.");
    }
  }, []);

  if (!resultado) {
    return (
      <main>
        <h1>Results</h1>
        <p className="error">{error ?? "No hay resultado. Hacé el quiz primero."}</p>
        <div className="row">
          <Link href="/questions" className="btn">
            Reintentar quiz
          </Link>
          <Link href="/" className="btn secondary">
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <h1>Results</h1>
      <p className="muted">Estado: {resultado.status}</p>

      <div className="card">
        <p>{resultado.message}</p>
        {resultado.rama_sugerida ? <p>Rama sugerida: {resultado.rama_sugerida}</p> : null}
        {resultado.carreras_sugeridas?.length ? (
          <ul>
            {resultado.carreras_sugeridas.map((carrera) => (
              <li key={carrera}>{carrera}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="row">
        <Link href="/" className="btn">
          Reiniciar
        </Link>
      </div>
    </main>
  );
}
