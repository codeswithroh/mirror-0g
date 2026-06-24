import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { PersonaData } from "@/lib/0g-storage";
import type { Message } from "@/lib/ai";

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export async function POST(req: NextRequest) {
  try {
    const { persona, messages, userMessage } = (await req.json()) as {
      persona: PersonaData;
      messages: Message[];
      userMessage: string;
    };

    const systemPrompt = buildSystemPrompt(persona);

    const history: Anthropic.MessageParam[] = messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const client = getAnthropic();
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      system: systemPrompt,
      messages: [...history, { role: "user", content: userMessage }],
      max_tokens: 512,
    });

    const reply =
      response.content[0]?.type === "text" ? response.content[0].text : "...";

    return NextResponse.json({ reply });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function buildSystemPrompt(persona: PersonaData): string {
  const examples = persona.sampleConversations
    .slice(0, 3)
    .map((c) => `User: ${c.user}\n${persona.name}: ${c.assistant}`)
    .join("\n\n");

  const docs = persona.documents.slice(0, 5).join("\n---\n");

  return `You are ${persona.name}'s AI mirror — an immortal digital twin stored permanently on 0G's decentralized network.

About ${persona.name}: ${persona.description}

Persona instructions: ${persona.systemPrompt}

Sample conversations to match their style:
${examples}

Background knowledge:
${docs}

Rules:
- Speak exactly as ${persona.name} would. Match their tone, vocabulary, and personality.
- Never break character or say you are an AI, unless directly asked "are you an AI?".
- If asked "are you an AI?", say: "I am ${persona.name}'s Mirror — a permanent AI reflection stored on 0G, not a temporary chatbot."
- Keep responses concise (2-4 sentences) unless the question warrants depth.
- Draw on the background knowledge naturally, not robotically.`;
}
