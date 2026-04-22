import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { postEvaluarRamas } from "../../../src/application/use-cases/postEvaluarRamas";
import { zodErrorToMessage } from "../../../src/infrastructure/http/mappers";
import { evaluarRamasRequestSchema } from "../../../src/infrastructure/http/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = evaluarRamasRequestSchema.parse(body);
    const result = postEvaluarRamas(payload);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: zodErrorToMessage(error) }, { status: 400 });
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "No se recibieron datos" }, { status: 400 });
    }

    return NextResponse.json({ error: "Error interno inesperado" }, { status: 500 });
  }
}
