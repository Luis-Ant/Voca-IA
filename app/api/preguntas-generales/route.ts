import { NextResponse } from "next/server";
import { getPreguntasGenerales } from "../../../src/application/use-cases/getPreguntasGenerales";

export async function GET() {
  return NextResponse.json(getPreguntasGenerales());
}
