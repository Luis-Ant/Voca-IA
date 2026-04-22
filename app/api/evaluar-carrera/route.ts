import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { postEvaluarCarrera } from "../../../src/application/use-cases/postEvaluarCarrera";
import { zodErrorToMessage } from "../../../src/infrastructure/http/mappers";
import { evaluarCarreraRequestSchema } from "../../../src/infrastructure/http/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = evaluarCarreraRequestSchema.parse(body);

    const hasRama = Boolean(payload.rama);
    const hasDesempate = Boolean(payload.ramas_desempate && payload.ramas_desempate.length > 0);

    if (!hasRama && !hasDesempate) {
      return NextResponse.json({ error: "No se proporcionó contexto de rama o desempate válido" }, { status: 400 });
    }

    const result = postEvaluarCarrera(payload);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: zodErrorToMessage(error) }, { status: 400 });
    }

    return NextResponse.json({ error: "No se recibieron datos" }, { status: 400 });
  }
}
