import { env } from "@/env.mjs";
import OpenAI from "openai";

export const SPECIES_CHAT_FALLBACK = "Sorry, I could not process that question.";

// initialize the client outside the function
const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export async function generateResponse(message: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a species and animal information assistant. Only answer questions about animals, species, habitats, behavior, diets, conservation, and related biology. For unrelated questions, politely explain that you only answer species-related questions.",
        }, // prompt
        { role: "user", content: message },
      ],
    });

    const response = completion.choices[0]?.message.content?.trim();
    return response ? response : SPECIES_CHAT_FALLBACK;
  } catch {
    return SPECIES_CHAT_FALLBACK;
  }
}
