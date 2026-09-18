import { SPECIES_CHAT_FALLBACK, generateResponse } from "@/lib/services/species-chat";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { NextResponse } from "next/server";

// cap message length to prevent excessive costs / malicious usage
const MAX_MESSAGE_LENGTH = 1000;

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  // check for many cases where the request body might be invalid
  if (
    typeof body !== "object" ||
    body === null ||
    !("message" in body) ||
    typeof body.message !== "string" ||
    !body.message.trim()
  ) {
    return NextResponse.json({ error: "Request body must include a non-empty message." }, { status: 400 });
  }

  if (body.message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` }, { status: 400 });
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
