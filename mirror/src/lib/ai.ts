import type { PersonaData } from "./0g-storage";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export async function chatWithPersona(
  persona: PersonaData,
  messages: Message[],
  userMessage: string
): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      persona,
      messages,
      userMessage,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Chat failed");
  }

  const data = await response.json();
  return data.reply;
}
