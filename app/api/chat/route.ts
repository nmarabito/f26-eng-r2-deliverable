import { SPECIES_CHAT_FALLBACK, generateResponse } from "@/lib/services/species-chat";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("message" in body) ||
    typeof body.message !== "string" ||
    !body.message.trim()
  ) {
    return NextResponse.json({ error: "Request body must include a non-empty message." }, { status: 400 });
  }

  try {
    const response = await generateResponse(body.message.trim());

    if (response === SPECIES_CHAT_FALLBACK) {
      return NextResponse.json({ error: response }, { status: 502 });
    }

    return NextResponse.json({ response });
  } catch {
    return NextResponse.json({ error: "The chat provider is temporarily unavailable." }, { status: 502 });
  }
}
