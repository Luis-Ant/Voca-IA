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

  useEffect(() => {
    const raw = sessionStorage.getItem("voca-ia-resultado");
    if (!raw) return;
    setResultado(JSON.parse(raw) as Resultado);
  }, []);

  if (!resultado) {
    return (
      <main>
        <h1>Results</h1>
        <p className="error">No hay resultado. Hacé el quiz primero.</p>
        <Link href="/" className="btn">
          Volver al inicio
        </Link>
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
