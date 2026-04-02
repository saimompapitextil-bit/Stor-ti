import { NextResponse } from "next/server";

/** Verifica se a função serverless responde (sem banco). Útil na Vercel. */
export function GET() {
  return NextResponse.json({ ok: true, service: "stor-ti" });
}
