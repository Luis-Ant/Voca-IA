import { ZodError } from "zod";

export function zodErrorToMessage(error: ZodError): string {
  const first = error.issues[0];
  return first?.message ?? "Payload inválido";
}
