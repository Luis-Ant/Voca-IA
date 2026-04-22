import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Voca-IA</h1>
      <p className="muted">Home → Questions → Results migrado a Next App Router.</p>

      <div className="card">
        <h2>Encontrá tu carrera ideal</h2>
        <p>Flujo v1 sin DB ni auth. API interna serverless en /api/*.</p>
        <Link href="/questions" className="btn">
          Empezar quiz
        </Link>
      </div>
    </main>
  );
}
