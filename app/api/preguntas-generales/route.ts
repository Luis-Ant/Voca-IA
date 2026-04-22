import { NextResponse } from "next/server";
import { getPreguntasGenerales } from "../../../src/application/use-cases/getPreguntasGenerales";

export async function GET() {
  try {
    return NextResponse.json(getPreguntasGenerales());
  } catch {
    return NextResponse.json({ error: "Error interno inesperado" }, { status: 500 });
  }
}
